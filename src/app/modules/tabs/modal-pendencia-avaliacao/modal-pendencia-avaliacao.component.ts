import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DiarioService } from 'src/app/core/services/diario.service';
import { FiltrosService } from 'src/app/core/services/filtros.service';
import {ModalPendenciaAvaliacaoAlunoComponent} from '../modal-pendencia-avaliacao-aluno/modal-pendencia-avaliacao-aluno.component';

@Component({
  selector: 'app-modal-pendencia-avaliacao',
  templateUrl: './modal-pendencia-avaliacao.component.html',
  styleUrls: ['./modal-pendencia-avaliacao.component.css'],
})
export class ModalPendenciaAvaliacaoComponent implements OnInit, OnDestroy {

  pendencias: any;
  pendenciasDetalhe: any;
  alunoId:any;
  turma:any;
  abrirAluno:boolean = false;

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ModalPendenciaAvaliacaoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private diarioService: DiarioService,
    private filtrosService: FiltrosService,
    private snackBar: MatSnackBar,
  ) {
    this.pendencias = data.pendencias;
    this.turma = data.turma;
    this.pendenciasDetalhe = {};
  }

  ngOnInit() {
    this.abrirAluno=false;
    this.alunoId = 0;
  }

  carregarPendencias(idAluno:any, nomeAluno:any) {
    let idInstituicao = this.filtrosService.idInstituicao;
    let turma = this.filtrosService.turma;
    let idDisciplina = this.filtrosService.disciplina.idItem;
    this.alunoId = idAluno;
    this.diarioService.obterPendenciasAvaliacaoDisciplina(idInstituicao, turma.id, turma.etapa.id, idDisciplina, idAluno).subscribe(res => {
      this.abrirAluno = true;
      this.pendenciasDetalhe = res;
      const dialogRef = this.dialog.open(ModalPendenciaAvaliacaoAlunoComponent, {
        minWidth: "600px",
        maxWidth: "1200px",
        maxHeight: "800px",
        minHeight: "400px",
        data: {
          pendenciasAluno: res,
          turma: turma,
          aluno: nomeAluno
        }
      });
    })
  }

  fecharJanela(): void {
    this.dialogRef.close();
  };

  ngOnDestroy(): void { }
}
