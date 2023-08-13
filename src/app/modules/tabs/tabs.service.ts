import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { CORES } from 'src/app/core/constants';
import { SessaoService } from 'src/app/core/services/sessao.service';

@Injectable({
  providedIn: 'root'
})
export class TabsService {
  private _selecionar = new Subject<{ etapa: string, dados: any }>();
  selecionar$: Observable<{ etapa: string, dados: any }> = this._selecionar.asObservable();

  constructor(
    private http: HttpClient,
    private sessaoService: SessaoService,
    private router: Router,
  ) { }

  passarEtapa(etapa: string, proxEtapa: string, dados: any, params: string): void {
    this._selecionar.next({ etapa, dados });
    this.router.navigate([proxEtapa], {
      queryParams: params.split('&').reduce((params: any, param) => {
        const [key, value] = param.split('=');
        params[key] = value;

        return params;
      }, {})
    });
  }

  getCols(): number {
    const width = window.innerWidth;

    if (width < 576)
      return 1;
    else if (width < 768)
      return 3;
    else if (width < 992)
      return 4;
    else
      return 6;
  }

  randomizarCores(list: any[]) {
    list.forEach(item => {
      if (!item.color) {
        // usa o id do item para definir a cor, sendo as cores um array com a quantidade de numeros decimais
        // possíveis [0...9]
        item.color = CORES[parseInt(`${item.ordem ? item.ordem : item.id}`.slice(-1))];
      }
    });
  };

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

  obterDisciplinas(idInstituicao: any, idTurma: any, idEtapa: any): Observable<any> {
    return this.http.get(`${this.sessaoService.backendServerURL}/disciplina/instituicao/${idInstituicao}`, {
      params: { idTurma, idEtapa }
    });
  }

  obterDivisoes(idInstituicao: any, idTurma: any, idDisciplina: any, idEtapa: any): Observable<any> {
    return this.http.get(`${this.sessaoService.backendServerURL}/disciplina/instituicao/${idInstituicao}`, {
      params: { idTurma, idDisciplina, idEtapa }
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
