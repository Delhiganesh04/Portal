import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';


export const vengaurdGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);

  const loggeddata = localStorage.getItem("accountNo");

  if (!loggeddata) {
    router.navigate(['/login2']);
    return false;
  }

  return true;
};
