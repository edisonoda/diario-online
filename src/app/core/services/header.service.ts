import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  private _headers: HttpHeaders;
  get headers() {
    return this._headers;
  }

  constructor() {
    this._headers = new HttpHeaders({});
  }

  setHeaders(token: any, idGrupoAcesso: any): void {
    if (token)
      this._headers.set('X-Auth-Token', token);

    if (idGrupoAcesso)
      this._headers.set('X-Auth-Acess-Group', idGrupoAcesso);
  }
}
