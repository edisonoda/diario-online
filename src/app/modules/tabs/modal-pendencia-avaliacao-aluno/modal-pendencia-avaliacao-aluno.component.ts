import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DiarioService } from 'src/app/core/services/diario.service';
import { FiltrosService } from 'src/app/core/services/filtros.service';
import {DiarioComponent} from "../../diario/diario.component";
@Component({
  selector: 'app-modal-pendencia-avaliacao-aluno',
  templateUrl: './modal-pendencia-avaliacao-aluno.component.html',
  styleUrls: ['./modal-pendencia-avaliacao-aluno.component.css'],
})
export class ModalPendenciaAvaliacaoAlunoComponent implements OnInit, OnDestroy {

  pendenciasAluno: any;
  turma:any;
  nomeAluno: any;

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ModalPendenciaAvaliacaoAlunoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private diarioService: DiarioService,
    private filtrosService: FiltrosService,
    private snackBar: MatSnackBar,
  ) {
    this.pendenciasAluno = data.pendenciasAluno[0];
    this.turma = data.turma;
    this.nomeAluno = data.aluno;
  }
  ngOnInit() {
  }

  abrirPendenciasAluno(idDivisao:any, tipoPendencia: any) {
    this.filtrosService.idDivisao = idDivisao;
    this.filtrosService.obterDivisao().subscribe(divisao => {
      if(tipoPendencia == "NOTA OU CONCEITO DO ALUNO NAO INFORMADO"){
        this.filtrosService.tipoPendencia = "A";
      } else{
        this.filtrosService.tipoPendencia = "F";
      }
      const dialogRef = this.dialog.open(DiarioComponent, {
        data: { divisao },
        maxWidth: '100%',
        maxHeight: '100%',
        height: '100%',
        width: '100%'
      });
    });
  }
  fecharJanela(): void {
    this.dialogRef.close();
  };

  ngOnDestroy(): void { }
}
