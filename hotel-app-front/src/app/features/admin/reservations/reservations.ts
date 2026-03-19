import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaginationLayoutComponent } from '../../../layouts/pagination/pagination-layout-conponent/pagination-layout-component';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationLayoutComponent],
  templateUrl: './reservations.html',
  styleUrl: './reservations.scss',
})
export class ReservRoom implements OnInit {

  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);

  reservations: any[] = [];
  roomTypes: any[] = [];

  selectedRoomType: string = '';
  selectedPaymentStatus: string = '';

  currentPage: number = 1;
  totalPages: number = 1;
  limit: number = 10;

  isDropdownOpen: boolean = false;

  ngOnInit() {
    this.loadRoomTypes();
    this.loadReservations(this.currentPage);
  }

  loadReservations(page: number) {

    let url = `/api/reserv/reservations?page=${page}&limit=${this.limit}`;

    if (this.selectedRoomType) {
      url += `&roomType=${this.selectedRoomType}`;
    }

    if (this.selectedPaymentStatus) {
      url += `&paymentStatus=${this.selectedPaymentStatus}`;
    }

    this.http.get(url).subscribe({
      next: (response: any) => {
        console.log('โหลด reservation สำเร็จ:', response);

        this.reservations = response.data || [];
        this.currentPage = response.meta.currentPage || 1;
        this.totalPages = response.meta.totalPages || 1;

        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error(error);

        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด!',
          text: 'ไม่สามารถโหลดข้อมูลการจองได้',
          confirmButtonColor: '#dc3545'
        });
      }
    });
  }

  loadRoomTypes() {
    this.http.get(`/api/reserv/room-types`).subscribe({
      next: (response: any) => {
        this.roomTypes = response;
      },

      error: (error) => {
        console.error('โหลด room type ไม่สำเร็จ', error);
      }
    });
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  filterType(type: string) {
    this.selectedRoomType = type;
    this.isDropdownOpen = false;
    this.currentPage = 1;
    this.loadReservations(this.currentPage);
  }

  onPaymentStatusChange() {
    this.currentPage = 1;
    this.loadReservations(this.currentPage);
  }

  onPageChange(newPage: number) {
    this.loadReservations(newPage);
  }

}