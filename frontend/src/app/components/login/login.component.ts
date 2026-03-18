import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  submitted = false;
  error: string | null = null;
  isRegisterMode = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['DEVELOPER']
    });

    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/tasks']);
    }
  }

  get f() {
    return this.form.controls;
  }

  toggleMode(): void {
    this.isRegisterMode = !this.isRegisterMode;
    this.error = null;
    this.submitted = false;
    this.cdr.detectChanges();
  }

  onSubmit(): void {
    this.submitted = true;
    this.error = null;

    if (this.form.invalid) {
      this.cdr.detectChanges();
      return;
    }

    this.loading = true;
    this.cdr.detectChanges();

    if (this.isRegisterMode) {
      this.authService.register(this.form.value).subscribe({
        next: () => {
          this.router.navigate(['/tasks']);
        },
        error: (error) => {
          this.error = error;
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
    } else {
      this.authService.login(this.form.value).subscribe({
        next: () => {
          const returnUrl = this.route.snapshot.queryParams['returnUrl'];
          this.router.navigate([returnUrl || '/tasks']);
        },
        error: (error) => {
          this.error = error;
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
    }
  }
}
