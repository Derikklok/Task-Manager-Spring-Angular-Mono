import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('🔐 Auth Guard - Checking route:', state.url);
  
  const token = authService.getToken();
  const isAuth = !!token;
  
  console.log('🔐 Auth Guard - Token exists:', !!token, 'IsAuthenticated:', isAuth);
  
  if (isAuth) {
    console.log('✅ Auth Guard - Access ALLOWED to:', state.url);
    return true;
  }

  console.log('🚫 Auth Guard - Access DENIED, redirecting to login');
  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};
