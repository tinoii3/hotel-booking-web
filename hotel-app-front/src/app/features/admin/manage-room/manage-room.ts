import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationLayoutComponent } from '../../../layouts/pagination/pagination-layout-conponent/pagination-layout-component';
import { ManageRoomService } from './manage-room.service';
import Swal from 'sweetalert2';
import { faArrowDown19, faArrowDownAZ, faPenToSquare, faArrowDown91, faArrowDownZA, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { RoomFormModalComponent } from './components/room-form-modal/room-form-modal.component';
import { RoomTypeModalComponent } from './components/room-type-modal/room-type-modal.component';
import { catchError, EMPTY, filter, from, switchMap } from 'rxjs';

@Component({
  selector: 'app-manage-room',
  standalone: true,
  imports: [CommonModule, PaginationLayoutComponent, FaIconComponent, RoomFormModalComponent, RoomTypeModalComponent],
  templateUrl: './manage-room.html',
  styleUrl: './manage-room.scss',
})
export class ManageRoom implements OnInit {
  faArrowDown19 = faArrowDown19; faArrowDown91 = faArrowDown91;
  faArrowDownAZ = faArrowDownAZ; faArrowDownZA = faArrowDownZA;
  faPenToSquare = faPenToSquare; faTrashCan = faTrashCan;

  rooms: any[] = [];
  roomTypes: any[] = [];
  staffs: any[] = [];
  currentPage: number = 1;
  totalPages: number = 1;
  limit: number = 10;
  currentFilter: string = 'all';
  currentSortBy: string = 'room_number';
  currentSortOrder: 'asc' | 'desc' = 'asc';
  isDropdownOpen: boolean = false;
  isAddTypeModalOpen: boolean = false;
  isRoomModalOpen: boolean = false;
  selectedRoomData: any = null;

  constructor(private roomService: ManageRoomService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.loadRoomTypes();
    this.loadRooms(this.currentPage);
    this.loadStaffNames();
  }

  loadRooms(page: number) {
    this.roomService.getRooms(page, this.limit, this.currentFilter, this.currentSortBy, this.currentSortOrder).subscribe({
      next: (res: any) => {
        this.rooms = res.data || [];
        this.currentPage = Number(res.meta.currentPage) || 1;
        this.totalPages = Number(res.meta.totalPages) || 1;
        this.cdr.detectChanges();
      },
      error: (err) => Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด!',
        text: 'ไม่สามารถดึงข้อมูลห้องพักได้: ' + (err.statusText || 'เซิร์ฟเวอร์ไม่ตอบสนอง'),
        confirmButtonText: 'ปิดหน้าต่าง',
        confirmButtonColor: '#dc3545'
      }),
    });
  }

  loadRoomTypes() {
    this.roomService.getRoomTypes().subscribe({
      next: (res: any) => this.roomTypes = res,
      error: (err) => console.error(err)
    });
  }

  loadStaffNames() {
    this.roomService.getStaffName().subscribe({
      next: (res: any) => {
        this.staffs = res;
      },
      error: (err) => {
        console.error('ไม่สามารถโหลดรายชื่อพนักงานได้', err);
      }
    });
  }

  sortData(columnName: string) {
    if (this.currentSortBy === columnName) {
      this.currentSortOrder = this.currentSortOrder === 'asc' ? 'desc' : 'asc'
    } else {
      this.currentSortBy = columnName; this.currentSortOrder = 'desc'
    }
    this.currentPage = 1;
    this.loadRooms(this.currentPage);
  }

  getFaSortIcon(columnName: string, type: 'number' | 'text') {
    if (this.currentSortBy !== columnName || this.currentSortOrder === 'asc') {
      return type === 'number' ? this.faArrowDown19 : this.faArrowDownAZ;
    } else {
      return type === 'number' ? this.faArrowDown91 : this.faArrowDownZA;
    }
  }

  toggleDropdown() { this.isDropdownOpen = !this.isDropdownOpen; }

  filterType(type: string) {
    this.currentFilter = type;
    this.isDropdownOpen = false;
    this.currentPage = 1;
    this.loadRooms(this.currentPage);
  }

  onPageChange(newPage: number) {
    this.currentPage = newPage;
    this.loadRooms(this.currentPage);
  }

  openAddTypeModal(event: Event) {
    event.stopPropagation();
    this.isDropdownOpen = false;
    this.isAddTypeModalOpen = true;
  }

  openAddModal() {
    this.selectedRoomData = null;
    this.isRoomModalOpen = true;
  }

  openEditModal(room: any) {
    this.selectedRoomData = room;
    this.isRoomModalOpen = true;
  }

  deleteRoom(id: number) {
    from(
      Swal.fire({
        title: 'ยืนยันการลบห้องพัก?',
        text: 'ข้อมูลห้องพักและ "ไฟล์รูปภาพทั้งหมด" ของห้องนี้จะถูกลบทิ้งอย่างถาวร!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'ใช่, ลบทิ้งเลย',
        cancelButtonText: 'ยกเลิก',
        reverseButtons: true
      })
    ).pipe(
      filter(result => result.isConfirmed),
      switchMap(() => this.roomService.deleteRoom(id))
    ).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'ลบสำเร็จ!',
          text: 'ลบรูปภาพเรียบร้อยแล้ว',
          timer: 1500,
          showConfirmButton: false
        });
        this.loadRooms(this.currentPage);
      },
      error: (error) => this.handleError(error, 'ลบห้องพักไม่สำเร็จ')
    });
  }


  deleteRoomType(id: number, typeName: string, event: Event) {
    event.stopPropagation();
    from(
      Swal.fire({
        title: 'ยืนยันการลบ?',
        text: `คุณต้องการลบประเภทห้อง "${typeName}" ใช่หรือไม่?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'ใช่, ลบทิ้งเลย!',
        cancelButtonText: 'ยกเลิก',
        reverseButtons: true
      })
    ).pipe(
      filter(result => result.isConfirmed),
      switchMap(() =>
        this.roomService.deleteRoomType(id).pipe(
          catchError((err) => {
            Swal.fire({
              icon: 'error',
              title: 'ลบไม่ได้',
              text: err.error?.message || 'เกิดข้อผิดพลาดในหารลบ',
              confirmButtonColor: '#d4af37'
            });
            return EMPTY;
          })
        )
      )
    ).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'ลบสำเร็จ!',
          showConfirmButton: false,
          timer: 1500
        });
        this.loadRoomTypes();
        if (this.currentFilter === typeName) {
          this.filterType('all');
        }
      },
    });
  }


  handleError(error: any, defaultMsg: string) {
    console.error('เกิดข้อผิดพลาด:', error);
    Swal.fire({
      icon: 'error',
      title: 'เกิดข้อผิดพลาด!',
      text: `${defaultMsg}: ${error.statusText || 'เซิร์ฟเวอร์ไม่ตอบสนอง'}`,
      confirmButtonText: 'ปิดหน้าต่าง',
      confirmButtonColor: '#dc3545'
    });
  }
}