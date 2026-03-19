import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchBar } from '../../shared/components/search-bar/search-bar';
import { RoombookingService } from './roombooking.service';
import { Router } from '@angular/router';
import { UserService } from '../../core/services/user-service';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";

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
  maxAdults: number;
  maxChildren: number;
}

@Component({
  selector: 'app-roombooking-page',
  standalone: true,
  imports: [CommonModule, DecimalPipe, FormsModule, SearchBar, FaIconComponent],
  templateUrl: './roombooking-page.html',
  styleUrl: './roombooking-page.scss'
})
export class RoombookingPage implements OnInit {

  rooms: Room[] = [];
  filteredRooms: Room[] = [];
  roomTypes: string[] = ['ทั้งหมด', 'สแตนดาร์ด', 'ดีลักซ์', 'สวีทชูพรีม'];
  cartItems: any[] = [];

  f_checkin = '2026-04-01';
  f_checkout = '2026-04-03';
  f_type = 'ทั้งหมด';
  f_guest = '2-0';

  
  isDetailModalOpen: boolean = false;
  selectedRoom: Room | null = null;
  currentImageIndex: number = 0;
  faTrashCan = faTrashCan;

  private roomService = inject(RoombookingService);
  private router = inject(Router);
  constructor(private userService: UserService) {}
  
  userId!: number;
  email!: string;

  ngOnInit() {
    this.userService.user$.subscribe((user) => {
        if (!user) return;
        this.userId = user.id;
        this.email = user.email ?? '';
        console.log('User ready:', user);
      });
    this.loadAllRooms();
  }
  get grandTotal(): number {
    return this.cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  }

  loadAllRooms() {
    this.roomService.getRooms(1, 100, 'all', 'room_number', 'asc').subscribe({
      next: (response: any) => {
        const roomsData = response.data ? response.data : response;

        this.rooms = roomsData.map((room: any) => {
          const rawImages = room.room_images || [];
          let coverImageUrl = 'assets/keyboard.jpg';
          let galleryImages = ['assets/keyboard.jpg'];

          if (rawImages.length > 0) {
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
            id: room.id,
            type: room.room_types?.name || 'ไม่ระบุประเภท',
            name: `ห้อง ${room.room_number} - ${room.room_types?.name || ''}`,
            description: room.room_types?.description || 'ห้องพักพร้อมสิ่งอำนวยความสะดวก',

            imageUrl: coverImageUrl,
            images: galleryImages,

            sqm: room.room_types?.size_sqm || 30,
            bedType: room.room_types?.bed_type || 'เตียงมาตรฐาน',
            amenities: room.room_types?.amenities || ['เครื่องปรับอากาศ', 'สมาร์ททีวี', 'ฟรี Wi-Fi'],
            priceNote: 'ราคานี้รวมภาษีแล้ว',
            pricePerNight: room.room_types?.price_per_night || 0,
            totalPrice: room.room_types?.price_per_night || 0,
            maxAdults: room.room_types?.capacity || 2,
            maxChildren: 0
          };
        });

        this.filteredRooms = [...this.rooms];
      },
      error: (err) => {
        console.error('ดึงข้อมูลห้องพักไม่สำเร็จ:', err);
      }
    });
  }

  onSearch(data: any) {
    this.f_checkin = data.checkin || this.f_checkin;
    this.f_checkout = data.checkout || this.f_checkout;
    this.f_type = data.type || this.f_type;
    this.f_guest = data.guest || this.f_guest;
    this.searchRooms();
  }

  calculateNights(): number {
    const checkinDate = new Date(this.f_checkin);
    const checkoutDate = new Date(this.f_checkout);
    const diffTime = checkoutDate.getTime() - checkinDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  }

  searchRooms() {
    const [searchAdults, searchChildren] = this.f_guest.split('-').map(Number);
    const nights = this.calculateNights();

    this.filteredRooms = this.rooms.filter(room => {
      const isTypeMatch = (this.f_type === 'ทั้งหมด' || room.type === this.f_type);
      const isAdultMatch = (room.maxAdults >= searchAdults);
      const isChildMatch = (room.maxChildren >= searchChildren);

      room.totalPrice = room.pricePerNight * nights;

      return isTypeMatch && isAdultMatch && isChildMatch;
    });
  }

  addToCart(room: Room) {
    const isAlreadyAdded = this.cartItems.some(item => item.roomId === room.id);
    if (isAlreadyAdded) {
      alert('คุณได้เพิ่มห้องนี้ในรายการจองแล้วครับ');
      return;
    }
    const nights = this.calculateNights();
    const [searchAdults, searchChildren] = this.f_guest.split('-').map(Number);

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
    if (this.cartItems.length === 0) return;

    if (!this.userId) {
      alert('กรุณาเข้าสู่ระบบก่อนทำการจองห้องพักครับ');
      return;
    }

    const itemsPayload = this.cartItems.map(item => ({
      room_id: item.roomId,
      room_name: item.roomName,
      price_per_night: item.pricePerNight,
      adults: item.adults,
      children: item.children
    }));

    const payload = {
      user_id: this.userId,
      check_in: this.f_checkin,
      check_out: this.f_checkout,
      first_name: "test-first-name", 
      last_name: "test-last-name",
      email: this.email,       
      phone: null,
      note: null,
      items: itemsPayload
    };

    this.roomService.createBooking(payload).subscribe({
      next: (response: any) => {
        alert('สร้างรายการจองสำเร็จ! กำลังพาท่านไปหน้าชำระเงิน...');
        this.cartItems = [];
        this.searchRooms();

        const newBookingId = response.data?.id; 
        if (newBookingId) {
          this.router.navigate(['/hotel/payment'], { queryParams: { booking_id: newBookingId } });
        } else {
          this.router.navigate(['/hotel/payment']);
        }
      },
      error: (err) => {
        console.error('เกิดข้อผิดพลาดในการจอง:', err);
        const errorMessage = err.error?.message || 'ไม่สามารถทำรายการจองได้ กรุณาลองใหม่อีกครั้ง';
        alert(`เกิดข้อผิดพลาด: ${errorMessage}`);
      }
    });
  }

  openDetailModal(room: Room) { this.selectedRoom = room; this.currentImageIndex = 0; this.isDetailModalOpen = true; }
  closeDetailModal() { this.isDetailModalOpen = false; this.selectedRoom = null; }
  nextImage() { if (this.selectedRoom && this.selectedRoom.images) { this.currentImageIndex = (this.currentImageIndex < this.selectedRoom.images.length - 1) ? this.currentImageIndex + 1 : 0; } }
  prevImage() { if (this.selectedRoom && this.selectedRoom.images) { this.currentImageIndex = (this.currentImageIndex > 0) ? this.currentImageIndex - 1 : this.selectedRoom.images.length - 1; } }
  selectImage(index: number) { this.currentImageIndex = index; }
}