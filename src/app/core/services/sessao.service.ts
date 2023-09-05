import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class  SessaoService {

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

  buscarUser(token: any, backendServerURL: any, idGrupoAcesso: any): Observable<any> {
    console.log(token)
    localStorage.setItem('token', token);
    localStorage.setItem('idGrupoAcesso', idGrupoAcesso);

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
