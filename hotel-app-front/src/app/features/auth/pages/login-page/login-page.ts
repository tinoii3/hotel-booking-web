import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth-service';
import Swal from 'sweetalert2';
import { LoginResponse } from '../../models/login-response';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss',
})
export class LoginPage {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  login() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();

      return;
    }

    const payload = this.loginForm.value;

    this.authService.login(payload).subscribe({
      next: (res: LoginResponse) => {

        Swal.fire({
          icon: 'success',
          title: 'Login successful',
          text: 'Welcome back!',
          timer: 1500,
          showConfirmButton: false,
        }).then(() => {
          if (res.role === 'admin') {
            this.router.navigate(['/admin/']);
          } else {
            this.router.navigate(['/hotel/']);
          }
        });

      },

      error: (err) => {

        if (err.status === 401) {

          Swal.fire({
            icon: 'error',
            title: 'Login failed',
            text: err.error?.message || 'Invalid username or password',
            confirmButtonColor: '#1e3a5f',
          });

        } else {

          Swal.fire({
            icon: 'error',
            title: 'Server error',
            text: 'Something went wrong. Please try again later.',
            confirmButtonColor: '#1e3a5f',
          });

        }

        console.error('LOGIN ERROR', err);

      },
    });
  }

}
