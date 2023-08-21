import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { DiarioService } from '../../core/services/diario.service';
import { Subscription } from 'rxjs';
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
        this.setAbas();
      });
    }

    this.filtrosService.idDivisao = data.divisao.id;
    this.filtrosService.divisao = data.divisao;
    this.divisao = data.divisao;
  }
  
  ngOnInit() {
    this.diarioService.obterAlunos(
      this.filtrosService.idInstituicao,
      this.filtrosService.idPeriodoLetivo,
      this.filtrosService.idTurma,
      this.filtrosService.idDisciplina,
      this.filtrosService.idDivisao,
      this.filtrosService.idEtapa
    ).subscribe(res => {
      this.alunos = res.data;
      this.setFaltasAlunos();
    });
    if (this.filtrosService.divisao.tipoAvaliacao === 'F' || this.filtrosService.divisao.tipoAvaliacao === 'AF') {
      this.diarioService.obterDiasAula(
        this.filtrosService.idInstituicao,
        this.filtrosService.idTurma,
        this.filtrosService.idDisciplina,
        this.filtrosService.idDivisao,
        this.filtrosService.idEtapa
      ).subscribe(res => {
        this.aulas = res.data;
        this.totalAulasLancadasDiario = this.aulas.length;

        if (this.divisao)
          this.possuiDiferencaAulasLecionadas = this.totalAulasLancadasDiario !== this.divisao.aulasLecionadas;
      });
    }
    this.diarioService.obterAvaliacoes(
      this.filtrosService.idInstituicao,
      this.filtrosService.idTurma,
      this.filtrosService.idDisciplina,
      this.filtrosService.idDivisao,
      this.filtrosService.idEtapa
    ).subscribe(res => {
      this.avaliacoes = res.data;
    });
    this.diarioService.obterListaConceitoDisciplina(
      this.filtrosService.idInstituicao,
      this.filtrosService.idTurma,
      this.filtrosService.idDisciplina,
      this.filtrosService.idEtapa
    ).subscribe(res => {
      this.listaConceito = res.data;
    });
    this.diarioService.buscarNumeroMaxDeAulasPorDia().subscribe(res => {
      this.numeroMaxDeAulasPorDia = res.data;
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
    // desabilita lancamento de frequencia
    if (this.disciplina.computaFrequenciaGrupo) {
      this.abaAvaliacao = this.filtrosService.idDisciplina === 0;
      this.abaFrequencia = !this.abaAvaliacao;
    } else {
      this.abaAvaliacao = this.sessaoService.permissoes?.indexOf("avaliacaoFrequenciaBBean.abrir") === -1;
      this.abaFrequencia = this.sessaoService.permissoes?.indexOf("frequenciaDiariaBBean.abrir") === -1 || this.filtrosService.divisao.tipoAvaliacao === 'A';
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub?.unsubscribe());
  }
}
