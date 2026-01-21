import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from '../services/auth-service';
import {Role} from '../interfaces/user';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);
  
  const user = authService.currentUser();
  
  if (!user) {
    router.navigate(['/login']);
    return false;
  }
  
  if (user.role !== Role.ADMIN) {
    router.navigate(['/tasks']);
    return false;
  }
  
  return true;
};