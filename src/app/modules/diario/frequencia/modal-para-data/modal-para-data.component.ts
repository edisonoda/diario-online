import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
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
    if (this.dataSelecionada == undefined || !this.dataSelecionada) {
      this.snackBar.open('A data deve ser informada.', '', {
        duration: 5000
      });
      this.dataValida = false;
      return;
    }

    if (Object.prototype.toString.call(this.dataSelecionada) === "[object Date]") {
      if (isNaN(this.dataSelecionada.getTime())) {
        this.snackBar.open('A data informada não é valida.', '', {
          duration: 5000
        });
        this.dataValida = false;
      }
      else {
        if (!this.filtroDatasDisponiveis(this.dataSelecionada)) {
          this.snackBar.open('Não existem aulas lecionadas na data informada.', '', {
            duration: 5000
          });
        } else {
          this.dialogRef.close(this.dataSelecionada);
        }
      }
    } else {
      this.snackBar.open('A data informada não é valida.', '', {
        duration: 5000
      });
    }
  };

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
