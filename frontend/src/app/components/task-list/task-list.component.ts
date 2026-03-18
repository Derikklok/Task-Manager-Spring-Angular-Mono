import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { AuthService } from '../../services/auth.service';
import { Task, TaskStatus } from '../../models';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export class TaskListComponent implements OnInit, OnDestroy {
  @ViewChild('deleteConfirmModal') deleteConfirmModal!: ElementRef;
  
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  loading = false;
  error: string | null = null;
  selectedFilter: TaskStatus | 'ALL' = 'ALL';
  searchQuery = '';
  taskToDelete: number | null = null;
  isDeleting = false;
  dropdownOpen = false;
  private subscription: Subscription | null = null;
  private bootstrapModal: any = null;

  statusOptions: { value: TaskStatus | 'ALL'; label: string }[] = [
    { value: 'ALL', label: 'All Tasks' },
    { value: 'TODO', label: 'To Do' },
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'COMPLETED', label: 'Completed' }
  ];

  constructor(
    private taskService: TaskService,
    public authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('TaskListComponent initialized');
    console.log('✅ Bootstrap available:', !!(window as any).bootstrap);
    this.loadTasks();
  }

  ngOnDestroy(): void {
    console.log('TaskListComponent destroyed, cleaning up subscriptions');
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  loadTasks(): void {
    console.log('Loading tasks...');
    this.loading = true;
    this.error = null;

    // Unsubscribe from previous subscription if exists
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    this.subscription = this.taskService.getTasks().subscribe({
      next: (tasks) => {
        console.log('Tasks received:', tasks.length);
        this.tasks = tasks;
        this.filterTasks();
        this.loading = false;
        
        // Force change detection to update the UI
        console.log('Triggering change detection...');
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Load tasks error:', error);
        this.error = error.message || 'Failed to load tasks';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  filterTasks(): void {
    let filtered = this.tasks;

    // Filter by status
    if (this.selectedFilter !== 'ALL') {
      filtered = filtered.filter(task => task.status === this.selectedFilter);
    }

    // Filter by search query
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(query) ||
        (task.description && task.description.toLowerCase().includes(query))
      );
    }

    this.filteredTasks = filtered;
    this.cdr.detectChanges();
  }

  onFilterChange(): void {
    console.log('Filter changed to:', this.selectedFilter);
    this.filterTasks();
  }

  onSearchChange(): void {
    console.log('Search query changed to:', this.searchQuery);
    this.filterTasks();
  }

  deleteTask(id: number | undefined): void {
    if (!id) return;
    
    this.taskToDelete = id;
    
    // Show the modal with better error handling
    try {
      if (this.deleteConfirmModal && this.deleteConfirmModal.nativeElement) {
        // Ensure Bootstrap is loaded
        if ((window as any).bootstrap && (window as any).bootstrap.Modal) {
          this.bootstrapModal = new (window as any).bootstrap.Modal(this.deleteConfirmModal.nativeElement);
          this.bootstrapModal.show();
          console.log('✅ Delete confirmation modal shown successfully');
        } else {
          console.error('❌ Bootstrap Modal not available. Bootstrap JS may not be loaded.');
          alert('Unable to load confirmation dialog. Please try again.');
        }
      } else {
        console.error('❌ Modal reference not found. deleteConfirmModal is:', this.deleteConfirmModal);
      }
    } catch (error) {
      console.error('❌ Error showing delete confirmation modal:', error);
      alert('An error occurred. Please try again.');
    }
  }

  confirmDelete(): void {
    if (!this.taskToDelete) return;
    
    this.isDeleting = true;
    const idToDelete = this.taskToDelete;
    
    this.taskService.deleteTask(idToDelete).subscribe({
      next: () => {
        this.isDeleting = false;
        this.taskToDelete = null;
        if (this.bootstrapModal) {
          this.bootstrapModal.hide();
        }
        this.loadTasks();
      },
      error: (error) => {
        this.isDeleting = false;
        this.error = 'Failed to delete task';
        console.error('Delete error:', error);
        if (this.bootstrapModal) {
          this.bootstrapModal.hide();
        }
      }
    });
  }

  cancelDelete(): void {
    this.taskToDelete = null;
    if (this.bootstrapModal) {
      this.bootstrapModal.hide();
    }
  }

  getStatusBadgeClass(status: TaskStatus): string {
    switch (status) {
      case 'TODO':
        return 'warning';
      case 'IN_PROGRESS':
        return 'info';
      case 'COMPLETED':
        return 'success';
      default:
        return 'secondary';
    }
  }

  getStatusLabel(status: TaskStatus): string {
    switch (status) {
      case 'TODO':
        return 'To Do';
      case 'IN_PROGRESS':
        return 'In Progress';
      case 'COMPLETED':
        return 'Completed';
      default:
        return status;
    }
  }

  getFilterLabel(filter: TaskStatus | 'ALL'): string {
    const option = this.statusOptions.find(o => o.value === filter);
    return option ? option.label : 'All Tasks';
  }

  onSelectFilter(filter: TaskStatus | 'ALL'): void {
    this.selectedFilter = filter;
    this.onFilterChange();
  }

  logout(): void {
    this.authService.logout();
    // Router navigation handled by guard
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
    this.cdr.detectChanges();
  }

  selectFilterOption(filter: TaskStatus | 'ALL'): void {
    this.selectedFilter = filter;
    this.dropdownOpen = false;
    this.filterTasks();
    this.cdr.detectChanges();
  }
}
