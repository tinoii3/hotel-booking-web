import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ManageStaffService } from '../../manage-staff.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-staff-form-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './staff-form-modal.html',
  styleUrl: './staff-form-modal.scss',
})
export class StaffFormModal {
  @Input() staffData: any = null;
  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  editId: number | null = null;
  staffForm: any = {
    staff_number: '',
    staff_name: '',
    position: '',
    hired_at: new Date().toISOString().split('T')[0],
    is_active: true
  };

  constructor(private staffService: ManageStaffService) {}

  ngOnInit() {
    if (this.staffData) {
      this.editId = this.staffData.id;
      this.staffForm = {
        staff_number: this.staffData.staff_number,
        staff_name: this.staffData.staff_name,
        position: this.staffData.position,
        hired_at: this.staffData.hired_at ? this.staffData.hired_at.split('T')[0] : '',
        is_active: this.staffData.is_active
      };
    }
  }

  saveStaff() {
    if (!this.staffForm.staff_name) {
      Swal.fire({ icon: 'warning', title: 'แจ้งเตือน', text: 'กรุณากรอกชื่อผู้ดูแล' });
      return;
    }

    const payload = {
      ...this.staffForm,
      hired_at: this.staffForm.hired_at ? new Date(this.staffForm.hired_at).toISOString() : null
    };

    const request = this.editId 
      ? this.staffService.updateStaff(this.editId, payload)
      : this.staffService.createStaff(payload);

    request.subscribe({
      next: () => {
        Swal.fire({ icon: 'success', title: 'บันทึกสำเร็จ!', showConfirmButton: false, timer: 1500 });
        this.saved.emit(); 
        this.closed.emit();
      },
      error: () => Swal.fire({ icon: 'error', title: 'เกิดข้อผิดพลาด!' })
    });
  }
}
