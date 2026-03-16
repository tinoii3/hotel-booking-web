import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../core/services/token-service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = () => {

  const tokenService = inject(TokenService);
  const router = inject(Router);

  if (tokenService.isLoggedIn()) {
    return true;
  }

  router.navigate(['/auth/login']);
  return false;
};
