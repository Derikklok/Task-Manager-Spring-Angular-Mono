import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, tap, shareReplay } from 'rxjs/operators';
import { Task } from '../models';
import { environment } from '../../env';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = environment.apiBaseUrl;
  private tasksCache: Task[] | null = null;
  private tasksLoading = false;
  private tasksLoadingSubject = new Observable<Task[]>();

  constructor(private http: HttpClient) {}

  getTasks(): Observable<Task[]> {
    console.log('getTasks() called - Cache exists:', !!this.tasksCache, 'Loading:', this.tasksLoading);
    
    // Return cached tasks immediately if available and not loading
    if (this.tasksCache && !this.tasksLoading) {
      console.log('Returning cached tasks, count:', this.tasksCache.length);
      return of(this.tasksCache);
    }
    
    // If already loading, don't make another request
    if (this.tasksLoading) {
      console.log('Already loading tasks, waiting for current request...');
      // Return a delayed observable that waits for the cache to be populated
      return new Observable(observer => {
        const interval = setInterval(() => {
          if (this.tasksCache && !this.tasksLoading) {
            clearInterval(interval);
            observer.next(this.tasksCache!);
            observer.complete();
          }
        }, 100);
        
        // Cleanup on unsubscribe
        return () => clearInterval(interval);
      });
    }
    
    console.log('Making fresh API request to:', `${this.apiUrl}/tasks`);
    this.tasksLoading = true;
    
    return this.http.get<Task[]>(`${this.apiUrl}/tasks`)
      .pipe(
        tap(data => {
          console.log('Tasks loaded successfully, count:', data.length);
          this.tasksCache = data;
          this.tasksLoading = false;
        }),
        catchError(error => {
          this.tasksLoading = false;
          this.tasksCache = null;
          return this.handleError(error, 'Failed to load tasks');
        })
      );
  }

  getTaskById(id: number): Observable<Task> {
    console.log('Fetching task with id:', id);
    return this.http.get<Task>(`${this.apiUrl}/tasks/${id}`)
      .pipe(
        tap(data => console.log('Task loaded:', data)),
        catchError(error => this.handleError(error, 'Failed to load task'))
      );
  }

  deleteTask(id: number): Observable<void> {
    console.log('Deleting task:', id);
    return this.http.delete<void>(`${this.apiUrl}/tasks/${id}`)
      .pipe(
        tap(() => {
          console.log('Task deleted successfully');
          this.clearCache();
        }),
        catchError(error => this.handleError(error, 'Failed to delete task'))
      );
  }

  createTask(task: Task): Observable<Task> {
    console.log('Creating task:', task);
    return this.http.post<Task>(`${this.apiUrl}/tasks`, task)
      .pipe(
        tap(data => {
          console.log('Task created:', data);
          this.clearCache();
        }),
        catchError(error => this.handleError(error, 'Failed to create task'))
      );
  }

  updateTask(id: number, task: Task): Observable<Task> {
    console.log('Updating task:', id, task);
    return this.http.put<Task>(`${this.apiUrl}/tasks/${id}`, task)
      .pipe(
        tap(data => {
          console.log('Task updated:', data);
          this.clearCache();
        }),
        catchError(error => this.handleError(error, 'Failed to update task'))
      );
  }

  patchTask(id: number, updates: Partial<Task>): Observable<Task> {
    console.log('Patching task:', id, updates);
    return this.http.patch<Task>(`${this.apiUrl}/tasks/${id}`, updates)
      .pipe(
        tap(data => {
          console.log('Task patched:', data);
          this.clearCache();
        }),
        catchError(error => this.handleError(error, 'Failed to patch task'))
      );
  }

  clearCache(): void {
    console.log('Clearing tasks cache');
    this.tasksCache = null;
    this.tasksLoading = false;
  }

  private handleError(error: any, message: string) {
    console.error(message, error);
    
    if (error.status === 403) {
      return throwError(() => new Error('Access denied. Please check your permissions and token.'));
    } else if (error.status === 401) {
      return throwError(() => new Error('Unauthorized. Please log in again.'));
    } else if (error.status === 0) {
      return throwError(() => new Error('Network error. Unable to connect to the server.'));
    }
    
    return throwError(() => new Error(error.error?.message || message));
  }
}
