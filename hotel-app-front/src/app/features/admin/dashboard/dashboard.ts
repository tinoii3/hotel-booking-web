import { Component, OnInit, inject, ChangeDetectorRef, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import { LucideAngularModule } from 'lucide-angular';
import Swal from 'sweetalert2';
import { DashboardService } from './dashboard.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit, AfterViewInit {
  private dashboardService = inject(DashboardService);
  private cdr = inject(ChangeDetectorRef);

  @ViewChild('revenueChartCanvas') revenueChartCanvas!: ElementRef;
  chartInstance: any;

  currentDate: string = '';
  isLoading: boolean = true;

  stats = { 
    totalRooms: 0, 
    availableRooms: 0, 
    todayCheckIns: 0, 
    monthlyRevenue: 0 
  };
  
  recentBookings: any[] = [];
  popularRooms: any[] = [];
  topRatedRooms: any[] = [];
  revenueChartData: any = { labels: [], data: [] };

  ngOnInit() {
    dayjs.locale('th');
    this.currentDate = dayjs().format('D MMMM YYYY');
    this.loadDashboardData();
  }

  ngAfterViewInit() {
  }

  loadDashboardData() {
    this.isLoading = true;
    
    this.dashboardService.getDashboardSummary().subscribe({
      next: (response: any) => {
        if (response.data) {
          this.stats = response.data.stats || this.stats;
          this.recentBookings = response.data.recentBookings || [];
          this.popularRooms = response.data.popularRooms || [];
          this.topRatedRooms = response.data.topRatedRooms || [];
          this.revenueChartData = response.data.revenueChart || { labels: [], data: [] };
          
          this.initChart(); 
        }
        
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('เกิดข้อผิดพลาดในการโหลด Dashboard:', error);
        this.isLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด!',
          text: 'ไม่สามารถดึงข้อมูลสรุปได้: ' + (error.statusText || 'เซิร์ฟเวอร์ไม่ตอบสนอง'),
          confirmButtonText: 'ปิดหน้าต่าง',
          confirmButtonColor: '#dc3545'
        });
        this.cdr.detectChanges();
      }
    });
  }

  getStars(rating: number): number[] {
    return Array(rating || 0).fill(0);
  }

  initChart() {
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }
    
    if (!this.revenueChartCanvas) return;

    const ctx = this.revenueChartCanvas.nativeElement.getContext('2d');
    
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, 'rgba(13, 110, 253, 0.5)');
    gradient.addColorStop(1, 'rgba(13, 110, 253, 0.0)');

    this.chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.revenueChartData.labels,
        datasets: [{
          label: 'รายได้ (บาท)',
          data: this.revenueChartData.data,
          borderColor: '#0d6efd',
          backgroundColor: gradient,
          borderWidth: 2,
          pointBackgroundColor: '#ffffff',
          pointBorderColor: '#0d6efd',
          pointBorderWidth: 2,
          pointRadius: 4,
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function(context) {
                let label = context.dataset.label || '';
                if (label) label += ': ';
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
            grid: { color: 'rgba(0, 0, 0, 0.05)' }
          },
          x: { 
            grid: { display: false }
          }
        }
      }
    });
  }
}