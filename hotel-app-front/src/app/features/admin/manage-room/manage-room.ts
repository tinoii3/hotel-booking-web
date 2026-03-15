import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaginationLayoutComponent } from '../../../layouts/pagination/pagination-layout-conponent/pagination-layout-component';
import { ManageRoomService } from './manage-room.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage-room',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationLayoutComponent],
  templateUrl: './manage-room.html',
  styleUrl: './manage-room.scss',
})
export class ManageRoom implements OnInit {
  private roomService = inject(ManageRoomService);
  private cdr = inject(ChangeDetectorRef);

  rooms: any[] = [];
  roomTypes: any[] = [];

  currentPage: number = 1;
  totalPages: number = 1;
  limit: number = 10;

  isRoomModalOpen: boolean = false;
  isDeleteModalOpen: boolean = false;
  pendingDeleteId: number | null = null;
  editId: number | null = null;
  isDropdownOpen: boolean = false;
  currentFilter: string = 'all';

  f_room_number = '';
  f_room_type_id = '';
  f_floor: number | '' = '';
  f_staff_id: number | '' = '';
  f_status = 'available';

  ngOnInit() {
    this.loadRoomTypes();
    this.loadRooms(this.currentPage);
  }

  loadRooms(page: number) {
    this.roomService.getRooms(page, this.limit).subscribe({
      next: (response: any) => {
        console.log('ได้รับข้อมูลสำเร็จ:', response);
        this.rooms = response.data || [];
        this.currentPage = response.meta.currentPage || 1;
        this.totalPages = response.meta.totalPages || 1;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('เกิดข้อผิดพลาด:', error);
        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด!',
          text: 'ไม่สามารถดึงข้อมูลห้องพักได้: ' + (error.statusText || 'เซิร์ฟเวอร์ไม่ตอบสนอง'),
          confirmButtonText: 'ปิดหน้าต่าง',
          confirmButtonColor: '#dc3545'
        });
      },
      complete: () => {
        console.log('การทำงานเสร็จสิ้น (Load Rooms)');
      }
    });
  }

  loadRoomTypes() {
    this.roomService.getRoomTypes().subscribe({
      next: (response: any) => {
        this.roomTypes = response;
      },
      error: (error) => console.error('ไม่สามารถดึงข้อมูลประเภทห้องได้', error)
    });
  }

  saveRoom() {
    if (!this.f_room_number.trim() || !this.f_room_type_id) {
      Swal.fire({ icon: 'warning', title: 'แจ้งเตือน', text: 'กรุณากรอกข้อมูลให้ครบถ้วน', confirmButtonColor: '#d4af37' });
      return;
    }

    const payload = {
      room_number: this.f_room_number,
      room_type_id: Number(this.f_room_type_id),
      floor: this.f_floor ? Number(this.f_floor) : null,
      staff_id: this.f_staff_id ? Number(this.f_staff_id) : null,
      status: this.f_status
    };

    if (this.editId) {
      this.roomService.updateRoom(this.editId, payload).subscribe({
        next: (response: any) => {
          console.log('แก้ไขข้อมูลสำเร็จ:', response);
          Swal.fire({ icon: 'success', title: 'สำเร็จ!', text: 'แก้ไขข้อมูลห้องพักเรียบร้อยแล้ว', confirmButtonText: 'ตกลง', confirmButtonColor: '#d4af37' });
          this.closeRoomModal();
          this.loadRooms(this.currentPage);
        },
        error: (error) => this.handleError(error, 'แก้ไขข้อมูลไม่สำเร็จ'),
        complete: () => console.log('การทำงานเสร็จสิ้น (Update Room)')
      });
    } else {
      this.roomService.createRoom(payload).subscribe({
        next: (response: any) => {
          console.log('สร้างข้อมูลสำเร็จ:', response);
          Swal.fire({ icon: 'success', title: 'สำเร็จ!', text: 'เพิ่มห้องพักใหม่เรียบร้อยแล้ว', confirmButtonText: 'ตกลง', confirmButtonColor: '#d4af37' });
          this.closeRoomModal();
          this.loadRooms(this.currentPage);
        },
        error: (error) => this.handleError(error, 'เพิ่มข้อมูลไม่สำเร็จ'),
        complete: () => console.log('การทำงานเสร็จสิ้น (Create Room)')
      });
    }
  }

  confirmDelete() {
    if (!this.pendingDeleteId) return;

    this.roomService.deleteRoom(this.pendingDeleteId).subscribe({
      next: (response: any) => {
        console.log('ลบข้อมูลสำเร็จ:', response);
        Swal.fire({ 
          icon: 'success', 
          title: 'สำเร็จ!', 
          text: 'ลบข้อมูลห้องพักเรียบร้อยแล้ว', 
          confirmButtonText: 'ตกลง', 
          confirmButtonColor: '#d4af37' });
        this.closeDeleteModal();
        this.loadRooms(this.currentPage);
      },
      error: (error) => this.handleError(error, 'ลบข้อมูลไม่สำเร็จ'),
      complete: () => console.log('การทำงานเสร็จสิ้น (Delete Room)')
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

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  filterType(type: string) {
    this.currentFilter = type;
    this.isDropdownOpen = false;
    console.log('เลือกดูประเภท:', type);
    Swal.fire({
      icon: 'info',
      title: 'ระบบคัดกรอง',
      text: `คุณเลือก: ${type} (ฟังก์ชันนี้ต้องไปเพิ่มเงื่อนไขที่ Backend ต่อครับ)`,
      timer: 1500,
      showConfirmButton: false
    });
  }

  onPageChange(newPage: number) {
    this.loadRooms(newPage);
  }

  openAddModal() {
    this.editId = null;
    this.f_room_number = '';
    this.f_room_type_id = this.roomTypes.length > 0 ? this.roomTypes[0].id : '';
    this.f_floor = '';
    this.f_staff_id = '';
    this.f_status = 'available';
    this.isRoomModalOpen = true;
  }

  openEditModal(room: any) {
    this.editId = room.id;
    this.f_room_number = room.room_number;
    this.f_room_type_id = room.room_type_id;
    this.f_floor = room.floor;
    this.f_staff_id = room.staff_id;
    this.f_status = room.status;
    this.isRoomModalOpen = true;
  }

  closeRoomModal() { this.isRoomModalOpen = false; }

  openDeleteModal(id: number) {
    this.pendingDeleteId = id;
    this.isDeleteModalOpen = true;
  }

  closeDeleteModal() {
    this.pendingDeleteId = null;
    this.isDeleteModalOpen = false;
  }
}
