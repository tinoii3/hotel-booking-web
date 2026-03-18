import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-image-viewer',
    standalone: true,
    imports: [CommonModule],
    styleUrl: './image-viewer.component.scss',
    template: `
    <div class="image-viewer" (click)="close.emit()">
        <button type="button" class="image-viewer__close btn-close btn-close-white" aria-label="Close"
            (click)="close.emit()"></button>
        <div class="image-viewer__dialog">
            <div class="image-viewer__content" (click)="$event.stopPropagation()">
                <img [src]="url" class="image-viewer__img img-fluid rounded shadow-lg">
            </div>
        </div>
    </div>
  `
})
export class ImageViewerComponent {
    @Input() url: string = '';
    @Output() close = new EventEmitter<void>();
}