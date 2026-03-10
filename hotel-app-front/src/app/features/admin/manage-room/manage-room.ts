import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

declare var bootstrap: any;

interface Room {
  no: string;
  type: string;
  floor: string;
  capacity: string;
  user: string;
  status: string;
}

@Component({
  selector: 'app-manage-room',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-room.html',
  styleUrl: './manage-room.scss',
})
export class ManageRoom implements OnInit {
  @ViewChild('roomModal') roomModalRef!: ElementRef;
  @ViewChild('deleteModal') deleteModalRef!: ElementRef;

  roomModalInstance: any;
  deleteModalInstance: any;

  // mockup
  rooms: Room[] = [
    {
      no: '001',
      type: 'สวีทชูพรีม',
      floor: 'ชั้น 4',
      capacity: '3 คน',
      user: 'สมบูรณ์ กขค',
      status: 'เช็คอิน',
    },
    {
      no: '002',
      type: 'สวีทชูพรีม',
      floor: 'ชั้น 4',
      capacity: '3 คน',
      user: 'สมบูรณ์ กขค',
      status: 'เช็คอิน',
    },
    {
      no: '003',
      type: 'ดีลักซ์',
      floor: 'ชั้น 3',
      capacity: '2 คน',
      user: 'วิไล มงคล',
      status: 'ว่าง',
    },
    {
      no: '004',
      type: 'สวีทชูพรีม',
      floor: 'ชั้น 4',
      capacity: '3 คน',
      user: 'สมบูรณ์ กขค',
      status: 'เช็คอิน',
    },
    {
      no: '005',
      type: 'สแตนดาร์ด',
      floor: 'ชั้น 2',
      capacity: '1 คน',
      user: 'ประทีป ศรี',
      status: 'ไม่พร้อมใช้งาน',
    },
    {
      no: '006',
      type: 'สวีทชูพรีม',
      floor: 'ชั้น 4',
      capacity: '3 คน',
      user: 'สมบูรณ์ กขค',
      status: 'เช็คอิน',
    },
    {
      no: '007',
      type: 'ดีลักซ์',
      floor: 'ชั้น 3',
      capacity: '2 คน',
      user: 'วิไล มงคล',
      status: 'ว่าง',
    },
    {
      no: '008',
      type: 'สวีทชูพรีม',
      floor: 'ชั้น 4',
      capacity: '3 คน',
      user: 'สมบูรณ์ กขค',
      status: 'เช็คอิน',
    },
  ];

  filteredRooms: Room[] = [];
  currentFilter: string = 'all';
  pendingDeleteIndex: number | null = null;
  editIndex: number | null = null;

  isDropdownOpen: boolean = false;
  isRoomModalOpen: boolean = false;
  isDeleteModalOpen: boolean = false;

  f_room_no = '';
  f_floor = '';
  f_type = 'สวีทชูพรีม';
  f_capacity = '';
  f_user = '';
  f_status = 'ว่าง';

  ngOnInit() {
    this.filterType('all');
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  filterType(type: string) {
    this.currentFilter = type;
    this.isDropdownOpen = false;

    if (type === 'all') {
      this.filteredRooms = [...this.rooms];
    } else {
      this.filteredRooms = this.rooms.filter((r) => r.type === type);
    }
  }

  openAddModal() {
    this.editIndex = null;
    this.f_room_no = '';
    this.f_floor = '';
    this.f_type = 'สวีทชูพรีม';
    this.f_capacity = '';
    this.f_user = '';
    this.f_status = 'ว่าง';
    this.isRoomModalOpen = true;
  }

  openEditModal(room: Room, index: number) {
    this.editIndex = index;
    this.f_room_no = room.no;
    this.f_floor = room.floor;
    this.f_type = room.type;
    this.f_capacity = room.capacity;
    this.f_user = room.user;
    this.f_status = room.status;
    this.isRoomModalOpen = true;
  }

  closeRoomModal() {
    this.isRoomModalOpen = false;
  }

  saveRoom() {
    if (!this.f_room_no.trim()) {
      alert('กรุณาระบุเลขห้อง');
      return;
    }

    const entry: Room = {
      no: this.f_room_no.trim(),
      type: this.f_type,
      floor: this.f_floor.trim(),
      capacity: this.f_capacity.trim(),
      user: this.f_user.trim(),
      status: this.f_status,
    };

    if (this.editIndex === null) {
      this.rooms.push(entry);
    } else {
      this.rooms[this.editIndex] = entry;
    }

    this.filterType(this.currentFilter);
    this.closeRoomModal();
  }

  openDeleteModal(index: number) {
    this.pendingDeleteIndex = index;
    this.isDeleteModalOpen = true;
  }

  closeDeleteModal() {
    this.pendingDeleteIndex = null;
    this.isDeleteModalOpen = false;
  }

  confirmDelete() {
    if (this.pendingDeleteIndex !== null) {
      this.rooms.splice(this.pendingDeleteIndex, 1);
      this.pendingDeleteIndex = null;
    }
    this.filterType(this.currentFilter);
    this.closeDeleteModal();
  }
}
