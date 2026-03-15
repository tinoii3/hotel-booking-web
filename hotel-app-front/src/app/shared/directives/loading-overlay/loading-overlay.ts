import { Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { LoadingService } from '../../../core/services/loading-service';

@Component({
  selector: 'app-loading-overlay',
  imports: [AsyncPipe],
  template: `
  @if (loadingService.loading$ | async) {
    <div class="loading-overlay">
      <div class="spinner-border text-light"></div>
    </div>
  }
  `,
  styleUrl: './loading-overlay.scss'
})
export class LoadingOverlayComponent {

  constructor(public loadingService: LoadingService) {}

}