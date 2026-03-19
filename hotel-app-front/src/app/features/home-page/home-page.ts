import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { SearchBar } from '../../shared/components/search-bar/search-bar';
import { HomePageService } from './service/home-page-service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, SearchBar],
  templateUrl: './home-page.html',
  styleUrls: ['./home-page.scss'],
})
export class HomePage {
  private homePageService = inject(HomePageService);

  onSearch(data: any) {
    // TODO: call API หรือ navigate ไปหน้าอื่น
    console.log('Search data:', data);
  }

  get filteredRooms() {
    return this.homePageService.rooms;
  }

  ngOnInit() {
    this.homePageService.fetchRooms();
  }

  // ฟังก์ชันสำหรับเลื่อนสไลด์ซ้าย-ขวา
  scroll(element: HTMLElement, direction: number) {
    // กำหนดระยะความกว้างที่ต้องการเลื่อนต่อ 1 คลิก (ประมาณความกว้าง 1 การ์ด)
    const scrollAmount = 380;
    element.scrollBy({ left: scrollAmount * direction, behavior: 'smooth' });
  }

  // ข้อมูลห้องพัก
  rooms = [
    {
      name: 'Deluxe Room',
      price: 120,
      description:
        'A beautifully appointed room featuring modern amenities, a king-size bed, and stunning city views.',
      image: 'assets/deluxe-room.jpg',
    },
    {
      name: 'Suite Room',
      price: 200,
      description:
        'Spacious suite with a separate living area, ocean views, and premium furnishings for ultimate comfort.',
      image: 'assets/suite-room.jpg',
    },
    {
      name: 'Presidential Suite',
      price: 350,
      description:
        'The pinnacle of luxury — grand living spaces, marble finishes, panoramic views, and dedicated concierge.',
      image: 'assets/presidential-suite.jpg',
    },
  ];

  // ข้อมูลสิ่งอำนวยความสะดวก
  amenities = [
    {
      icon: 'bed',
      title: 'ห้องพักสุดหรู',
      desc: 'เพลิดเพลินกับบริการระดับพรีเมียมและประสบการณ์ที่ตอบสนองทุกรสนิยมเพื่อความสะดวกสบายของคุณโดยเฉพาะ',
    },
    {
      icon: 'waves',
      title: 'สระว่ายน้ำ',
      desc: 'พักผ่อนหย่อนใจกับสระน้ำสำหรับมาผ่อนคลาย พร้อมมุมพักผ่อนให้คุณเพลิดเพลินทุกฤดูกาล',
    },
    {
      icon: 'restaurant',
      title: 'อาหารและเครื่องดื่ม',
      desc: 'รับประทานอาหารรสเลิศจากเชฟชื่อดังพร้อมกับเครื่องดื่มหลากหลายในห้องพักของคุณ',
    },
    {
      icon: 'location_on',
      title: 'การเดินทาง',
      desc: 'เดินทางได้อย่างสะดวกด้วยบริการรับ-ส่งสนามบิน บริการเช่ารถ และข้อมูลการเดินทางในท้องถิ่น',
    },
    {
      icon: 'spa',
      title: 'สปาทรีทเมนท์',
      desc: 'ผ่อนคลายกับสปาระดับโลกด้วยบริการส่วนบุคคลและโปรแกรมดูแลสุขภาพแบบองค์รวม',
    },
    {
      icon: 'hot_tub',
      title: 'อ่างจากุซซี่',
      desc: 'ผ่อนคลายอย่างเต็มที่ด้วยอ่างจากุซซี่อันทันสมัยในห้องพัก พร้อมบรรยากาศสุดพิเศษ',
    },
  ];

  onSubmit(form: NgForm) {
    if (form.valid) {
      Swal.fire({
        title: 'ส่งข้อความสำเร็จ',
        text: 'เราได้รับข้อมูลของคุณแล้ว และจะติดต่อกลับโดยเร็วที่สุด',
        icon: 'success',
        confirmButtonText: 'ตกลง',
        confirmButtonColor: '#1a1a1a',
      }).then((result) => {
        if (result.isConfirmed) {
          form.resetForm();
        }
      });
    } else {
      Swal.fire({
        title: 'ข้อมูลไม่ครบถ้วน',
        text: 'กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง',
        icon: 'warning',
        confirmButtonText: 'ตกลง',
      });
    }
  }
}
