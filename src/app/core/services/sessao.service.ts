import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SessaoService {

  private _user: any;
  get user() {
    return this._user;
  }

  get token() { return localStorage.getItem('token') }
  get backendServerURL() { return localStorage.getItem('backendServerURL') }
  get logoutURL() { return localStorage.getItem('logoutURL') }
  get idGrupoAcesso() { return localStorage.getItem('idGrupoAcesso') }
  get idInstituicao() { return localStorage.getItem('idInstituicao') }
  get idPeriodoLetivo() { return localStorage.getItem('idPeriodoLetivo') }
  get permissoes() { return localStorage.getItem('permissoes') }

  constructor(private http: HttpClient) { }

  buscarUser(): Observable<any> {
    return this.http.get(`${this.backendServerURL}/usuario`);
  }

  setUserInfo(info: any): void {
    this._user = info.user;

    localStorage.setItem('token', info.token);
    localStorage.setItem('backendServerURL', info.backendServerURL);
    localStorage.setItem('logoutURL', info.logoutURL);
    localStorage.setItem('idGrupoAcesso', info.idGrupoAcesso);
    localStorage.setItem('idInstituicao', info.idInstituicao);
    localStorage.setItem('idPeriodoLetivo', info.idPeriodoLetivo);
    localStorage.setItem('permissoes', this._user.listaPermissao);
  }

  logout(): any {
    Object.keys(localStorage).forEach(key => {
      localStorage.removeItem(key);
    });

    if (this.logoutURL)
      window.location.href = this.logoutURL;
  }
}
