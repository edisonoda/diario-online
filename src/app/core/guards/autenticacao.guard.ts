import { Observable } from 'rxjs';
import { AesUtilService } from '../services/aes-util.service';
import { SessaoService } from './../services/sessao.service';
import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AutenticacaoGuard {
  constructor(
    private sessaoService: SessaoService,
    private aesUtilService: AesUtilService
  ) { }

  canActivate(entry: any): boolean {
    try {
      const decodedEntry = JSON.parse(this.aesUtilService.decrypt(decodeURIComponent(entry)));
      return decodedEntry.token !== this.sessaoService.token;
    } catch { }

    this.sessaoService.logout();
    return false;
  }
}

const canActivateLogin: CanActivateFn =
    (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
      return inject(AutenticacaoGuard).canActivate(route.params['entry']);
    };