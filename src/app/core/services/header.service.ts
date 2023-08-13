import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SessaoService } from './sessao.service';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  private _headers: HttpHeaders;
  get headers() {
    return this._headers;
  }

  constructor(private sessaoService: SessaoService) {
    this._headers = new HttpHeaders({});

    const token = this.sessaoService.token;
    if (token)
      this._headers.set('X-Auth-Token', token);

    const grupo = this.sessaoService.idGrupoAcesso;
    if (grupo)
      this._headers.set('X-Auth-Acess-Group', grupo);
  }
}
