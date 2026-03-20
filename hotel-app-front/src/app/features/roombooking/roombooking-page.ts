import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchBar } from '../../shared/components/search-bar/search-bar';
import { RoombookingService } from './roombooking.service';
import { Router } from '@angular/router';
import { UserService } from '../../core/services/user-service';
import { faTrashCan, faSquare, faPeopleLine, faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import Swal from 'sweetalert2';

interface Room {
  id: number;
  type: string;
  name: string;
  description: string;
  imageUrl: string;
  images: string[];
  sqm: number;
  bedType: string;
  amenities: string[];
  priceNote: string;
  pricePerNight: number;
  totalPrice: number;
  maxCapasity: number;
}

export interface GuestInfo {
  adults: number;
  children: number;
  label: string;
}

export interface SearchCriteria {
  check_in: string;
  check_out: string;
  room_type?: string;
  guests: GuestInfo;
}

@Component({
  selector: 'app-roombooking-page',
  standalone: true,
  imports: [CommonModule, DecimalPipe, FormsModule, SearchBar, FaIconComponent],
  templateUrl: './roombooking-page.html',
  styleUrl: './roombooking-page.scss'
})
export class RoombookingPage implements OnInit {
  faSquare = faSquare;
  faPeopleLine = faPeopleLine;
  faAngleLeft = faAngleLeft;
  faAngleRight = faAngleRight;
  faTrashCan = faTrashCan;

  rooms: Room[] = [];
  filteredRooms: Room[] = [];
  cartItems: any[] = [];

  isDetailModalOpen: boolean = false;
  selectedRoom: Room | null = null;
  currentImageIndex: number = 0;

  private roomService = inject(RoombookingService);
  private router = inject(Router);
  constructor(private userService: UserService) { }

  userId!: number;
  email!: string;
  f_checkin: string = '';
  f_checkout: string = '';
  f_roomtype?: string = '';
  f_guest!: GuestInfo;
  currentPage: number = 1;
  totalPages: number = 1;

  ngOnInit() {
    this.userService.loadProfile().subscribe();
    this.userService.user$.subscribe((user) => {
      if (!user) return;
      this.userId = user.id;
      this.email = user.email ?? '';
    });
    this.searchRooms();
  }

  onSearch(data: any) {
    this.f_checkin = data.check_in;
    this.f_checkout = data.check_out;
    this.f_roomtype = data.room_type;
    this.f_guest = data.guest;
    this.searchRooms();
  }

  get grandTotal(): number {
    return this.cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  }

  searchRooms() {
    const roomType = this.f_roomtype || 'all';
    const adults = this.f_guest?.adults || 1;
    const children = this.f_guest?.children || 0;
    this.roomService.searchAvailableRooms(roomType, adults, children).subscribe({
      next: (res: any) => {
        const backendRooms = res.data || [];

        this.filteredRooms = backendRooms.map((r: any) => {
          const price = Number(r.room_types?.price_per_night) || 0;
          const nights = this.calculateNights(this.f_checkin, this.f_checkout);

          const rawImages = r.room_images || [];
          let coverImageUrl = '';
          let galleryImages = [];

          if (rawImages.length) {
            const coverImg = rawImages.find((img: any) => img.is_cover === true);
            coverImageUrl = coverImg ? coverImg.image_path : rawImages[0].image_path;
            const sortedImages = [...rawImages].sort((a: any, b: any) => {
              if (a.is_cover) return -1;
              if (b.is_cover) return 1;
              return 0;
            });
            galleryImages = sortedImages.map((img: any) => img.image_path);
          }

          return {
            id: r.id,
            imageUrl: coverImageUrl,
            images: galleryImages,
            name: `ห้อง ${r.room_number} - ${r.room_types?.name || ''}`,
            description: r.room_types?.description || 'ไม่มีรายละเอียด',
            amenities: r.room_types?.amenities || [],
            sqm: r.room_types?.size_sqm || 30,
            maxCapasity: r.room_types?.capacity || 2,
            pricePerNight: price,
            totalPrice: price * nights
          };
        });
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'ค้นหาล้มเหลว',
          text: err.error?.message || 'ไม่สามารถติดต่อเซิร์ฟเวอร์ได้'
        });
      }
    });
  }

  private calculateNights(checkIn: string, checkOut: string): number {
    if (!checkIn || !checkOut) return 1;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  }

  addToCart(room: Room) {
    const isAlreadyAdded = this.cartItems.some(item => item.roomId === room.id);
    if (isAlreadyAdded) {
      Swal.fire({
        icon: 'warning',
        title: 'ห้องนี้อยู่ใหตะกร้าแล้ว',
        text: 'คุณได้เลือกห้องนี้ไปแล้ว กรุณาเลือกห้องอื่นเพิ่มเติมนะครับ',
        timer: 2000,
        showCancelButton: false
      });
      return;
    }

    const nights = this.calculateNights(this.f_checkin, this.f_checkout);
    const searchAdults = this.f_guest?.adults || 1;
    const searchChildren = this.f_guest?.children || 0;

    this.cartItems.push({
      roomId: room.id,
      roomName: room.name,
      pricePerNight: room.pricePerNight,
      adults: searchAdults,
      children: searchChildren,
      nights: nights,
      totalPrice: room.pricePerNight * nights
    });
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  }

  removeItem(index: number) {
    this.cartItems.splice(index, 1);
  }

  resetSelection() {
    this.cartItems = [];
  }

  confirmBooking() {
    if (this.cartItems.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'ตะกร้าว่างเปล่า',
        text: 'กรุณาเลือกห้องพักก่อนดำเนินการต่อ'
      });
    }

    if (!this.userId) {
      Swal.fire({
        icon: 'info',
        title: 'กรุณาเข้าสู่ระบบ',
        text: 'คุณต้องเข้าสู่ระบบก่อนทำการจองห้องพักครับ',
        confirmButtonText: 'ไปหน้าเข้าสู่ระบบ',
        confirmButtonColor: '#000000'
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['/auth/login']);
        }
      });
      return;
    }

    if (!this.f_checkin || !this.f_checkout) {
      Swal.fire({
        icon: 'error',
        title: 'ข้อมูลไม่ครบ',
        text: 'กรุณาระบุวันที่เช็คอินและเช็คเอาต์'
      });
      return;
    }

    if (this.cartItems.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'ตะกร้าว่างเปล่า',
        text: 'กรุณาเลือกห้องพักลงตะกร้าก่อนดำเนินการต่อ'
      });
      return;
    }

    if (!this.f_checkin || !this.f_checkout) {
      const today = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(today.getDate() + 1);

      const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      this.f_checkin = formatDate(today);
      this.f_checkout = formatDate(tomorrow);
    }

    const itemsPayload = this.cartItems.map(item => ({
      room_id: item.roomId,
      room_name: item.roomName,
      price_per_night: item.pricePerNight,
      adults: item.adults,
      children: item.children
    }));

    let totalGuests = 0;
    let totalPrices = 0;

    this.cartItems.forEach(item => {
      totalGuests += (item.adults + item.children);
      totalPrices += item.totalPrice
    });

    const totalNights = this.cartItems[0].nights;

    const payload = {
      user_id: this.userId,
      check_in: this.f_checkin,
      check_out: this.f_checkout,
      first_name: null,
      last_name: null,
      email: this.email,
      phone: null,
      note: null,
      total_price: totalPrices,
      total_guests: totalGuests,
      total_nights: totalNights,
      items: itemsPayload
    };

    this.roomService.createBooking(payload).subscribe({
      next: (response: any) => {
        this.cartItems = [];
        this.searchRooms();

        const newBookingId = response.data?.id;

        Swal.fire({
          icon: 'success',
          title: 'สร้างรายการจองสำเร็จ!',
          text: 'กำลังพาท่านไปหน้าชำระเงิน...',
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          if (newBookingId) {
            this.router.navigate(['/hotel/payment'], { queryParams: { booking_id: newBookingId } });
          } else {
            this.router.navigate(['/hotel/payment']);
          }
        });
      },
      error: (err: any) => {
        console.error('เกิดข้อผิดพลาดในการจอง:', err);
        const errorMessage = err.error?.message || 'ไม่สามารถทำรายการจองได้ กรุณาลองใหม่อีกครั้ง';
        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด',
          text: errorMessage,
          confirmButtonColor: '#dc3545'
        });
      }
    });
  }

  openDetailModal(room: Room) {
    this.selectedRoom = room;
    this.currentImageIndex = 0;
    this.isDetailModalOpen = true;
  }

  closeDetailModal() {
    this.isDetailModalOpen = false;
    this.selectedRoom = null;
  }

  nextImage() {
    if (this.selectedRoom && this.selectedRoom.images) {
      this.currentImageIndex = (this.currentImageIndex < this.selectedRoom.images.length - 1)
        ? this.currentImageIndex + 1
        : 0;
    }
  }

  prevImage() {
    if (this.selectedRoom && this.selectedRoom.images) {
      this.currentImageIndex = (this.currentImageIndex > 0)
        ? this.currentImageIndex - 1
        : this.selectedRoom.images.length - 1;
    }
  }

  selectImage(index: number) { this.currentImageIndex = index; }
}