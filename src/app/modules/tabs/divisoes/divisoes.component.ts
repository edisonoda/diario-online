import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { SessaoService } from 'src/app/core/services/sessao.service';
import { TabsService } from '../tabs.service';
import { FiltrosService } from 'src/app/core/services/filtros.service';
import { DiarioService } from 'src/app/core/services/diario.service';

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
  ) {
    if (this.filtrosService.idTurma == 'undefined' || this.filtrosService.idDisciplina == 'undefined' || this.filtrosService.idEtapa == 'undefined')
      this.router.navigate(['turma']);
  }

  ngOnInit() {
    this.diarioService.obterDivisoes(this.filtrosService.idInstituicao, this.filtrosService.idTurma, this.filtrosService.idDisciplina, this.filtrosService.idEtapa).subscribe(res => {
      if (Array.isArray(res.data))
        this.tabsService.randomizarCores(res.data);
      else
        res.data = [];

      this.divisoes = res.data;

      if (this.divisoes.length === -1)
        this.divisaoClick(this.divisoes[0]);
    });
  }

  divisaoClick(divisao: any): void {

  }

  getCols(): number {
    return this.tabsService.getCols();
  }

  ngOnDestroy(): void { }
}
