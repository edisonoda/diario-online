import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface UserInfo {
  token: any;
  backendServerURL: string;
  logoutURL: string;
  idGrupoAcesso: any;
};

@Injectable({
  providedIn: 'root'
})
export class SessaoService {

  get token() { return localStorage.getItem('token') }
  get backendServerURL() { return localStorage.getItem('backendServerURL') }
  get logoutURL() { return localStorage.getItem('logoutURL') }
  get idGrupoAcesso() { return localStorage.getItem('idGrupoAcesso') }

  constructor(private http: HttpClient) { }

  setUserInfo(info: UserInfo): void {
    Object.entries(info).forEach(([key, value]) => {
      localStorage.setItem(key, value);
    });
  }

  logout(): any {
    Object.keys(localStorage).forEach(key => {
      localStorage.removeItem(key);
    });

    if (this.logoutURL)
      window.location.href = this.logoutURL;
  }
}
