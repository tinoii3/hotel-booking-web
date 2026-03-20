import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth-service';
import { RegisterResponse } from '../../models/register-response';
import Swal from 'sweetalert2';
import { LoginResponse } from '../../models/login-response';
import { catchError, switchMap, throwError } from 'rxjs';

@Component({
  selector: 'app-register-page',
  imports: [FormsModule, RouterLink, ReactiveFormsModule],
  templateUrl: './register-page.html',
  styleUrl: './register-page.scss',
})
export class RegisterPage {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.registerForm = this.fb.group(
      {
        email: ['', [Validators.email, Validators.required]],
        username: ['', Validators.required],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator },
    );
  }

  register() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const payload = this.registerForm.value;

    this.authService
      .register(payload)
      .pipe(
        switchMap((res: RegisterResponse) => {
          const loginPayload = {
            username: payload.username,
            password: payload.password,
          };
          return this.authService.login(loginPayload).pipe(
            catchError((loginErr) =>
              throwError(() => ({ type: 'LOGIN_ERROR', originalError: loginErr })),
            ),
          );
        }),
      )
      .subscribe({
        next: (loginRes: LoginResponse) => {
          Swal.fire({
            icon: 'success',
            title: 'สมัครสมาชิกสำเร็จ',
            text: 'กำลังเข้าสู่ระบบอัตโนมัติ...',
            timer: 1500,
            showConfirmButton: false,
          }).then(() => {
            if (loginRes.role === 'admin') {
              this.router.navigate(['/admin/']);
            } else {
              this.router.navigate(['/hotel/']);
            }
          });
        },

        error: (err) => {
          if (err.type === 'LOGIN_ERROR') {
            Swal.fire({
              icon: 'info',
              title: 'สมัครสมาชิกสำเร็จ',
              text: 'กรุณาเข้าสู่ระบบด้วยตนเอง',
              timer: 1500,
              showConfirmButton: false,
            }).then(() => {
              this.router.navigate(['/auth/login']);
            });
            return;
          }

          if (err.status === 400 && err.error?.message === 'Username already exists') {
            Swal.fire({
              icon: 'error',
              title: 'สมัครสมาชิกไม่สำเร็จ',
              text: 'ชื่อผู้ใช้นี้ถูกใช้งานแล้ว กรุณาเลือกชื่อผู้ใช้ใหม่',
              confirmButtonColor: '#1e3a5f',
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'สมัครสมาชิกไม่สำเร็จ',
              text: 'เกิดข้อผิดพลาดที่ไม่คาดคิด โปรดลองอีกครั้งในภายหลัง',
              confirmButtonColor: '#1e3a5f',
            });
          }
        },
      });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirm = form.get('confirmPassword')?.value;

    if (password !== confirm) {
      form.get('confirmPassword')?.setErrors({ mismatch: true });
    } else {
      form.get('confirmPassword')?.setErrors(null);
    }
  }
}