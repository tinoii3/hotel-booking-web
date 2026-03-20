import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../core/services/token-service';

export const roleGuard: CanActivateFn = (route) => {

  const tokenService = inject(TokenService);
  const router = inject(Router);

  const requiredRole = route.data?.['role'];
  const userRole = tokenService.getUserRole();

  if (userRole === requiredRole) {
    return true;
  }

  router.navigate(['/hotel']);
  return false;

};
