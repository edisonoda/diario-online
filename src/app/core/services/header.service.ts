import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SessaoService } from './sessao.service';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  private headers: HttpHeaders = new HttpHeaders();

  constructor(private sessaoService: SessaoService) { }

  getHeader(): any {
    this.headers = new HttpHeaders({
      'X-Auth-Token': this.sessaoService.token ?? '',
      'X-Auth-Acess-Group': this.sessaoService.idGrupoAcesso ?? '',
    });
    return this.headers;
  }
}
