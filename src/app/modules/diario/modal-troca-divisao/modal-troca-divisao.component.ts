import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FiltrosService } from 'src/app/core/services/filtros.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DiarioService } from 'src/app/core/services/diario.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-modal-troca-divisao',
  templateUrl: './modal-troca-divisao.component.html',
  styleUrls: ['./modal-troca-divisao.component.css'],
})
export class ModalTrocaDivisaoComponent implements OnInit, OnDestroy {

  listaDivisoes: any[] = [];
  divisao: FormControl = new FormControl();

  constructor(
    public dialogRef: MatDialogRef<ModalTrocaDivisaoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private diarioService: DiarioService,
    private filtrosService: FiltrosService,
  ) {
    this.divisao.setValue(data.divisao);
  }

  ngOnInit() {
    this.diarioService.obterDivisoes(
      this.filtrosService.idInstituicao,
      this.filtrosService.idTurma,
      this.filtrosService.idDisciplina,
      this.filtrosService.idEtapa,
    ).subscribe(res => {
      this.listaDivisoes = res.data;
    });
  }

  trocarDivisao(): void {
    this.filtrosService.divisao = this.divisao;
    this.dialogRef.close(this.divisao);
  };

  fecharJanela(): void {
    this.dialogRef.close();
  };

  ngOnDestroy(): void { }
}
