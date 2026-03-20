import { Component, OnInit, inject, ChangeDetectorRef, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import Swal from 'sweetalert2';
import { DashboardService } from './dashboard.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule], // เอา LucideAngularModule ออกแล้ว
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit, AfterViewInit {
  private dashboardService = inject(DashboardService);
  private cdr = inject(ChangeDetectorRef);

  @ViewChild('revenueChartCanvas') revenueChartCanvas!: ElementRef;
  chartInstance: any;

  currentDate: string = '';
  isLoading: boolean = false; // ปิด Loading ไว้เลย

  stats = { 
    totalRooms: 0, 
    availableRooms: 0, 
    todayCheckIns: 0, 
    monthlyRevenue: 0 
  };
  
  recentBookings: any[] = [];
  popularRooms: any[] = [];
  revenueChartData: any = { labels: [], data: [] }; // ลบ topRatedRooms ออก

  ngOnInit() {
    dayjs.locale('th');
    this.currentDate = dayjs().format('D MMMM YYYY');
    this.loadDashboardData();
  }

  ngAfterViewInit() {
    // ให้สร้างกราฟเปล่าทิ้งไว้ก่อน
    this.initChart();
  }

  loadDashboardData() {
    this.dashboardService.getDashboardSummary().subscribe({
      next: (response: any) => {
        if (response.data) {
          this.stats = response.data.stats || this.stats;
          this.recentBookings = response.data.recentBookings || [];
          this.popularRooms = response.data.popularRooms || [];
          this.revenueChartData = response.data.revenueChart || { labels: [], data: [] };
        }
        
        // อัปเดตกราฟใหม่ด้วยข้อมูลจริงจาก Backend
        this.updateChartData();
        
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('เกิดข้อผิดพลาดในการโหลด Dashboard:', error);
        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด!',
          text: 'ไม่สามารถดึงข้อมูลสรุปได้: ' + (error.statusText || 'เซิร์ฟเวอร์ไม่ตอบสนอง'),
          confirmButtonText: 'ปิดหน้าต่าง',
          confirmButtonColor: '#dc3545'
        });
      }
    });
  }

  initChart() {
    if (this.chartInstance) {
      this.chartInstance.destroy(); // ล้างกราฟเก่าทิ้งก่อน (ถ้ามี)
    }

    if (!this.revenueChartCanvas || !this.revenueChartCanvas.nativeElement) return;
    const ctx = this.revenueChartCanvas.nativeElement.getContext('2d');
    
    // สร้างสี Gradient สวยๆ ใต้กราฟเส้น
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, 'rgba(13, 110, 253, 0.5)');
    gradient.addColorStop(1, 'rgba(13, 110, 253, 0.0)');

    this.chartInstance = new Chart(ctx, {
      type: 'line', // เป็นกราฟเส้น
      data: {
        labels: [],
        datasets: [{
          label: 'รายได้ (บาท)',
          data: [],
          borderColor: '#0d6efd', // สีเส้น
          backgroundColor: gradient, // สีพื้นใต้เส้น
          borderWidth: 2,
          pointBackgroundColor: '#ffffff',
          pointBorderColor: '#0d6efd',
          pointBorderWidth: 2,
          pointRadius: 4,
          fill: true, // เปิดให้เติมสีใต้เส้น
          tension: 0.4 // ทำเส้นให้โค้งมนนิดๆ
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }, // ซ่อนป้ายกำกับด้านบน
          tooltip: {
            callbacks: {
              label: function(context) {
                let label = context.dataset.label || '';
                if (label) label += ': ';
                // กราฟเส้น ใช้ context.parsed.y เพื่อดึงค่าแกนตั้งมาแสดงตอนเอาเมาส์ชี้
                if (context.parsed.y !== null) {
                  label += new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(context.parsed.y);
                }
                return label;
              }
            }
          }
        },
        scales: {
          y: { 
            beginAtZero: true,
            grid: { color: 'rgba(0, 0, 0, 0.05)' } // เส้นตารางแนวนอนจางๆ
          },
          x: { 
            grid: { display: false } // ซ่อนเส้นตารางแนวตั้ง
          }
        }
      }
    });
  }

  updateChartData() {
    if (this.chartInstance && this.revenueChartData.labels.length > 0) {
      // เอาข้อมูลที่ได้จาก Backend มายัดใส่ตัวกราฟ แล้วสั่งให้มันอัปเดตตัวเอง
      this.chartInstance.data.labels = this.revenueChartData.labels;
      this.chartInstance.data.datasets[0].data = this.revenueChartData.data;
      this.chartInstance.update(); 
    }
  }
}