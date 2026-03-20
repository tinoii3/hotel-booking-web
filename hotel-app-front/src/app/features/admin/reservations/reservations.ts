import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaginationLayoutComponent } from '../../../layouts/pagination/pagination-layout-conponent/pagination-layout-component';
import Swal from 'sweetalert2';
import { ReservationService } from './reservations.service';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { faArrowDown19, faArrowDownAZ, faPenToSquare, faArrowDown91, faArrowDownZA, faTrashCan } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationLayoutComponent, FaIconComponent],
  templateUrl: './reservations.html',
  styleUrl: './reservations.scss',
})
export class Reservation implements OnInit {

  private reservationService = inject(ReservationService);
  private cdr = inject(ChangeDetectorRef);

  faArrowDown19 = faArrowDown19;
  faArrowDown91 = faArrowDown91;
  faArrowDownAZ = faArrowDownAZ;
  faArrowDownZA = faArrowDownZA;
  faPenToSquare = faPenToSquare;
  faTrashCan = faTrashCan;

  reservations: any[] = [];
  roomTypes: any[] = [];

  selectedRoomType: string = 'all';
  selectedStatus: string = 'all';

  currentPage: number = 1;
  totalPages: number = 1;
  limit: number = 10;

  currentSortBy: string = 'created_at';
  currentSortOrder: 'asc' | 'desc' = 'desc';

  isDropdownOpen: boolean = false;
  isStatusDropdownOpen: boolean = false;

  ngOnInit() {
    this.loadRoomTypes();
    this.loadReservations(1);
  }

  loadReservations(page: number) {
    this.reservationService.getReservations(
      page,
      this.limit,
      this.selectedRoomType,
      this.selectedStatus,
      this.currentSortBy,
      this.currentSortOrder
    ).subscribe({
      next: (response: any) => {
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
    this.reservationService.getRoomTypes().subscribe({
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
    this.isStatusDropdownOpen = false;
  }

  toggleStatusDropdown() {
    this.isStatusDropdownOpen = !this.isStatusDropdownOpen;
    this.isDropdownOpen = false;
  }

  filterType(type: string) {
    this.selectedRoomType = type;
    this.isDropdownOpen = false;
    this.currentPage = 1;
    this.loadReservations(1);
  }

  filterStatus(status: string) {
    this.selectedStatus = status;
    this.isStatusDropdownOpen = false;
    this.currentPage = 1;
    this.loadReservations(1);
  }

  sortData(columnName: string) {
    if (this.currentSortBy === columnName) {
      this.currentSortOrder = this.currentSortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.currentSortBy = columnName;
      this.currentSortOrder = 'desc';
    }

    this.loadReservations(1);
  }

  getFaSortIcon(columnName: string, type: 'number' | 'text' | 'date') {
    if (this.currentSortBy !== columnName || this.currentSortOrder === 'asc') {
      return type === 'number' || type === 'date'
        ? this.faArrowDown19
        : this.faArrowDownAZ;
    }

    return type === 'number' || type === 'date'
      ? this.faArrowDown91
      : this.faArrowDownZA;
  }

  onPageChange(newPage: number) {
    this.currentPage = newPage;
    this.loadReservations(newPage);
  }

  updateReservationStatus(id: number, status: string) {
    this.reservationService.updateReservationStatus(id, { status }).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'อัปเดตสถานะสำเร็จ',
          timer: 1200,
          showConfirmButton: false
        });

        this.loadReservations(this.currentPage);
      },

      error: (err) => {
        console.error(err);

        Swal.fire({
          icon: 'error',
          title: 'แก้ไขสถานะไม่สำเร็จ',
          confirmButtonColor: '#dc3545'
        });
      }
    });
  }

  openStatusPopup(reservation: any) {
    Swal.fire({
      title: 'แก้ไขสถานะการจอง',
      input: 'select',
      inputValue: reservation.status,
      inputOptions: {
        PENDING: 'รอการชำระ',
        CONFIRMED: 'ยืนยันการจอง',
        CANCELLED: 'ยกเลิกการจอง'
      },
      showCancelButton: true,
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก',
      customClass: {
        cancelButton: 'btn-dialog btn-dialog-secondary',
        confirmButton: 'btn-dialog btn-dialog-primary',
      },
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        this.updateReservationStatus(reservation.id, result.value);
      }
    });
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'PENDING':
        return 'รอการชำระ';
      case 'CONFIRMED':
        return 'ยืนยันการจอง';
      case 'CANCELLED':
        return 'ยกเลิกการจอง';
      case 'EXPIRED':
        return 'หมดเวลา';
      case 'COMPLETED':
        return 'เสร็จสิ้น';
      default:
        return status;
    }
  }

  clearFilters() {
  this.selectedRoomType = 'all';
  this.selectedStatus = 'all';
  this.currentSortBy = 'created_at';
  this.currentSortOrder = 'desc';
  this.isDropdownOpen = false;
  this.isStatusDropdownOpen = false;
  this.currentPage = 1;
  this.loadReservations(1);
}
}