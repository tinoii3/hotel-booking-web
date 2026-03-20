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
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit, AfterViewInit {
  private dashboardService = inject(DashboardService);
  private cdr = inject(ChangeDetectorRef);

  @ViewChild('revenueChartCanvas') revenueChartCanvas!: ElementRef;
  @ViewChild('bookingChartCanvas') bookingChartCanvas!: ElementRef;
  @ViewChild('popularRoomsChartCanvas') popularRoomsChartCanvas?: ElementRef;
  
  chartInstance: any;
  bookingChartInstance: any;
  popularRoomsChartInstance: any;

  currentDate: string = '';
  isLoading: boolean = false;
  selectedDays: number = 15;
  selectedRevenueMonth: string = '';

  stats = { 
    totalRooms: 0, 
    availableRooms: 0, 
    todayCheckIns: 0, 
    monthlyRevenue: 0 
  };
  
  recentBookings: any[] = [];
  popularRooms: any[] = [];
  revenueChartData: any = { labels: [], data: [] };
  bookingChartData: any[] = [];

  ngOnInit() {
    dayjs.locale('th');
    this.currentDate = dayjs().format('D MMMM YYYY');
    this.selectedRevenueMonth = dayjs().format('YYYY-MM');
    this.loadDashboardData();
  }

  ngAfterViewInit() {
    this.initChart();
    setTimeout(() => {
        this.updateBookingChart(this.selectedDays);
    }, 100);
  }

  loadDashboardData() {
    const [year, month] = this.selectedRevenueMonth.split('-');

    this.dashboardService.getDashboardSummary(month, year).subscribe({
      next: (response: any) => {
        if (response.data) {
          this.stats = response.data.stats || this.stats;
          this.recentBookings = response.data.recentBookings || [];
          this.popularRooms = response.data.popularRooms || [];
          this.revenueChartData = response.data.revenueChart || { labels: [], data: [] };
          this.bookingChartData = response.data.dailyBookings || []; 
        }
        
        this.updateChartData();
        this.updateBookingChart(this.selectedDays); 
        this.cdr.detectChanges();
        
        if (this.popularRooms.length > 0) {
            this.updatePopularRoomsChart();
        }
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
      this.chartInstance.destroy();
    }

    if (!this.revenueChartCanvas || !this.revenueChartCanvas.nativeElement) return;
    const ctx = this.revenueChartCanvas.nativeElement.getContext('2d');
    
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, 'rgba(30, 58, 95, 0.5)');
    gradient.addColorStop(1, 'rgba(30, 58, 95, 0.0)');

    this.chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          label: 'รายได้ (บาท)',
          data: [],
          borderColor: '#1e3a5f',
          backgroundColor: gradient,
          borderWidth: 2,
          pointBackgroundColor: '#ffffff',
          pointBorderColor: '#1e3a5f',
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
            grid: { display: false },
            ticks: {
              maxTicksLimit: 7, 
              maxRotation: 0,   
              autoSkip: true    
            }
          }
        }
      }
    });
  }

  updateChartData() {
    if (this.chartInstance && this.revenueChartData && this.revenueChartData.labels.length > 0) {
      this.chartInstance.data.labels = this.revenueChartData.labels;
      this.chartInstance.data.datasets[0].data = this.revenueChartData.data;
      this.chartInstance.update(); 
    }
  }

  onChartDaysChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedDays = parseInt(selectElement.value, 10);
    this.updateBookingChart(this.selectedDays);
  }

  onRevenueMonthChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.value) {
      this.selectedRevenueMonth = input.value;
      this.loadDashboardData();
    }
  }

  updateBookingChart(days: number) {
    if (!this.bookingChartCanvas || !this.bookingChartCanvas.nativeElement) return;
    
    if (this.bookingChartInstance) {
      this.bookingChartInstance.destroy();
    }

    const ctx = this.bookingChartCanvas.nativeElement.getContext('2d');
    
    let labels: string[] = [];
    let data: number[] = [];

    for (let i = days - 1; i >= 0; i--) {
      const targetDate = dayjs().subtract(i, 'day');
      labels.push(targetDate.format('D MMM')); 

      const dateString = targetDate.format('YYYY-MM-DD'); 
      const foundData = this.bookingChartData.find(item => item.date === dateString);
      
      data.push(foundData ? foundData.count : 0);
    }

    this.bookingChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'จำนวนห้องที่ถูกจอง',
          data: data,
          backgroundColor: '#1e3a5f',
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: { stepSize: 1 }
          }
        }
      }
    });
  }

  updatePopularRoomsChart() {
    if (!this.popularRoomsChartCanvas || !this.popularRoomsChartCanvas.nativeElement) return;

    if (this.popularRoomsChartInstance) {
      this.popularRoomsChartInstance.destroy();
    }

    const ctx = this.popularRoomsChartCanvas.nativeElement.getContext('2d');
    
    const labels = this.popularRooms.map((r: any) => `${r.name} (${r.percentage}%)`);
    const data = this.popularRooms.map((r: any) => r.percentage);

    const backgroundColors = [
      '#1e3a5f', 
      '#cba135', 
      '#2f4f75', 
      '#162d49', 
      '#6c757d'
    ];

    this.popularRoomsChartInstance = new Chart(ctx, {
      type: 'pie', 
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: backgroundColors.slice(0, data.length),
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const roomName = context.label.split(' (')[0]; 
                return ` ${roomName}: ${context.raw}%`;
              }
            }
          }
        }
      }
    });
  }
}