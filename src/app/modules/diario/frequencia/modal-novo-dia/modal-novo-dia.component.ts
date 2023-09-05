import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from 'moment';
import { DiarioService } from 'src/app/core/services/diario.service';
import { FiltrosService } from 'src/app/core/services/filtros.service';

@Component({
  selector: 'app-modal-novo-dia',
  templateUrl: './modal-novo-dia.component.html',
  styleUrls: ['./modal-novo-dia.component.css'],
})
export class ModalNovoDiaComponent implements OnInit, OnDestroy {

  dataAula: Date = new Date();
  data: moment.Moment = moment();

  periodo: any;

  dataValida: boolean = false;
  deveValidarLancamentoFrequenciaDomingo: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<ModalNovoDiaComponent>,
    @Inject(MAT_DIALOG_DATA) public dados: any,
    private diarioService: DiarioService,
    private filtrosService: FiltrosService,
    private snackBar: MatSnackBar,
  ) {
    this.data.set('hour', 0);
    this.data.set('minute', 0);
    this.data.set('second', 0);
    this.data.set('millisecond', 0);

    this.dataAula = this.data.toDate();
  }

  ngOnInit() {
    this.filtrosService.obterPeriodo().subscribe(res => {
      this.periodo = res;
    });

    // this.diarioService.deveValidarLancamentoFrequenciaDomingo(this.filtrosService.idInstituicao).subscribe(res => {
    //   this.deveValidarLancamentoFrequenciaDomingo = res.data;
    // }
    this.deveValidarLancamentoFrequenciaDomingo = false;
  }

  salvarAula(): void {
    if (!this.dataAula) {
      this.snackBar.open('A data deve ser informada.', '', {
        duration: 5000,
        panelClass: ['md-error-toast-theme']
      });
      return;
    }

    if (this.dataAula > new Date()) {
      this.snackBar.open('A data informada não pode ser futura.', '', {
        duration: 5000,
        panelClass: ['md-error-toast-theme']
      });
      return;
    }

    if (this.dataAula.getDay() == 0 && this.deveValidarLancamentoFrequenciaDomingo) {
      this.snackBar.open('Selecione uma data diferente de domingo.', '', {
        duration: 5000,
        panelClass: ['md-error-toast-theme']
      });
      return;
    }

    var dataInicioPeriodoLetivo = moment(this.periodo.dataInicio, 'YYYY-MM-DD', true).toDate();
    var dataFimPeriodoLetivo = moment(this.periodo.dataFim, 'YYYY-MM-DD', true).toDate();

    if (this.dataAula < dataInicioPeriodoLetivo || this.dataAula > dataFimPeriodoLetivo) {
      this.snackBar.open('A data da aula deve estar entre as datas do período letivo (' + moment(dataInicioPeriodoLetivo).format('dd/MM/yyyy') + ' a ' + moment(dataFimPeriodoLetivo).format('dd/MM/yyyy') + ').', '', {
        duration: 5000,
        panelClass: ['md-error-toast-theme']
      });
      return;
    }

    this.dialogRef.close(this.dataAula.getTime());
  };

  fecharJanela(): void {
    this.dialogRef.close();
  };

  ngOnDestroy(): void { }
}
