

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { SessaoService } from '../services/sessao';

export const authGuard: CanActivateFn = () => {

  const sessaoService = inject(SessaoService);
  const router = inject(Router);

  if (sessaoService.getClienteId() !== null) {
    return true;
  }

  return router.createUrlTree(['/login']);
};
