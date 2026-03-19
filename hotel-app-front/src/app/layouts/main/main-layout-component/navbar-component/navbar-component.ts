import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth-service';
import { TokenService } from '../../../../core/services/token-service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-navbar-component',
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar-component.html',
  styleUrl: './navbar-component.scss',
})
export class NavbarComponent {
  private authService = inject(AuthService);
  private tokenService = inject(TokenService);
  private router = inject(Router);

  isLoggedIn(): boolean {
    return this.tokenService.isLoggedIn();
  }

  logout() {
    Swal.fire({
      title: 'ออกจากระบบ?',
      text: 'คุณจะต้องเข้าสู่ระบบอีกครั้ง',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'ยกเลิก',
      confirmButtonText: 'ใช่',
      buttonsStyling: false,
      reverseButtons: true,
      customClass: {
        cancelButton: 'btn-dialog btn-dialog-secondary',
        confirmButton: 'btn-dialog btn-dialog-primary',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.logout();

        Swal.fire({
          icon: 'success',
          title: 'ออกจากระบบแล้ว',
          text: 'คุณได้ออกจากระบบแล้ว',
          timer: 1500,
          showConfirmButton: false,
        }).then(() => {
          this.router.navigate(['/auth/login']);
        });
      }
    });
  }
  // text: 'You will need to login again.',
  // icon: 'warning',

  // showCancelButton: true,
  // confirmButtonText: 'Yes',
  // cancelButtonText: 'Cancel',

  // buttonsStyling: false,

  // customClass: {
  //   confirmButton: 'swal-confirm-btn',
  //   cancelButton: 'swal-cancel-btn',

  // }
}
