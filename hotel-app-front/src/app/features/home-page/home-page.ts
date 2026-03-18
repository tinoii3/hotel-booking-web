import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home-page.html',
  styleUrls: ['./home-page.scss']
})
export class HomePage {
  // ตัวแปรสำหรับระบบค้นหา
  selectedRoomTypeInput: string = 'All Rooms'; 
  activeRoomTypeFilter: string = 'All Rooms'; 

  // ฟังก์ชัน Getter สำหรับดึงรายการห้องที่ถูกฟิลเตอร์แล้วไปแสดงผล
  get filteredRooms() {
    if (this.activeRoomTypeFilter === 'All Rooms') {
      return this.rooms; // ถ้าเลือก All ให้แสดงทั้งหมด
    }
    // ถ้าเลือกห้องเฉพาะเจาะจง ให้กรองชื่อห้องให้ตรงกับที่เลือก
    return this.rooms.filter(room => room.name === this.activeRoomTypeFilter);
  }

  // ฟังก์ชันทำงานเมื่อกดปุ่ม Search
  onSearch() {
    this.activeRoomTypeFilter = this.selectedRoomTypeInput;
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
      description: 'A beautifully appointed room featuring modern amenities, a king-size bed, and stunning city views.',
      image: 'assets/deluxe-room.jpg' 
    },
    {
      name: 'Suite Room',
      price: 200,
      description: 'Spacious suite with a separate living area, ocean views, and premium furnishings for ultimate comfort.',
      image: 'assets/suite-room.jpg'
    },
    {
      name: 'Presidential Suite',
      price: 350,
      description: 'The pinnacle of luxury — grand living spaces, marble finishes, panoramic views, and dedicated concierge.',
      image: 'assets/presidential-suite.jpg'
    }
  ];

  // ข้อมูลสิ่งอำนวยความสะดวก
  amenities = [
    { icon: 'bed', title: 'ห้องพักสุดหรู', desc: 'เพลิดเพลินกับบริการระดับพรีเมียมและประสบการณ์ที่ตอบสนองทุกรสนิยมเพื่อความสะดวกสบายของคุณโดยเฉพาะ' },
    { icon: 'waves', title: 'สระว่ายน้ำ', desc: 'พักผ่อนหย่อนใจกับสระน้ำสำหรับมาผ่อนคลาย พร้อมมุมพักผ่อนให้คุณเพลิดเพลินทุกฤดูกาล' },
    { icon: 'restaurant', title: 'อาหารและเครื่องดื่ม', desc: 'รับประทานอาหารรสเลิศจากเชฟชื่อดังพร้อมกับเครื่องดื่มหลากหลายในห้องพักของคุณ' },
    { icon: 'location_on', title: 'การเดินทาง', desc: 'เดินทางได้อย่างสะดวกด้วยบริการรับ-ส่งสนามบิน บริการเช่ารถ และข้อมูลการเดินทางในท้องถิ่น' },
    { icon: 'spa', title: 'สปาทรีทเมนท์', desc: 'ผ่อนคลายกับสปาระดับโลกด้วยบริการส่วนบุคคลและโปรแกรมดูแลสุขภาพแบบองค์รวม' },
    { icon: 'hot_tub', title: 'อ่างจากุซซี่', desc: 'ผ่อนคลายอย่างเต็มที่ด้วยอ่างจากุซซี่อันทันสมัยในห้องพัก พร้อมบรรยากาศสุดพิเศษ' }
  ];
}