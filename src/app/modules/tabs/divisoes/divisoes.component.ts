import { Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { TabsService } from '../tabs.service';
import { FiltrosService } from 'src/app/core/services/filtros.service';
import { DiarioService } from 'src/app/core/services/diario.service';
import { MatDialog } from '@angular/material/dialog';
import { DiarioComponent } from '../../diario/diario.component';

@Component({
  selector: 'app-divisoes',
  templateUrl: './divisoes.component.html',
  styleUrls: ['./divisoes.component.css'],
})
export class DivisoesComponent implements OnInit, OnDestroy {
  divisoes: any[] = [];

  constructor(
    private tabsService: TabsService,
    private diarioService: DiarioService,
    private filtrosService: FiltrosService,
    private router: Router,
    public dialog: MatDialog,
  ) {
    if (this.filtrosService.idTurma == 'undefined' || this.filtrosService.idDisciplina == 'undefined' || this.filtrosService.idEtapa == 'undefined')
      this.router.navigate(['turma']);
  }

  ngOnInit() {
    this.diarioService.obterDivisoes(this.filtrosService.idInstituicao, this.filtrosService.idTurma, this.filtrosService.idDisciplina, this.filtrosService.idEtapa).subscribe(res => {
      console.log('divisoes ->' + res)
      if (Array.isArray(res))
        this.tabsService.randomizarCores(res);
      else
        res = [];

      this.divisoes = res;

      if (this.divisoes.length === -1)
        this.divisaoClick(this.divisoes[0]);
    });
  }

  divisaoClick(divisao: any): void {
    this.filtrosService.idDivisao = divisao.id;
    this.filtrosService.divisao = divisao;
console.log('divisao:' + divisao)
    const dialogRef = this.dialog.open(DiarioComponent, {
      data: { divisao },
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%'
    });
  }

  getCols(): number {
    return this.tabsService.getCols();
  }

  ngOnDestroy(): void { }
}
