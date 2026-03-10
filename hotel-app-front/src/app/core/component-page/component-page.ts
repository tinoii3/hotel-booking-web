import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import { LucideAngularModule, FileIcon } from 'lucide-angular';

@Component({
  selector: 'app-component-page',
  imports: [FontAwesomeModule, LucideAngularModule, ],
  templateUrl: './component-page.html',
})
export class ComponentPage {
 private http = inject(HttpClient);
  faCoffee = faCoffee;
  FileIcon = FileIcon;

  testApi() {
    console.log('กำลังเรียก API...');
    
    Swal.fire({
      title: 'กำลังดึงข้อมูล...',
      text: 'กรุณารอสักครู่',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.http.get('/api/service').subscribe({
      next: (response: any) => {
        console.log('✅ ได้รับข้อมูลสำเร็จ:', response);
        
        Swal.fire({
          icon: 'success',
          title: 'สำเร็จ!',
          text: `ดึงข้อมูลสำเร็จ พบข้อมูลผู้ใช้จำนวน ${response.length} รายการ`,
          confirmButtonText: 'ตกลง',
          confirmButtonColor: '#d4af37'
        });
      },
      error: (error) => {
        console.error('❌ เกิดข้อผิดพลาด:', error);
        
        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด!',
          text: 'ไม่สามารถดึงข้อมูลได้: ' + (error.statusText || 'เซิร์ฟเวอร์ไม่ตอบสนอง'),
          confirmButtonText: 'ปิดหน้าต่าง',
          confirmButtonColor: '#dc3545' 
        });
      },
      complete: () => {
        console.log('การทำงานเสร็จสิ้น');
      }
    });
  }
}
