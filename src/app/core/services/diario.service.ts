import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { SessaoService } from 'src/app/core/services/sessao.service';
import { GET_FILTRO_TOKEN } from '../interceptors/get-filtros/get-filtros.service';
import { HeaderService } from './header.service';

@Injectable({
  providedIn: 'root'
})
export class DiarioService {
  backendServerURL: string;

  constructor(
    private http: HttpClient,
    private sessaoService: SessaoService,
    private headerService: HeaderService,
  ) {
    this.backendServerURL = this.sessaoService.backendServerURL ?? '';
  }

  obterInstituicao(idInstituicao: any): Observable<any> {
    // return of({
    //   data: {
    //     nome: "Instituição"
    //   }
    // });

    return this.http.get(`${this.backendServerURL}/instituicao/get`, {
      params: { idInstituicao },
      context: new HttpContext().set(GET_FILTRO_TOKEN, 'instituicao'),
      headers: this.headerService.getHeader()
    });
  }

  obterPeriodo(idPeriodoLetivo: any): Observable<any> {
    // return of({
    //   data: {
    //     nome: "Período letivo"
    //   }
    // });

    return this.http.get(`${this.backendServerURL}/periodoletivo/get`, {
      params: { idPeriodoLetivo },
      context: new HttpContext().set(GET_FILTRO_TOKEN, 'periodo'),
    });
  }

  obterTurma(idTurma: any, idEtapa: any): Observable<any> {
    return this.http.get(`${this.backendServerURL}/turma/get`, {
      params: { idTurma, idEtapa },
      context: new HttpContext().set(GET_FILTRO_TOKEN, 'turma'),
    });
  }

  obterDisciplina(idInstituicao: any, idTurma: any, idDisciplina: any, idEtapa: any): Observable<any> {
    return this.http.get(`${this.backendServerURL}/disciplina/instituicao/${idInstituicao}/get`, {
      params: { idTurma, idDisciplina, idEtapa },
      context: new HttpContext().set(GET_FILTRO_TOKEN, 'disciplina'),
    });
  }

  obterDivisao(idInstituicao: any, idTurma: any, idDisciplina: any, idDivisao: any, idEtapa: any): Observable<any> {
    return this.http.get(`${this.backendServerURL}/disciplina/instituicao/${idInstituicao}/get`, {
      params: { idTurma, idDisciplina, idDivisao, idEtapa },
      context: new HttpContext().set(GET_FILTRO_TOKEN, 'divisao'),
    });
  }

  obterAlunos(idInstituicao: any, idPeriodoLetivo: any, idTurma: any, idDisciplina: any, idDivisao: any, idEtapa: any): Observable<any> {
    return this.http.get(`${this.sessaoService.backendServerURL}/aluno/instituicao/${idInstituicao}`, {
      params: { idPeriodoLetivo, idTurma, idDisciplina, idDivisao, idEtapa },
    });
  }

  obterTurmas(idInstituicao: any, idPeriodoLetivo: any): Observable<any> {
    // return of({
    //   data: [
    //     {
    //       id: "1",
    //       nome: "Turma 1",
    //       etapa: {
    //         id: 1,
    //         nivel: {
    //           nome: "Nível 1"
    //         },
    //         nome: "Etapa 1"
    //       },
    //       turno: {
    //         nome: "Turno 1"
    //       }
    //     },
    //     {
    //       id: "2",
    //       nome: "Turma 2",
    //       etapa: {
    //         id: 2,
    //         nivel: {
    //           nome: "Nível 2"
    //         },
    //         nome: "Etapa 2"
    //       },
    //       turno: {
    //         nome: "Turno 2"
    //       }
    //     }
    //   ]
    // });
    
    return this.http.get(`${this.backendServerURL}/turma/instituicao/${idInstituicao}`, {
      params: { idPeriodoLetivo }
    });
  }

  obterDisciplinas(idInstituicao: any, idTurma: any, idEtapa: any): Observable<any> {
    // return of({
    //   data: [
    //     {
    //       id: "1",
    //       nome: "Disciplina 1",
    //     },
    //     {
    //       id: "2",
    //       nome: "Disciplina 2",
    //     },
    //   ]
    // });

    return this.http.get(`${this.backendServerURL}/disciplina/instituicao/${idInstituicao}`, {
      params: { idTurma, idEtapa }
    });
  }

  obterDivisoes(idInstituicao: any, idTurma: any, idDisciplina: any, idEtapa: any): Observable<any> {
    // return of({
    //   data: [
    //     {
    //       id: "1",
    //       nome: "Divisão 1",
    //     },
    //     {
    //       id: "2",
    //       nome: "Divisão 2",
    //     },
    //   ]
    // });

    return this.http.get(`${this.backendServerURL}/disciplina/instituicao/${idInstituicao}`, {
      params: { idTurma, idDisciplina, idEtapa }
    });
  }

  obterDiasAula(idInstituicao: any, idTurma: any, idDisciplina: any, idDivisao: any, idEtapa: any): Observable<any> {
    return this.http.get(`${this.sessaoService.backendServerURL}/programacaoaula/instituicao/${idInstituicao}`, {
      params: { idTurma, idDisciplina, idDivisao, idEtapa }
    });
  }

  obterAvaliacoes(idInstituicao: any, idTurma: any, idDisciplina: any, idDivisao: any, idEtapa: any): Observable<any> {
    return this.http.get(`${this.sessaoService.backendServerURL}/programacaoaula/instituicao/${idInstituicao}`, {
      params: { idTurma, idDisciplina, idDivisao, idEtapa }
    });
  }

  obterListaConceitoDisciplina(idInstituicao: any, idTurma: any, idDisciplina: any, idEtapa: any): Observable<any> {
    return this.http.get(`${this.sessaoService.backendServerURL}/disciplina/instituicao/${idInstituicao}/listaConceito`, {
      params: { idTurma, idDisciplina, idEtapa }
    });
  }

  buscarNumeroMaxDeAulasPorDia(): Observable<any> {
    return this.http.get(`${this.sessaoService.backendServerURL}/diario/instituicao/numero-max-aulas-dia`);
  }

  deveExibirCiOrientadora(idInstituicao: any): Observable<any> {
    return this.http.get(`${this.backendServerURL}/turma/instituicao/${idInstituicao}/exibe-ci-orientadora`);
  }

  deveExibirRegistroModulo(idInstituicao: any): Observable<any> {
    return this.http.get(`${this.backendServerURL}/turma/instituicao/${idInstituicao}/exibe-plano-aula-registro-modulo`);
  }

  deveExibirRecuperacaoParalela(idInstituicao: any): Observable<any> {
    return this.http.get(`${this.backendServerURL}/turma/instituicao/${idInstituicao}/exibe-plano-aula-recuperacao-paralela`);
  }

  deveValidarLancamentoFrequenciaDomingo(idInstituicao: any): Observable<any> {
    return this.http.get(`${this.backendServerURL}/turma/instituicao/${idInstituicao}/frequencia/domingo/validar`);
  }

  removerDiaAula(idInstituicao: any, idProgramacaoDivisaoAula: any, idTurma: any, idDisciplina: any, idEtapa: any, idDivisao: any): Observable<any> {
    return this.http.delete(`${this.backendServerURL}/programacaoaula/remover/${idProgramacaoDivisaoAula}/turma/${idTurma}\/disciplina/${idDisciplina}/instituicao/${idInstituicao}/etapa/${idEtapa}/divisao/${idDivisao}`);
  }

  criarNovoDiaAula(idInstituicao: any, idTurma: any, idDisciplina: any, idDivisao: any, dataAula: any, idEtapa: any): Observable<any> {
    return this.http.post(`${this.backendServerURL}/programacaoaula/salvar/instituicao/${idInstituicao}`, {
      idTurma, idEtapa, idDisciplina, idDivisao, dataAula
    }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }
    });
  }

  salvarPlanoAula(idInstituicao: any, id: any, idTurma: any, idDisciplina: any, conteudo: any, modulo: any, idEtapa: any, recuperacaoParalela: any): Observable<any> {
    return this.http.post(`${this.backendServerURL}/programacaoaula/editar/instituicao/${idInstituicao}`, {
      id, idTurma, idEtapa, idDisciplina, conteudo, modulo, recuperacaoParalela
    }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }
    });
  }

  salvarDiaAula(idInstituicao: any, idPeriodoLetivo: any, idTurma: any, idDisciplina: any, idDivisao: any, programacaoDivisaoAula: any, lancamentosFrequencia: any, idEtapa: any): Observable<any> {
    return this.http.post(`${this.backendServerURL}/diario/instituicao/${idInstituicao}/frequencia/salvar`, {
      "idPeriodoLetivo": idPeriodoLetivo,
      "idTurma": idTurma,
      "idEtapa": idEtapa,
      "idDisciplina": idDisciplina,
      "idDivisao": idDivisao,
      "dataAula": programacaoDivisaoAula.data,
      "ordem": programacaoDivisaoAula.ordem,
      "lancamentosFrequencia": lancamentosFrequencia
    }, {
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      }
    });
  }

  corrigirTotalFaltas(idInstituicao: any, idPeriodoLetivo: any, idTurma: any, idDisciplina: any, idDivisao: any, idEtapa: any, idAluno: any, faltas: any, faltasCorrigida: any, indice: any): Observable<any> {
    return this.http.post(`${this.backendServerURL}/diario/instituicao/${idInstituicao}/frequencia/falta/corrigir`, {
      "idPeriodoLetivo": idPeriodoLetivo,
      "idTurma": idTurma,
      "idDisciplina": idDisciplina,
      "idDivisao": idDivisao,
      "idEtapa": idEtapa,
      "idAluno": idAluno,
      "faltas": faltas,
      "faltasCorrigida": faltasCorrigida,
      "indice": indice
    }, {
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      }
    });
  }
}
