import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const empgaurdGuard: CanActivateFn = (route, state) => {
   const router = inject(Router);
    const loggeddata = localStorage.getItem("EmployeeId");

  if (!loggeddata) {
    router.navigate(['/login3']);
    return false;
  }

  return true;
};
