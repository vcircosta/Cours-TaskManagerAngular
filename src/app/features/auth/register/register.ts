import { Component, DestroyRef, inject, signal } from '@angular/core';
import { AuthService } from '../../../core/auth/services/auth-service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Credentials } from '../../../core/auth/interfaces/credentials';
import { Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  errorMessage = signal('');

  registerForm = this.fb.nonNullable.group({
    username: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const credentials: Credentials = this.registerForm.getRawValue();
    
    this.authService.register(credentials)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          console.log('User created');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error(err);
          const message = err?.error?.message || 'Une erreur est survenue lors de l\'inscription';
          this.errorMessage.set(message);
        }
      });
  }
}