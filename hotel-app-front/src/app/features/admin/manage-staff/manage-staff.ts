import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PaginationLayoutComponent } from '../../../layouts/pagination/pagination-layout-conponent/pagination-layout-component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faArrowDown19, faArrowDown91, faArrowDownAZ, faArrowDownZA, faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { ManageStaffService } from './manage-staff.service';
import { StaffFormModal } from './components/staff-form-modal/staff-form-modal';

@Component({
  selector: 'app-manage-staff',
  imports: [CommonModule, FormsModule, PaginationLayoutComponent, FaIconComponent, StaffFormModal],
  templateUrl: './manage-staff.html',
  styleUrl: './manage-staff.scss',
})
export class ManageStaff {
  faArrowDown19 = faArrowDown19; 
  faArrowDown91 = faArrowDown91;
  faArrowDownAZ = faArrowDownAZ; 
  faArrowDownZA = faArrowDownZA;
  faPenToSquare = faPenToSquare; 
  faTrashCan = faTrashCan;

  staffs: any[] = [];
  currentPage: number = 1;
  totalPages: number = 1;
  limit: number = 10;
  currentSortBy: string = 'id';
  currentSortOrder: 'asc' | 'desc' = 'asc';

  isModalOpen: boolean = false;
  selectedStaffData: any = null;

  constructor(private staffService: ManageStaffService) { }

  ngOnInit() {
    this.loadStaffs(this.currentPage);
  }

  loadStaffs(page: number) {
    this.staffService.getStaffs(page, this.limit, this.currentSortBy, this.currentSortOrder).subscribe({
      next: (res: any) => {
        this.staffs = res.data || [];
        this.currentPage = res.meta?.currentPage || 1;
        this.totalPages = res.meta?.totalPages || 1;
      },
      error: (err) => Swal.fire({ 
        icon: 'error', 
        title: 'ไม่สามารถดึงข้อมูลผู้แลได้',
        confirmButtonText: 'ปิดหน้าต่าง',
        confirmButtonColor: '#dc3545' })
    });
  }

  sortData(columnName: string) {
    if (this.currentSortBy === columnName) {
      this.currentSortOrder = this.currentSortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.currentSortBy = columnName; 
      this.currentSortOrder = 'desc';
    }
    this.loadStaffs(1);
  }

  getFaSortIcon(columnName: string, type: 'number' | 'text') {
    if (this.currentSortBy !== columnName || this.currentSortOrder === 'asc') {
      return type === 'number' ? this.faArrowDown19 : this.faArrowDownAZ;
    }
    return type === 'number' ? this.faArrowDown91 : this.faArrowDownZA;
  }

  onPageChange(newPage: number) {
    this.loadStaffs(newPage);
  }

  openModal(staff: any = null) {
    this.selectedStaffData = staff;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  deleteStaff(id: number) {
    Swal.fire({
      title: 'ลบข้อมูลผู้ดูแล?', text: "ข้อมูลนี้จะถูกลบอย่างถาวร!", icon: 'warning',
      showCancelButton: true, confirmButtonColor: '#dc3545', confirmButtonText: 'ลบทิ้ง', reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.staffService.deleteStaff(id).subscribe({
          next: () => {
            Swal.fire({ icon: 'success', title: 'ลบสำเร็จ!', showConfirmButton: false, timer: 1500 });
            this.loadStaffs(this.currentPage);
          }
        });
      }
    });
  }
}
