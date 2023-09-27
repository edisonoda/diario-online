import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { DiarioService } from '../../core/services/diario.service';
import { Subscription, forkJoin, of } from 'rxjs';
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

  abaAvaliacao: boolean = true;
  abaFrequencia: boolean = true;

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

  alunosReady: boolean = false;
  aulasReady: boolean = false;
  avaliacoesReady: boolean = false;
  listaConceitoReady: boolean = false;
  numeroMaxDeAulasPorDiaReady: boolean = false;

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

    if (this.filtrosService.idDisciplina != undefined) {
      this.filtrosService.obterDisciplina().subscribe(disciplina => {
        this.disciplina = disciplina;
        this.setDivisao();
        this.buscarDados();
        this.setAbas();
      });
    }
    if (this.filtrosService.idDisciplina == 0) {
      this.abaAvaliacao = false;
    }
    // if(this.filtrosService.idDisciplina > 0) {
    //   if(this.filtrosService.disciplina.frequenciaDiaria == false) {
    //     this.abaFrequencia = false;
    //   }
    // }
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
    if (this.filtrosService.idDisciplina != undefined) {
      this.filtrosService.obterDisciplina().subscribe(disciplina => {
        this.disciplina = disciplina;
        this.setDivisao();
        this.buscarDados();
        this.setAbas();
      });
    }
  }

  ngOnInit() {
    if (this.filtrosService.idDisciplina == 0) {
      this.abaAvaliacao = false;
    }
    // if(this.filtrosService.idDisciplina > 0) {
    //   if(this.filtrosService.disciplina.frequenciaDiaria == false) {
    //     this.abaFrequencia = false;
    //   }
    // }
  }

  setDivisao(): void {
    this.filtrosService.idDivisao = this.data.divisao.id;
    this.filtrosService.divisao = this.data.divisao;
    this.divisao = this.data.divisao;
  }

  buscarDados(): void {
    this.diarioService.obterAlunos(
      this.filtrosService.idInstituicao,
      this.filtrosService.idPeriodoLetivo,
      this.filtrosService.idTurma,
      this.filtrosService.idDisciplina,
      this.filtrosService.idDivisao,
      this.filtrosService.idEtapa
    ).subscribe(res => {
      this.alunosReady = true;
      this.alunos = res;
      if(this.abaFrequencia == true) {
        this.setFaltasAlunos();
      }
    });

    if (this.filtrosService.idDisciplina) {
      this.diarioService.obterDiasAula(
        this.filtrosService.idInstituicao,
        this.filtrosService.idTurma,
        this.filtrosService.idDisciplina,
        this.filtrosService.idDivisao,
        this.filtrosService.idEtapa
      ).subscribe(res => {
        this.aulasReady = true;
        this.aulas = res;
        this.totalAulasLancadasDiario = this.aulas.length;

        if (this.divisao)
          this.possuiDiferencaAulasLecionadas = this.totalAulasLancadasDiario !== this.divisao.aulasLecionadas;
      });
    } else {
      this.aulasReady = false;
    }

    if(this.abaAvaliacao == true) {
      this.diarioService.obterAvaliacoes(
        this.filtrosService.idInstituicao,
        this.filtrosService.idTurma,
        this.filtrosService.idDisciplina,
        this.filtrosService.idDivisao,
        this.filtrosService.idEtapa
      ).subscribe(res => {
        this.avaliacoesReady = true;
        this.avaliacoes = res;
      });
      this.diarioService.obterListaConceitoDisciplina(
        this.filtrosService.idInstituicao,
        this.filtrosService.idTurma,
        this.filtrosService.idDisciplina,
        this.filtrosService.idEtapa
      ).subscribe(res => {
        this.listaConceitoReady = true;
        this.listaConceito = res;
      });
    }
    this.diarioService.buscarNumeroMaxDeAulasPorDia().subscribe(res => {
      this.numeroMaxDeAulasPorDiaReady = true;
      this.numeroMaxDeAulasPorDia = res;
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
      //this.abaFrequencia = this.permissoes.indexOf('frequenciaDiariaBBean.abrir') > -1;
      //this.abaAvaliacao = this.permissoes.indexOf('avaliacaoFrequenciaBBean.abrir') > -1;
    }

    // desabilita lancamento de frequencia
    // if (this.disciplina.computaFrequenciaGrupo) {
    //   this.abaAvaliacao = this.filtrosService.idDisciplina > 0;
    //   this.abaFrequencia = !this.abaAvaliacao;
    // }

    this.tabSelecionada = this.abaFrequencia ? 0 : 1;
    if(this.filtrosService.tipoPendencia != undefined) {
      if(this.filtrosService.tipoPendencia == "F" || this.filtrosService.tipoPendencia == "AF") {
        this.tabSelecionada = 0;
      }
      if(this.filtrosService.tipoPendencia == "A") {
        this.tabSelecionada = 1;;
      }
    }
  }

  frequenciaReady(): boolean {
    return this.alunosReady && this.aulasReady;
  }

  avaliacaoReady(): boolean {
    return this.avaliacoesReady && this.listaConceitoReady && this.numeroMaxDeAulasPorDiaReady;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub?.unsubscribe());
  }
}
