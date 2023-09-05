import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DiarioService } from 'src/app/core/services/diario.service';
import { FiltrosService } from 'src/app/core/services/filtros.service';

@Component({
  selector: 'app-modal-plano-aula',
  templateUrl: './modal-plano-aula.component.html',
  styleUrls: ['./modal-plano-aula.component.css'],
})
export class ModalPlanoAulaComponent implements OnInit, OnDestroy {

  aula: any;

  deveExibirCiOrientadora: any;
  deveExibirRegistroModulo: any;
  deveExibirRecuperacaoParalela: any;

  constructor(
    public dialogRef: MatDialogRef<ModalPlanoAulaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private diarioService: DiarioService,
    private filtrosService: FiltrosService,
    private snackBar: MatSnackBar,
  ) {
    this.aula = data.aula;
  }

  ngOnInit() {
    this.diarioService.deveExibirCiOrientadora(this.filtrosService.idInstituicao).subscribe(res => {
      this.deveExibirCiOrientadora = res;
    });
    this.diarioService.deveExibirRegistroModulo(this.filtrosService.idInstituicao).subscribe(res => {
      this.deveExibirRegistroModulo = res;
    });
    this.diarioService.deveExibirRecuperacaoParalela(this.filtrosService.idInstituicao).subscribe(res => {
      this.deveExibirRecuperacaoParalela = res;
    });
  }

  salvarAula(): void {
    if (!this.aula?.conteudo) {
        this.snackBar.open('O Conteúdo obrigatóriamente deve ser informado.', '', {
          duration: 5000,
          panelClass: ['md-error-toast-theme']
        });
        return;
    }

    this.dialogRef.close(this.aula);
  }

  fecharJanela(): void {
    this.dialogRef.close();
  };

  ngOnDestroy(): void { }
}
