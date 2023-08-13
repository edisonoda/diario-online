import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { SessaoService } from '../services/sessao.service';

@Injectable({ providedIn: 'root' })
export class AutenticacaoGuard {
  constructor(private sessaoService: SessaoService, private router: Router) { }

  canActivate(): boolean {
    if (this.sessaoService.token)
      this.router.navigate(['turmas'], {
        queryParams: {
          idInstituicao: this.sessaoService.idInstituicao,
          idPeriodoLetivo: this.sessaoService.idPeriodoLetivo
        }
      });
    else if (this.sessaoService.logoutURL)
      window.location.href = this.sessaoService.logoutURL;

    return !!this.sessaoService.token;
  }
}

export const canActivateLogin: CanActivateFn =
    (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
      return inject(AutenticacaoGuard).canActivate();
    };