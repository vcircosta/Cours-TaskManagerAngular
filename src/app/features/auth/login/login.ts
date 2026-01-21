import {Component, inject} from '@angular/core';
import {AuthService} from '../../../core/auth/services/auth-service';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  loginForm = this.fb.nonNullable.group({
    username: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit() {
    if (this.loginForm.valid) {
      const credentials = this.loginForm.getRawValue();
      this.authService.login(credentials).subscribe({
        next: () => this.router.navigate(['/tasks']),
        error: (err) => console.error('Erreur de connexion', err)
      });
    }
  }
}