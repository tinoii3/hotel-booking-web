import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ManageRoomService } from '../../manage-room.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-room-type-modal',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './room-type-modal.component.html'
})
export class RoomTypeModalComponent {
    @Output() closed = new EventEmitter<void>();
    @Output() saved = new EventEmitter<void>();

    roomTypeForm: any = {
        name: '',
        description: '',
        price_per_night: null,
        capacity: 2,
        size_sqm: null,
        amenities: ''
    };

    constructor(private roomService: ManageRoomService) { }

    saveRoomType() {
        if (!this.roomTypeForm.name || !this.roomTypeForm.price_per_night) {
            Swal.fire({
                icon: 'warning',
                title: 'ข้อมูลไม่ครบถ้วน',
                text: 'กรุณากรอกชื่อประเภทห้องและราคาต่อคืน'
            });
            return;
        }

        let amenitiesArray: string[] = [];
        if (this.roomTypeForm.amenities) {
            amenitiesArray = this.roomTypeForm.amenities.split(',').map((item: string) => item.trim()).filter((item: string) => item !== '');
        }

        const payload = {
            name: this.roomTypeForm.name,
            description: this.roomTypeForm.description,
            price_per_night: parseFloat(this.roomTypeForm.price_per_night),
            capacity: parseInt(this.roomTypeForm.capacity, 10) || 2,
            size_sqm: this.roomTypeForm.size_sqm ? parseInt(this.roomTypeForm.size_sqm, 10) : null,
            amenities: amenitiesArray
        };

        this.roomService.createRoomType(payload).subscribe({
            next: () => {
                Swal.fire({
                    icon: 'success',
                    title: 'สำเร็จ!',
                    text: 'เพิ่มประเภทห้องพักเรียบร้อยแล้ว',
                    confirmButtonColor: '#d4af37'
                });
                this.saved.emit();
            },
            error: (error) => {
                Swal.fire({ icon: 'error', title: 'เกิดข้อผิดพลาด!', text: error.statusText || 'ไม่สามารถเพิ่มประเภทห้องได้' });
            }
        });
    }
}