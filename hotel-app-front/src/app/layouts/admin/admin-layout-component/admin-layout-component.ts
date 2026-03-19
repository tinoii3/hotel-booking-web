import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule, Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../../core/services/auth-service';
import Swal from 'sweetalert2';
import { filter } from 'rxjs';

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

  pageTitle: string = 'Dashboard';

  private routeTitles: { [key: string]: string } = {
    '/admin/dashboard': 'Dashboard',
    '/admin/manage-room': 'จัดการห้องพัก',
    '/admin/reservations': 'การจอง',
    '/admin/manage-staff': 'การจัดการผู้ดูแล'
  };

  ngOnInit() {
    this.updateTitle(this.router.url);
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.updateTitle(event.urlAfterRedirects);
    });
  }

  private updateTitle(url: string) {
    const path = url.split('?')[0];
    this.pageTitle = this.routeTitles[path] || 'Hotel Admin';
  }

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
          title: 'ออกจากระบบสำเร็จ',
          text: 'คุณได้ออกจากระบบแล้ว',
          timer: 1500,
          showConfirmButton: false,
        }).then(() => {
          this.router.navigate(['/auth/login']);
        });
      }
    });
  }
}
