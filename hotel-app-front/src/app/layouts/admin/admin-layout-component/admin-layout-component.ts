import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth-service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-layout-component',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './admin-layout-component.html',
  styleUrl: './admin-layout-component.scss',
})
export class AdminLayout {
  private authService = inject(AuthService);
  private router = inject(Router);

  logout() {
    Swal.fire({
      title: 'Logout?',
      text: 'You will need to login again.',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Yes',
      reverseButtons: true,
      buttonsStyling: false,
      customClass: {
        cancelButton: 'btn-dialog btn-dialog-secondary',
        confirmButton: 'btn-dialog btn-dialog-primary',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.logout();

        Swal.fire({
          icon: 'success',
          title: 'Logged out',
          text: 'See you again!',
          timer: 1500,
          showConfirmButton: false,
        }).then(() => {
          this.router.navigate(['/auth/login']);
        });
      }
    });
  }
}
