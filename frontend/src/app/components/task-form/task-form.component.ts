import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../services/task.service';
import { Task, TaskStatus } from '../../models';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css'
})
export class TaskFormComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  submitting = false;
  error: string | null = null;
  isEditMode = false;
  taskId: number | null = null;

  statusOptions: { value: TaskStatus; label: string }[] = [
    { value: 'TODO', label: 'To Do' },
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'COMPLETED', label: 'Completed' }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private taskService: TaskService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]],
      description: ['', [Validators.maxLength(1000)]],
      status: ['TODO', Validators.required]
    });

    this.route.params.subscribe(params => {
      if (params['id'] && params['id'] !== 'new') {
        this.taskId = parseInt(params['id'], 10);
        this.isEditMode = true;
        this.loadTask();
      }
    });
  }

  get f() {
    return this.form.controls;
  }

  loadTask(): void {
    if (!this.taskId) return;

    this.loading = true;
    this.error = null;

    this.taskService.getTaskById(this.taskId).subscribe({
      next: (task) => {
        this.form.patchValue({
          title: task.title,
          description: task.description || '',
          status: task.status
        });
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.error = 'Failed to load task';
        this.loading = false;
        this.cdr.detectChanges();
        console.error('Load task error:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      Object.keys(this.form.controls).forEach(key => {
        this.form.get(key)?.markAsTouched();
      });
      this.cdr.detectChanges();
      return;
    }

    this.submitting = true;
    this.error = null;

    const formValue = this.form.value;

    if (this.isEditMode && this.taskId) {
      this.taskService.updateTask(this.taskId, formValue).subscribe({
        next: () => {
          this.router.navigate(['/tasks']);
        },
        error: (error) => {
          this.error = 'Failed to update task';
          this.submitting = false;
          this.cdr.detectChanges();
          console.error('Update error:', error);
        }
      });
    } else {
      this.taskService.createTask(formValue).subscribe({
        next: () => {
          this.router.navigate(['/tasks']);
        },
        error: (error) => {
          this.error = 'Failed to create task';
          this.submitting = false;
          this.cdr.detectChanges();
          console.error('Create error:', error);
        }
      });
    }
  }

  getFieldError(fieldName: string): string | null {
    const field = this.form.get(fieldName);

    if (!field || !field.errors || !field.touched) {
      return null;
    }

    if (field.errors['required']) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
    }
    if (field.errors['minlength']) {
      return `${fieldName} must be at least ${field.errors['minlength'].requiredLength} characters`;
    }
    if (field.errors['maxlength']) {
      return `${fieldName} cannot exceed ${field.errors['maxlength'].requiredLength} characters`;
    }

    return null;
  }
}
