import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SessaoService } from './sessao.service';
import { DiarioService } from './diario.service';

@Injectable({
  providedIn: 'root'
})
export class FiltrosService {
  backendServerURL: string;

  private _idInstituicao: any;
  get idInstituicao() { return this._idInstituicao }
  set idInstituicao(id) { if (id != 'undefined') this._idInstituicao = id }

  private _idPeriodoLetivo: any;
  get idPeriodoLetivo() { return this._idPeriodoLetivo }
  set idPeriodoLetivo(id) { if (id != 'undefined') this._idPeriodoLetivo = id }

  private _idTurma: any;
  get idTurma() { return this._idTurma }
  set idTurma(id) { if (id != 'undefined') this._idTurma = id }

  private _idDisciplina: any;
  get idDisciplina() { return this._idDisciplina }
  set idDisciplina(id) { if (id != 'undefined') this._idDisciplina = id }

  private _idDivisao: any;
  get idDivisao() { return this._idDivisao }
  set idDivisao(id) { if (id != 'undefined') this._idDivisao = id }

  private _idEtapa: any;
  get idEtapa() { return this._idEtapa }
  set idEtapa(id) { if (id != 'undefined') this._idEtapa = id }

  private _idAluno: any;
  get idAluno() { return this._idAluno }
  set idAluno(id) { if (id != 'undefined') this._idAluno = id }

  private _instituicao: any;
  private _periodo: any;
  private _turma: any;
  private _disciplina: any;
  private _divisao: any;

  constructor(private diarioService: DiarioService, private sessaoService: SessaoService) {
    this.backendServerURL = this.sessaoService.backendServerURL ?? '';
  }

  obterInstituicao(): Observable<any> {
    if (this._instituicao)
      return new Observable(sub => sub.next(this._instituicao));
    
    return this.diarioService.obterInstituicao(this._idInstituicao);
  }

  obterPeriodo(): Observable<any> {
    if (this._periodo)
      return new Observable(sub => sub.next(this._periodo));
    
    return this.diarioService.obterPeriodo(this._idPeriodoLetivo);
  }

  obterTurma(): Observable<any> {
    if (this._turma)
      return new Observable(sub => sub.next(this._turma));
    
    return this.diarioService.obterTurma(this._idTurma, this._idEtapa);
  }

  obterDisciplina(): Observable<any> {
    if (this._disciplina)
      return new Observable(sub => sub.next(this._disciplina));
    
    return this.diarioService.obterDisciplina(this._idInstituicao, this._idTurma, this._idDisciplina, this._idEtapa);
  }

  obterDivisao(): Observable<any> {
    if (this._divisao)
      return new Observable(sub => sub.next(this._divisao));
    
    return this.diarioService.obterDivisao(this._idInstituicao, this._idTurma, this._idDisciplina, this._idDivisao, this._idEtapa);
  }
}
