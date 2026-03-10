import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  imports: [CommonModule, DecimalPipe, FormsModule],
  templateUrl: './roombooking-page.html',
  styleUrl: './roombooking-page.scss'
})
export class RoombookingPage implements OnInit {
  
  rooms: Room[] = [
    {
      id: 1,
      type: 'สวีทชูพรีม',
      name: 'Suite Supreme (สวีทชูพรีม)',
      description: 'ห้องพักระดับสูงสุด พื้นที่กว้างขวางถึง 80 ตร.ม. พร้อมห้องนั่งเล่นแยกส่วน และวิวพาโนรามา ตกแต่งด้วยเฟอร์นิเจอร์สุดหรู',
      imageUrl: 'assets/keyboard.jpg',
      images: [
        'assets/keyboard.jpg',
        'assets/keyboard.jpg',
        'assets/keyboard.jpg',
        'assets/keyboard.jpg',
        'assets/keyboard.jpg'
      ],
      sqm: 80,
      bedType: 'King Bed',
      amenities: [
        'เครื่องปรับอากาศ', 'แชมพู', 'เจลอาบน้ำหรือสบู่', 'รองเท้าแตะ',
        'โทรทัศน์เคเบิล', 'อุปกรณ์ชงชาและกาแฟ', 'น้ำดื่ม', 'แปรงสีฟัน',
        'ไดร์เป่าผม', 'ยาสีฟัน', 'หมวกอาบน้ำ', 'โต๊ะทำงาน',
        'อ่างอาบน้ำจากุซซี่ส่วนตัว', 'สิทธิ์เข้าใช้ Executive Lounge'
      ],
      priceNote: 'ห้องรวมอาหารเช้าและสิทธิพิเศษ',
      pricePerNight: 8500,
      totalPrice: 17000,
      maxAdults: 3,  
      maxChildren: 2 
    },
    {
      id: 2,
      type: 'ดีลักซ์',
      name: 'Deluxe Room (ห้องดีลักซ์)',
      description: 'ห้องพักขนาด 45 ตร.ม. พร้อมระเบียงส่วนตัวสำหรับชมวิวเมือง มีพื้นที่สำหรับนั่งทำงานและเตียงนอนขนาดคิงไซส์',
      imageUrl: 'assets/keyboard.jpg',
      images: [
        'assets/keyboard.jpg',
        'assets/keyboard.jpg',
        'assets/keyboard.jpg'
      ],
      sqm: 45,
      bedType: 'Queen Bed',
      amenities: [
        'เครื่องปรับอากาศ', 'แชมพู', 'เจลอาบน้ำหรือสบู่', 'รองเท้าแตะ',
        'โทรทัศน์เคเบิล', 'อุปกรณ์ชงชาและกาแฟ', 'น้ำดื่ม', 'แปรงสีฟัน',
        'ไดร์เป่าผม', 'ยาสีฟัน'
      ],
      priceNote: 'ห้องรวมอาหารเช้า',
      pricePerNight: 4200,
      totalPrice: 8400,
      maxAdults: 2,  
      maxChildren: 1 
    },
    {
      id: 3,
      type: 'สแตนดาร์ด',
      name: 'Standard Room (ห้องสแตนดาร์ด)',
      description: 'ห้องพักมาตรฐานขนาด 30 ตร.ม. ตกแต่งสไตล์โมเดิร์นคลาสสิก ตอบโจทย์ทุกการพักผ่อนขั้นพื้นฐาน',
      imageUrl: 'assets/keyboard.jpg',
      images: [
        'assets/keyboard.jpg',
        'assets/keyboard.jpg'
      ],
      sqm: 30,
      bedType: 'Twin Beds',
      amenities: [
        'เครื่องปรับอากาศ', 'แชมพู', 'เจลอาบน้ำหรือสบู่', 'โทรทัศน์', 
        'น้ำดื่ม', 'ไดร์เป่าผม'
      ],
      priceNote: 'เฉพาะห้องพัก (ไม่รวมอาหารเช้า)',
      pricePerNight: 1800,
      totalPrice: 3600,
      maxAdults: 2,  
      maxChildren: 0 
    }
  ];

  filteredRooms: Room[] = [];
  roomTypes: string[] = ['ทั้งหมด', 'สแตนดาร์ด', 'ดีลักซ์', 'สวีทชูพรีม'];

  f_checkin = '2026-02-01';
  f_checkout = '2026-02-03';
  f_type = 'ทั้งหมด';
  f_guest = '2-0'; 

  bookingSummary: any = null;

  // ตัวแปรควบคุมป๊อปอัพ
  isDetailModalOpen: boolean = false;
  selectedRoom: Room | null = null;
  currentImageIndex: number = 0;

  ngOnInit() {
    this.filteredRooms = [...this.rooms];
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
    const nights = this.calculateNights();
    this.bookingSummary = {
      nights: nights,
      roomName: room.name,
      totalPrice: room.pricePerNight * nights
    };
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  }

  // ฟังก์ชันเปิดป๊อปอัพรายละเอียดห้อง
  openDetailModal(room: Room) {
    this.selectedRoom = room;
    this.currentImageIndex = 0;
    this.isDetailModalOpen = true;
  }

  // ฟังก์ชันปิดป๊อปอัพ
  closeDetailModal() {
    this.isDetailModalOpen = false;
    this.selectedRoom = null;
  }

  nextImage() {
    if (this.selectedRoom && this.selectedRoom.images) {
      if (this.currentImageIndex < this.selectedRoom.images.length - 1) {
        this.currentImageIndex++;
      } else {
        this.currentImageIndex = 0;
      }
    }
  }

  prevImage() {
    if (this.selectedRoom && this.selectedRoom.images) {
      if (this.currentImageIndex > 0) {
        this.currentImageIndex--;
      } else {
        this.currentImageIndex = this.selectedRoom.images.length - 1;
      }
    }
  }

  selectImage(index: number) {
    this.currentImageIndex = index;
  }
}