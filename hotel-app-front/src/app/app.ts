import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoadingOverlayComponent } from './shared/directives/loading-overlay/loading-overlay';
import { TokenService } from './core/services/token-service';
import { UserService } from './core/services/user-service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoadingOverlayComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  constructor(
    private userService: UserService,
    private tokenService: TokenService,
  ) {}

  ngOnInit() {
    const token = this.tokenService.getAccessToken();

    if (token) {
      this.userService.loadProfile().subscribe({
        next: (user) => {
        },
        error: () => {
          this.tokenService.clearToken();
        },
      });
    }
  }
}
