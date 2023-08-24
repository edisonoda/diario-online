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

  get token() { return sessionStorage.getItem('token') }
  get backendServerURL() { return sessionStorage.getItem('backendServerURL') }
  get logoutURL() { return sessionStorage.getItem('logoutURL') }
  get idGrupoAcesso() { return sessionStorage.getItem('idGrupoAcesso') }
  get idInstituicao() { return sessionStorage.getItem('idInstituicao') }
  get idPeriodoLetivo() { return sessionStorage.getItem('idPeriodoLetivo') }
  get permissoes() { return sessionStorage.getItem('permissoes') }

  constructor(private http: HttpClient) { }

  buscarUser(token: any, backendServerURL: any, idGrupoAcesso: any): Observable<any> {
    console.log(token)
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('idGrupoAcesso', idGrupoAcesso);

    return this.http.get(`${backendServerURL}/usuario/`, {
      headers: {
        'X-Auth-Token': token,
        'X-Auth-Acess-Group': idGrupoAcesso,
      }
    });
  }

  setUserInfo(info: any): void {
    this._user = info.user;

    console.log(info);
    localStorage.setItem('token', info.token);
    localStorage.setItem('backendServerURL', info.backendServerURL.replace('4200', '8080'));
    localStorage.setItem('logoutURL', info.logoutURL);
    localStorage.setItem('idGrupoAcesso', info.idGrupoAcesso);
    localStorage.setItem('idInstituicao', info.idInstituicao);
    localStorage.setItem('idPeriodoLetivo', info.idPeriodoLetivo);
    localStorage.setItem('permissoes', info.listaPermissao);
  }

  logout(): any {
    Object.keys(localStorage).forEach(key => {
      localStorage.removeItem(key);
    });

    if (this.logoutURL)
      window.location.href = this.logoutURL;
    else
      window.history.back();
  }
}
