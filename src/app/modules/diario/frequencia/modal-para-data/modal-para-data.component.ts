import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from 'moment';

@Component({
  selector: 'app-modal-para-data',
  templateUrl: './modal-para-data.component.html',
  styleUrls: ['./modal-para-data.component.css'],
})
export class ModalParaDataComponent implements OnInit, OnDestroy {

  listaDias: any[] = [];
  dataSelecionada: Date = new Date();

  dataValida: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<ModalParaDataComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit() { }

  irParaData(): void {
    this.dialogRef.close(this.dataSelecionada);
  };

  verificarData(event: MatDatepickerInputEvent<Date>): void {
    if (event.value == undefined || !event.value) {
      this.snackBar.open('A data deve ser informada.', '', {
        duration: 5000,
        panelClass: ['md-error-toast-theme']
      });
      this.dataValida = false;
      return;
    }

    if (Object.prototype.toString.call(event.value) === "[object Date]") {
      if (isNaN(event.value.getTime())) {
        this.snackBar.open('A data informada não é valida.', '', {
          duration: 5000,
          panelClass: ['md-error-toast-theme']
        });
        this.dataValida = false;
      }
      else {
        if (!this.filtroDatasDisponiveis(event.value)) {
          this.snackBar.open('Não existem aulas lecionadas na data informada.', '', {
            duration: 5000,
            panelClass: ['md-error-toast-theme']
          });
        } else {
          this.dataSelecionada = event.value;
          this.dataValida = true;
        }
      }
    } else {
      this.snackBar.open('A data informada não é valida.', '', {
        duration: 5000,
        panelClass: ['md-error-toast-theme']
      });
      this.dataValida = false;
    }
  }

  filtroDatasDisponiveis(date: Date): boolean {
    return this.listaDias.some(function (aulaDia, index, _ary) {
      var aulaMoment = moment(aulaDia, 'YYYY-MM-DD', true);
      return aulaMoment.isSame(date, 'day') && aulaMoment.isSame(date, 'month') && aulaMoment.isSame(date, 'year');
    });
  };

  fecharJanela(): void {
    this.dialogRef.close();
  };

  ngOnDestroy(): void { }
}
