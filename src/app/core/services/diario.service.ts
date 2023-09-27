import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { SessaoService } from 'src/app/core/services/sessao.service';
import { GET_FILTRO_TOKEN } from '../interceptors/get-filtros/get-filtros.service';
import { CONFIGURACOES } from '../constants';


@Injectable({
  providedIn: 'root'
})
export class DiarioService {
  backendServerURL: string;

  constructor(
    private http: HttpClient,
    private sessaoService: SessaoService
  ) {
    this.backendServerURL = CONFIGURACOES.REST_ADDRESS;
  }

  obterInstituicao(idInstituicao: any): Observable<any> {
    return this.http.get(`${this.backendServerURL}instituicao/get`, {
      params: { idInstituicao },
      context: new HttpContext().set(GET_FILTRO_TOKEN, 'instituicao'),
      headers: {
        'X-Auth-Token': sessionStorage.getItem("token")!,
        'X-Auth-Acess-Group': sessionStorage.getItem("idGrupoAcesso")!,
      }
    });
  }

  obterPeriodo(idPeriodoLetivo: any): Observable<any> {
    return this.http.get(`${this.backendServerURL}periodoletivo/get`, {
      params: { idPeriodoLetivo },
      context: new HttpContext().set(GET_FILTRO_TOKEN, 'periodo'),
      headers: {
        'X-Auth-Token': this.sessaoService.token!,
        'X-Auth-Acess-Group': this.sessaoService.idGrupoAcesso!,
      }
    });
  }

  obterTurma(idTurma: any, idEtapa: any): Observable<any> {
    return this.http.get(`${this.backendServerURL}turma/get`, {
      params: { idTurma, idEtapa },
      context: new HttpContext().set(GET_FILTRO_TOKEN, 'turma'),
      headers: {
        'X-Auth-Token': this.sessaoService.token!,
        'X-Auth-Acess-Group': this.sessaoService.idGrupoAcesso!,
      }
    });
  }

  obterDisciplina(idInstituicao: any, idTurma: any, idDisciplina: any, idEtapa: any): Observable<any> {
    return this.http.get(`${this.backendServerURL}disciplina/instituicao/${idInstituicao}/get`, {
      params: { idTurma, idDisciplina, idEtapa },
      context: new HttpContext().set(GET_FILTRO_TOKEN, 'disciplina'),
      headers: {
        'X-Auth-Token': this.sessaoService.token!,
        'X-Auth-Acess-Group': this.sessaoService.idGrupoAcesso!,
      }
    });
  }

  obterDivisao(idInstituicao: any, idTurma: any, idDisciplina: any, idDivisao: any, idEtapa: any): Observable<any> {
    return this.http.get(`${this.backendServerURL}divisao/instituicao/${idInstituicao}/get`, {
      params: { idDivisao, idTurma, idDisciplina, idEtapa },
      context: new HttpContext().set(GET_FILTRO_TOKEN, 'divisao'),
      headers: {
        'X-Auth-Token': this.sessaoService.token!,
        'X-Auth-Acess-Group': this.sessaoService.idGrupoAcesso!,
      }
    });
  }

  obterAlunos(idInstituicao: any, idPeriodoLetivo: any, idTurma: any, idDisciplina: any, idDivisao: any, idEtapa: any): Observable<any> {
    return this.http.get(`${this.sessaoService.backendServerURL}aluno/instituicao/${idInstituicao}`, {
      params: { idPeriodoLetivo, idTurma, idDisciplina, idDivisao, idEtapa },
      headers: {
        'X-Auth-Token': this.sessaoService.token!,
        'X-Auth-Acess-Group': this.sessaoService.idGrupoAcesso!,
      }
    });
  }

  obterTurmas(idInstituicao: any, idPeriodoLetivo: any): Observable<any> {
    return this.http.get(`${this.backendServerURL}turma/instituicao/${idInstituicao}/`, {
      params: { idPeriodoLetivo },
      headers: {
        'X-Auth-Token': this.sessaoService.token!,
        'X-Auth-Acess-Group': this.sessaoService.idGrupoAcesso!,
      }
    });
  }

  obterDisciplinas(idInstituicao: any, idTurma: any, idEtapa: any): Observable<any> {
    return this.http.get(`${this.backendServerURL}disciplina/instituicao/${idInstituicao}`, {
      params: { idTurma, idEtapa },
      headers: {
        'X-Auth-Token': this.sessaoService.token!,
        'X-Auth-Acess-Group': this.sessaoService.idGrupoAcesso!,
      }
    });
  }

  obterDivisoes(idInstituicao: any, idTurma: any, idDisciplina: any, idEtapa: any): Observable<any> {
    return this.http.get(`${this.backendServerURL}divisao/instituicao/${idInstituicao}`, {
      params: { idTurma, idDisciplina, idEtapa },
      headers: {
        'X-Auth-Token': this.sessaoService.token!,
        'X-Auth-Acess-Group': this.sessaoService.idGrupoAcesso!,
      }
    });
  }

  obterDiasAula(idInstituicao: any, idTurma: any, idDisciplina: any, idDivisao: any, idEtapa: any): Observable<any> {
    return this.http.get(`${this.sessaoService.backendServerURL}programacaoaula/instituicao/${idInstituicao}`, {
      params: { idTurma, idDisciplina, idDivisao, idEtapa },
      headers: {
        'X-Auth-Token': this.sessaoService.token!,
        'X-Auth-Acess-Group': this.sessaoService.idGrupoAcesso!,
      }
    });
  }

  obterAvaliacoes(idInstituicao: any, idTurma: any, idDisciplina: any, idDivisao: any, idEtapa: any): Observable<any> {
    return this.http.get(`${this.sessaoService.backendServerURL}avaliacao/instituicao/${idInstituicao}`, {
        params: { idTurma, idDisciplina, idDivisao, idEtapa },
      headers: {
        'X-Auth-Token': this.sessaoService.token!,
        'X-Auth-Acess-Group': this.sessaoService.idGrupoAcesso!,
      }
    });
  }

  obterListaConceitoDisciplina(idInstituicao: any, idTurma: any, idDisciplina: any, idEtapa: any): Observable<any> {
    return this.http.get(`${this.sessaoService.backendServerURL}disciplina/instituicao/${idInstituicao}/listaConceito`, {
      params: { idTurma, idDisciplina, idEtapa },
      headers: {
        'X-Auth-Token': this.sessaoService.token!,
        'X-Auth-Acess-Group': this.sessaoService.idGrupoAcesso!,
      }
    });
  }

  buscarNumeroMaxDeAulasPorDia(): Observable<any> {
    return this.http.get(`${this.sessaoService.backendServerURL}diario/instituicao/numero-max-aulas-dia`, {
      headers: {
        'X-Auth-Token': this.sessaoService.token!,
        'X-Auth-Acess-Group': this.sessaoService.idGrupoAcesso!,
      }
    });
  }

  deveExibirCiOrientadora(idInstituicao: any): Observable<any> {
    return this.http.get(`${this.backendServerURL}turma/instituicao/${idInstituicao}/exibe-ci-orientadora`, {
      headers: {
        'X-Auth-Token': this.sessaoService.token!,
        'X-Auth-Acess-Group': this.sessaoService.idGrupoAcesso!,
      }
    });
  }

  deveExibirRegistroModulo(idInstituicao: any): Observable<any> {
    return this.http.get(`${this.backendServerURL}turma/instituicao/${idInstituicao}/exibe-plano-aula-registro-modulo`, {
      headers: {
        'X-Auth-Token': this.sessaoService.token!,
        'X-Auth-Acess-Group': this.sessaoService.idGrupoAcesso!,
      }
    });
  }

  deveExibirRecuperacaoParalela(idInstituicao: any): Observable<any> {
    return this.http.get(`${this.backendServerURL}turma/instituicao/${idInstituicao}/exibe-plano-aula-recuperacao-paralela`, {
      headers: {
        'X-Auth-Token': this.sessaoService.token!,
        'X-Auth-Acess-Group': this.sessaoService.idGrupoAcesso!,
      }
    });
  }

  deveValidarLancamentoFrequenciaDomingo(idInstituicao: any): Observable<any> {
    return this.http.get(`${this.backendServerURL}instituicao/${idInstituicao}/frequencia/domingo/validar`, {
      headers: {
        'X-Auth-Token': this.sessaoService.token!,
        'X-Auth-Acess-Group': this.sessaoService.idGrupoAcesso!,
      }
    });
  }

  removerDiaAula(idInstituicao: any, idProgramacaoDivisaoAula: any, idTurma: any, idDisciplina: any, idEtapa: any, idDivisao: any): Observable<any> {
    return this.http.delete(`${this.backendServerURL}programacaoaula/remover/${idProgramacaoDivisaoAula}/turma/${idTurma}\/disciplina/${idDisciplina}/instituicao/${idInstituicao}/etapa/${idEtapa}/divisao/${idDivisao}`, {
      headers: {
        'X-Auth-Token': this.sessaoService.token!,
        'X-Auth-Acess-Group': this.sessaoService.idGrupoAcesso!,
      }
    });
  }

  criarNovoDiaAula(idInstituicao: any, idTurma: any, idDisciplina: any, idDivisao: any, dataAula: any, idEtapa: any): Observable<any> {
    let form = this.serialize({idTurma, idEtapa, idDisciplina, idDivisao, dataAula})
    return this.http.post(`${this.backendServerURL}programacaoaula/salvar/instituicao/${idInstituicao}/`, form, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'X-Auth-Token': this.sessaoService.token!,
        'X-Auth-Acess-Group': this.sessaoService.idGrupoAcesso!
      }
    });
  }

  salvarPlanoAula(idInstituicao: any, id: any, idTurma: any, idDisciplina: any, conteudo: any, modulo: any, idEtapa: any, recuperacaoParalela: any): Observable<any> {
    return this.http.post(`${this.backendServerURL}programacaoaula/editar/instituicao/${idInstituicao}`, {
      id, idTurma, idEtapa, idDisciplina, conteudo, modulo, recuperacaoParalela
    }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'X-Auth-Token': this.sessaoService.token!,
        'X-Auth-Acess-Group': this.sessaoService.idGrupoAcesso!
      }
    });
  }

  salvarDiaAula(idInstituicao: any, idPeriodoLetivo: any, idTurma: any, idDisciplina: any, idDivisao: any, programacaoDivisaoAula: any, lancamentosFrequencia: any, idEtapa: any): Observable<any> {
    return this.http.post(`${this.backendServerURL}diario/instituicao/${idInstituicao}/frequencia/salvar`, {
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
        'Content-Type': 'application/json;charset=utf-8',
        'X-Auth-Token': this.sessaoService.token!,
        'X-Auth-Acess-Group': this.sessaoService.idGrupoAcesso!
      }
    });
  }

  corrigirTotalFaltas(idInstituicao: any, idPeriodoLetivo: any, idTurma: any, idDisciplina: any, idDivisao: any, idEtapa: any, idAluno: any, faltas: any, faltasCorrigida: any, indice: any): Observable<any> {
    return this.http.post(`${this.backendServerURL}diario/instituicao/${idInstituicao}/frequencia/falta/corrigir`, {
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
        'Content-Type': 'application/json;charset=utf-8',
        'X-Auth-Token': this.sessaoService.token!,
        'X-Auth-Acess-Group': this.sessaoService.idGrupoAcesso!
      }
    });
  }

  salvarAvaliacoes(idInstituicao:any, idDivisao:any, idTurma:any, idDisciplina:any, avaliacoes:any, idEtapa:any): Observable<any> {
    return this.http.post(`${this.backendServerURL}diario/avaliacao/${idInstituicao}/salvar`, {
      "idDivisao": idDivisao,
      "idTurma": idTurma,
      "idEtapa": idEtapa,
      "idDisciplina": idDisciplina,
      "avaliacoesRest": avaliacoes
    }, {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'X-Auth-Token': this.sessaoService.token!,
        'X-Auth-Acess-Group': this.sessaoService.idGrupoAcesso!
      }
    });
  }

  salvarNotas(idInstituicao: any, idPeriodoLetivo: any, idTurma: any, idDisciplina: any, idDivisao: any, lancamentosNota: any, idEtapa: any): Observable<any> {
    return this.http.post(`${this.backendServerURL}diario/instituicao/${idInstituicao}/avaliacoes/salvar`, {
      "idPeriodoLetivo": idPeriodoLetivo,
      "idTurma": idTurma,
      "idEtapa": idEtapa,
      "idDisciplina": idDisciplina,
      "idDivisao": idDivisao,
      "lancamentosNota": lancamentosNota
    }, {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'X-Auth-Token': this.sessaoService.token!,
        'X-Auth-Acess-Group': this.sessaoService.idGrupoAcesso!
      }
    });
  }

  corrigirTotalAulasLecionadas(idInstituicao: any, idPeriodoLetivo: any, idTurma: any, idDisciplina: any, idDivisao: any, idEtapa: any, idProgramacaoPedagogicaDivisao: any,
    aulasLecionadasDivisao: any, aulasLancadasDiario: any): Observable<any> {
    return this.http.put(`${this.backendServerURL}diario/instituicao/${idInstituicao}/frequencia/aula/corrigir`, {
      "idPeriodoLetivo": idPeriodoLetivo,
      "idTurma": idTurma,
      "idDisciplina": idDisciplina,
      "idDivisao": idDivisao,
      "idEtapa": idEtapa,
      "idProgramacaoPedagogicaDivisao": idProgramacaoPedagogicaDivisao,
      "aulasLecionadasDivisao": aulasLecionadasDivisao,
      "aulasLancadasDiario": aulasLancadasDiario
    }, {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'X-Auth-Token': this.sessaoService.token!,
        'X-Auth-Acess-Group': this.sessaoService.idGrupoAcesso!
      }
    });
  }
  serialize(obj: any) {
    let params: URLSearchParams = new URLSearchParams();


    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        var element = obj[key];

        params.set(key, element);
      }
    }

    return params;
  }

  obterPendenciasAvaliacao(idInstituicao: any, idTurma: any, idEtapa: any): Observable<any> {
    return this.http.get(`${this.backendServerURL}pendencias/instituicao/${idInstituicao}/`, {
      params: { idTurma, idEtapa },
      headers: {
        'X-Auth-Token': this.sessaoService.token!,
        'X-Auth-Acess-Group': this.sessaoService.idGrupoAcesso!,
      }
    });
  }

  obterTotalPendenciasAvaliacaoDisciplina(idInstituicao: any, idTurma: any, idEtapa: any, idDisciplina:any): Observable<any> {
    return this.http.get(`${this.backendServerURL}pendencias/instituicao/${idInstituicao}/total/`, {
      params: { idTurma, idEtapa, idDisciplina },
      headers: {
        'X-Auth-Token': this.sessaoService.token!,
        'X-Auth-Acess-Group': this.sessaoService.idGrupoAcesso!,
      }
    });
  }

    obterPendenciasAvaliacaoDisciplina(idInstituicao: any, idTurma: any, idEtapa: any, idDisciplina:any, idAluno: any): Observable<any> {
    return this.http.get(`${this.backendServerURL}pendencias/instituicao/${idInstituicao}/disciplina/`, {
      params: { idTurma, idEtapa, idDisciplina, idAluno },
      headers: {
        'X-Auth-Token': this.sessaoService.token!,
        'X-Auth-Acess-Group': this.sessaoService.idGrupoAcesso!,
      }
    });
  }
}
