import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot } from '@angular/router';
import { SessaoService } from '../services/sessao.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class AutenticacaoGuard {
  constructor(private sessaoService: SessaoService, private snackBar: MatSnackBar) { }

  private verificarToken(): boolean {
    const token = this.sessaoService.token;
    const expire = this.sessaoService.tokenExpire;
    if (token && expire) {
      const date = new Date();
      const datetoken = new Date(expire);
      if (datetoken > date) {
        return true;
      }
    }
    
    if (this.sessaoService.logoutURL)
      window.location.href = this.sessaoService.logoutURL;
    return false;
  }

  canActivate(): boolean {
    const expirado = this.verificarToken();

    if (expirado) {
      this.snackBar.open(`Sessão expirada`, '', {
        duration: 5000,
        panelClass: ['md-error-toast-theme']
      });
    }

    return !expirado;
  }
}

export const canActivateLogin: CanActivateFn =
    (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
      return inject(AutenticacaoGuard).canActivate();
    };