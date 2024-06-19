import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from '../services/login/login.service';
import { inject } from '@angular/core';

export const loginGuard: CanActivateFn = (route, state) => {
  
  const loginService = inject(LoginService);
  const router = inject(Router);

  loginService.logged().subscribe({
    next: (result) => {
      console.log(result);
      loginService.logeado = true;
      return true;
    },
    error: (error) => {
      console.log(error);
      loginService.logeado = false;
      router.navigateByUrl('/login');
      return false;
    },
    complete: () => {},
  });
  
  return true;
};
