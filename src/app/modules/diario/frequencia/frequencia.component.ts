import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DiarioService } from 'src/app/core/services/diario.service';
import { FiltrosService } from 'src/app/core/services/filtros.service';
import { DialogConfirmacao } from 'src/app/shared/components/dialog-confirmacao/dialog-confirmacao.component';

@Component({
  selector: 'app-frequencia',
  templateUrl: './frequencia.component.html',
  styleUrls: ['./frequencia.component.css'],
})
export class FrequenciaComponent implements OnInit, OnDestroy {
  @Input() lista: any[] = [];
  @Input() aulas: any[] = [];

  totalAulasLancadasDiario: number = 0;
  possuiDiferencaAulasLecionadas: boolean = false;

  divisao: any;

  constructor(
    private filtrosService: FiltrosService,
    private diarioService: DiarioService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.filtrosService.obterDivisao().subscribe(divisao => {
      this.divisao = divisao;

      if (divisao.aulasPrevistas < 0)
        divisao.aulasPrevistas = 0;
    });
  }

  ngOnInit() {
  }

  aulaLancada(qtd: number): void {
    this.totalAulasLancadasDiario += qtd;
  }

  corrigirTotalAulasLancadas(ev: Event): void {
    var confirm = this.dialog.open(DialogConfirmacao, {
      data: {
        descricao: 'Deseja realmente corrigir o total de ' + this.filtrosService.divisao.aulasLecionadas + ' aula(s) lecionada(s) para ' + this.totalAulasLancadasDiario + ' aula(s) conforme os lançamentos do Diário Online?'
      }
    });

    confirm.afterClosed().subscribe(() => {
      console.log(this.filtrosService)
      this.diarioService.corrigirTotalAulasLecionadas(this.filtrosService.idInstituicao, this.filtrosService.idPeriodoLetivo, this.filtrosService.idTurma, this.filtrosService.idDisciplina,
        this.filtrosService.idDivisao, this.filtrosService.idEtapa, this.filtrosService.divisao.programacaoPedagogicaDivisao?.id,
        this.filtrosService.divisao.aulasLecionadas, this.totalAulasLancadasDiario)
        .subscribe((response) => {
          this.filtrosService.divisao.aulasLecionadas = this.totalAulasLancadasDiario;
          this.possuiDiferencaAulasLecionadas = false;

          this.snackBar.open('Total de aulas lecionadas corrigido com sucesso.', '', {
            duration: 5000,
            panelClass: ['md-success-toast-theme']
          });
        });
    });
  }

  ngOnDestroy(): void { }
}
