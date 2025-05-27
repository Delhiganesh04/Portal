import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const gaurdGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const loggeddata = localStorage.getItem("customerId");

  if (!loggeddata) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};
