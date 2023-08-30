import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { DiarioService } from '../../core/services/diario.service';
import { Observable, Subscription, forkJoin, merge, of } from 'rxjs';
import { FiltrosService } from 'src/app/core/services/filtros.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SessaoService } from 'src/app/core/services/sessao.service';

@Component({
  selector: 'app-diario',
  templateUrl: './diario.component.html',
  styleUrls: ['./diario.component.css'],
})
export class DiarioComponent implements OnInit, OnDestroy {
  tabSelecionada: number = 0;

  abaAvaliacao: boolean = false;
  abaFrequencia: boolean = false;
  avaliacaoReady: boolean = false;
  frequenciaReady: boolean = false;

  instituicao: any;
  periodo: any;
  turma: any;
  disciplina: any;
  divisao: any;

  alunos: any[] = [];
  aulas: any[] = [];
  avaliacoes: any[] = [];
  listaConceito: any[] = [];
  numeroMaxDeAulasPorDia: number = 0;

  totalAulasLancadasDiario: number = 0;
  possuiDiferencaAulasLecionadas: boolean = false;

  permissoes: string = '';

  private subs: Subscription[] = [];

  constructor(
    public dialogRef: MatDialogRef<DiarioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private diarioService: DiarioService,
    private filtrosService: FiltrosService,
    private sessaoService: SessaoService,
  ) {
    this.filtrosService.obterInstituicao().subscribe(instituicao => {
      this.instituicao = instituicao;
    });
    this.filtrosService.obterPeriodo().subscribe(periodo => {
      this.periodo = periodo;
    });
    if (this.filtrosService.idInstituicao) {
      this.filtrosService.obterTurma().subscribe(turma => {
        this.turma = turma;
      });
    }
    if (this.filtrosService.idDisciplina) {
      this.filtrosService.obterDisciplina().subscribe(disciplina => {
        this.disciplina = disciplina;
        this.setDivisao();
        this.buscarDados();
        this.setAbas();
      });
    }
  }

  ngOnInit() { }

  setDivisao(): void {
    this.filtrosService.idDivisao = this.data.divisao.id;
    this.filtrosService.divisao = this.data.divisao;
    this.divisao = this.data.divisao;
  }

  buscarDados(): void {
    const $alunos = this.diarioService.obterAlunos(
      this.filtrosService.idInstituicao,
      this.filtrosService.idPeriodoLetivo,
      this.filtrosService.idTurma,
      this.filtrosService.idDisciplina,
      this.filtrosService.idDivisao,
      this.filtrosService.idEtapa
    );
    const $aulas = this.divisao.tipoAvaliacao === 'F' || this.divisao.tipoAvaliacao === 'AF' ?
      this.diarioService.obterDiasAula(
        this.filtrosService.idInstituicao,
        this.filtrosService.idTurma,
        this.filtrosService.idDisciplina,
        this.filtrosService.idDivisao,
        this.filtrosService.idEtapa
      ) : of([]);

    forkJoin([$alunos, $aulas]).subscribe(([resAlunos, resAulas]) => {
      console.log(resAlunos)
      this.alunos = resAlunos;
      this.setFaltasAlunos();

      console.log(resAulas)
      this.aulas = resAulas;
      this.totalAulasLancadasDiario = this.aulas.length;

      if (this.divisao)
        this.possuiDiferencaAulasLecionadas = this.totalAulasLancadasDiario !== this.divisao.aulasLecionadas;
    });

    forkJoin([$alunos, $aulas]).subscribe(([resAlunos, resAulas]) => {
      this.frequenciaReady = true;

      console.log(resAlunos)
      this.alunos = resAlunos;
      this.setFaltasAlunos();

      console.log(resAulas)
      this.aulas = resAulas;
      this.totalAulasLancadasDiario = this.aulas.length;

      if (this.divisao)
        this.possuiDiferencaAulasLecionadas = this.totalAulasLancadasDiario !== this.divisao.aulasLecionadas;
    });

    const $avaliacoes = this.diarioService.obterAvaliacoes(
      this.filtrosService.idInstituicao,
      this.filtrosService.idTurma,
      this.filtrosService.idDisciplina,
      this.filtrosService.idDivisao,
      this.filtrosService.idEtapa
    );
    const $conceitos = this.diarioService.obterListaConceitoDisciplina(
      this.filtrosService.idInstituicao,
      this.filtrosService.idTurma,
      this.filtrosService.idDisciplina,
      this.filtrosService.idEtapa
    );
    const $maxAulas = this.diarioService.buscarNumeroMaxDeAulasPorDia();

    forkJoin([$avaliacoes, $conceitos, $maxAulas]).subscribe(([resAval, resConceitos, resMax]) => {
      this.avaliacaoReady = true;
      
      this.avaliacoes = resAval;
      this.listaConceito = resConceitos;
      this.numeroMaxDeAulasPorDia = resMax;
    });
  }

  setFaltasAlunos(): void {
    // Registra das faltas salvas quantas estão lançadas no diário
    this.alunos.forEach(aluno => {
      if (this.filtrosService.idAluno && this.filtrosService.idAluno == aluno.id)
        aluno.resolverPendencia = true;

      if (aluno.frequencia && aluno.frequencia.length > 0) {
        var faltasPorDia = aluno.frequencia.map((alunoFrequencia: any) => {
          return alunoFrequencia.flPresente === false ? 1 : 0;
        });

        aluno.qtdFaltasDiario = faltasPorDia.reduce((a: number, b: number) => {
          return a + b;
        });
      } else {
        aluno.qtdFaltasDiario = 0;
      }

      aluno.qtdDifRestDiario = function () {
        return aluno.qtdFaltasVeioRest - aluno.qtdFaltasDiario;
      };

      aluno.modificaTotalFaltas = aluno.qtdFaltasVeioRest === aluno.qtdFaltasDiario;

      aluno.qtdFaltasVeioRest = aluno.qtdFaltas;
    });
  }

  setAbas(): void {
    if (this.sessaoService.permissoes) {
      this.permissoes = this.sessaoService.permissoes;
      this.abaFrequencia = this.permissoes.indexOf('frequenciaDiariaBBean.abrir') === -1;
      this.abaAvaliacao = this.permissoes.indexOf('avaliacaoFrequenciaBBean.abrir') === -1;
      
      if (this.divisao.tipoAvaliacao === 'A')
        this.abaFrequencia = true;
    }
    
    // desabilita lancamento de frequencia
    if (this.disciplina.computaFrequenciaGrupo) {
      this.abaAvaliacao = this.filtrosService.idDisciplina === 0;
      this.abaFrequencia = !this.abaAvaliacao;
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub?.unsubscribe());
  }
}
