import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ManageRoomService } from '../../manage-room.service';
import Swal from 'sweetalert2';
import { faXmark, faStar } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { ImageViewerComponent } from '../image-viewer/image-viewer.component';
import { environment } from '../../../../../../environments/environment';

@Component({
    selector: 'app-room-form-modal',
    standalone: true,
    imports: [CommonModule, FormsModule, FaIconComponent, ImageViewerComponent],
    templateUrl: './room-form-modal.component.html',
    styleUrl: './room-form-modal.component.scss',
})
export class RoomFormModalComponent implements OnInit {
    @Input() roomData: any = null;
    @Input() roomTypes: any[] = [];
    @Output() closed = new EventEmitter<void>();
    @Output() saved = new EventEmitter<void>();

    faXmark = faXmark;
    faStar = faStar;
    backendUrl: string = `${environment.apiUrl}`;

    editId: number | null = null;
    f_room_number = '';
    f_room_type_id = '';
    f_floor: number | '' = '';
    f_staff_id: number | '' = '';
    f_status = 'available';

    existingImages: any[] = [];
    selectedFiles: File[] = [];
    previewUrls: string[] = [];
    coverPreviewIndex: number = -1;

    isImageViewerOpen: boolean = false;
    fullSizeImageUrl: string = '';

    constructor(private roomService: ManageRoomService, private cdr: ChangeDetectorRef) { }

    ngOnInit() {
        if (this.roomData) {
            this.editId = this.roomData.id;
            this.f_room_number = this.roomData.room_number;
            this.f_room_type_id = this.roomData.room_type_id;
            this.f_floor = this.roomData.floor;
            this.f_staff_id = this.roomData.staff_id;
            this.f_status = this.roomData.status;
            this.existingImages = this.roomData.room_images || [];
        } else {
            this.f_room_type_id = this.roomTypes.length > 0 ? this.roomTypes[0].id : '';
        }
    }

    saveRoom() {
        if (!this.f_room_number.trim() || !this.f_room_type_id) {
            Swal.fire({ icon: 'warning', title: 'แจ้งเตือน', text: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
            return;
        }

        const payload = {
            room_number: this.f_room_number,
            room_type_id: Number(this.f_room_type_id),
            floor: this.f_floor ? Number(this.f_floor) : null,
            staff_id: this.f_staff_id ? Number(this.f_staff_id) : null,
            status: this.f_status
        };

        if (this.editId) {
            this.roomService.updateRoom(this.editId, payload).subscribe({
                next: () => this.processImageUpload(this.editId!, 'แก้ไขข้อมูลห้องพัก'),
                error: (err) => this.handleError(err, 'แก้ไขข้อมูลไม่สำเร็จ')
            });
        } else {
            this.roomService.createRoom(payload).subscribe({
                next: (res: any) => {
                    const newRoomId = res.data?.id || res.id;
                    if (newRoomId) this.processImageUpload(newRoomId, 'เพิ่มห้องพักใหม่');
                    else { this.saved.emit(); this.closed.emit(); }
                },
                error: (err) => this.handleError(err, 'เพิ่มข้อมูลไม่สำเร็จ')
            });
        }
    }

    private processImageUpload(roomId: number, successMessage: string) {
        if (this.selectedFiles.length > 0) {
            this.roomService.uploadRoomImages(roomId, this.selectedFiles, this.coverPreviewIndex).subscribe({
                next: () => {
                    Swal.fire({
                        icon: 'success',
                        title: 'สำเร็จ!',
                        text: `${successMessage} และอัปโหลดรูปภาพเรียบร้อยแล้ว`,
                        confirmButtonColor: '#d4af37'
                    });
                    this.saved.emit();
                    this.closed.emit();
                },
                error: (err) => this.handleError(err, `${successMessage} สำเร็จ แต่อัปโหลดรูปภาพไม่สำเร็จ`)
            });
        } else {
            Swal.fire({
                icon: 'success',
                title: 'สำเร็จ!',
                text: `${successMessage} เรียบร้อยแล้ว`,
                confirmButtonColor: '#d4af37'
            });
            this.saved.emit();
            this.closed.emit();
        }
    }

    onFileSelected(event: any) {
        const files = event.target.files;
        if (files && files.length > 0) {
            this.selectedFiles = Array.from(files);
            this.previewUrls = [];
            for (let file of this.selectedFiles) {
                const reader = new FileReader();
                reader.onload = (e: any) => {
                    this.previewUrls.push(e.target.result);
                    this.cdr.detectChanges();
                }
                reader.readAsDataURL(file);
            }
            this.coverPreviewIndex = (this.existingImages && this.existingImages.length > 0) ? -1 : 0;
            event.target.value = '';
        }
    }

    setPreviewAsCover(index: number, event: Event) {
        event.stopPropagation();
        this.coverPreviewIndex = index;
        if (this.existingImages) this.existingImages.forEach(i => i.is_cover = false);
    }

    setExistingAsCover(img: any, event: Event) {
        event.stopPropagation();
        if (img.is_cover) return;
        this.roomService.setCoverImage(img.room_id, img.id).subscribe({
            next: () => {
                this.existingImages.forEach(i => i.is_cover = false);
                img.is_cover = true;
                this.coverPreviewIndex = -1;
                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'success',
                    title: 'เปลี่ยนหน้าปกแล้ว',
                    showConfirmButton: false,
                    timer: 1500
                });
            },
            error: (err) => this.handleError(err, 'เปลี่ยนหน้าปกไม่สำเร็จ')
        });
    }

    removeExistingImage(imageId: number, event: Event) {
        event.stopPropagation();
        Swal.fire({
            title: 'ยืนยันการลบรูปภาพ?',
            text: "รูปภาพนี้จะถูกลบทิ้งอย่างถาวร ไม่สามารถกู้คืนได้!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'ใช่, ลบทิ้งเลย!',
            cancelButtonText: 'ยกเลิก',
            reverseButtons: true,
        }).then((result) => {
            if (result.isConfirmed) {
                this.roomService.deleteRoomImage(imageId).subscribe({
                    next: () => {
                        this.existingImages = this.existingImages.filter(img => img.id !== imageId);
                        this.saved.emit();
                        Swal.fire({
                            icon: 'success',
                            title: 'ลบสำเร็จ!',
                            text: 'ลบรูปภาพเรียบร้อยแล้ว',
                            timer: 1500,
                            showConfirmButton: false
                        });
                    },
                    error: (err: any) => this.handleError(err, 'ลบรูปภาพไม่สำเร็จ')
                });
            }
        });
    }

    removePreviewImage(index: number, event: Event) {
        event.stopPropagation();
        this.previewUrls.splice(index, 1);
        this.selectedFiles.splice(index, 1);
        if (this.coverPreviewIndex === index) {
            this.coverPreviewIndex = (this.previewUrls.length > 0 && this.existingImages.length === 0) ? 0 : -1;
        } else if (this.coverPreviewIndex > index) {
            this.coverPreviewIndex--;
        }
    }

    openImageViewer(url: string, isExisting: boolean) {
        this.fullSizeImageUrl = isExisting ? `${this.backendUrl}${url}` : url;
        this.isImageViewerOpen = true;
    }

    handleError(error: any, msg: string) {
        Swal.fire({
            icon: 'error',
            title: 'เกิดข้อผิดพลาด!',
            text: `${msg}: ${error.statusText || 'เซิร์ฟเวอร์ไม่ตอบสนอง'}`,
            confirmButtonText: 'ปิดหน้าต่าง',
            confirmButtonColor: '#dc3545'
        });

    }
}