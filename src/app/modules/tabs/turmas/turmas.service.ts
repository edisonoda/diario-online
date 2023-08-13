import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SessaoService } from 'src/app/core/services/sessao.service';

@Injectable({
  providedIn: 'root'
})
export class TurmasService {
  constructor(private http: HttpClient, private sessaoService: SessaoService) { }

  obterInstituicao(idInstituicao: any): Observable<any> {
    return this.http.get(`${this.sessaoService.backendServerURL}/instituicao/get`, {
      params: { idInstituicao }
    });
  }

  obterPeriodo(idPeriodoLetivo: any): Observable<any> {
    return this.http.get(`${this.sessaoService.backendServerURL}/periodoletivo/get`, {
      params: { idPeriodoLetivo }
    });
  }

  obterTurmas(idInstituicao: any, idPeriodoLetivo: any): Observable<any> {
    return this.http.get(`${this.sessaoService.backendServerURL}/turma/instituicao/${idInstituicao}`, {
      params: { idPeriodoLetivo }
    });
  }

  deveExibirCiOrientadora(idInstituicao: any): Observable<any> {
    return this.http.get(`${this.sessaoService.backendServerURL}/turma/instituicao/${idInstituicao}/exibe-ci-orientadora`);
  }

  deveExibirRegistroModulo(idInstituicao: any): Observable<any> {
    return this.http.get(`${this.sessaoService.backendServerURL}/turma/instituicao/${idInstituicao}/exibe-plano-aula-registro-modulo`);
  }

  deveExibirRecuperacaoParalela(idInstituicao: any): Observable<any> {
    return this.http.get(`${this.sessaoService.backendServerURL}/turma/instituicao/${idInstituicao}/exibe-plano-aula-recuperacao-paralela`);
  }

  deveValidarLancamentoFrequenciaDomingo(idInstituicao: any): Observable<any> {
    return this.http.get(`${this.sessaoService.backendServerURL}/turma/instituicao/${idInstituicao}/frequencia/domingo/validar`);
  }
}
