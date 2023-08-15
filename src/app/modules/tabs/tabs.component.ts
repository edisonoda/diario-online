import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { SessaoService } from 'src/app/core/services/sessao.service';
import { TabsService } from './tabs.service';
import { Subscription } from 'rxjs';
import { FiltrosService } from 'src/app/core/services/filtros.service';
import { MatTabChangeEvent } from '@angular/material/tabs';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.css'],
})
export class TabsComponent implements OnInit, OnDestroy {
  tabs: any = {
    turma: 0,
    disciplina: 1,
    divisao: 2,
  };
  tab: number = 0;

  instituicao: any;
  periodo: any;
  breadcrumb: any = {
    turma: null,
    disciplina: null,
    divisao: null
  };

  private subs: Subscription[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private sessaoService: SessaoService,
    private tabsService: TabsService,
    private filtrosService: FiltrosService,
  ) {
    this.subs.push(this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        const tab = this.route.snapshot.params['tab'];
        this.tab = this.tabs[tab];
        this.atualizarFiltros();

        this.resetTab(tab);
      }
    }));
  }

  ngOnInit() {
    this.subs.push(this.tabsService.selecionar$.subscribe(tab => {
      this.breadcrumb[tab.etapa] = tab.dados?.nome;
    }));
  }

  atualizarFiltros(): void {
    this.filtrosService.idInstituicao = this.route.snapshot.queryParamMap.get('idInstituicao') ?? this.sessaoService.idInstituicao;
    this.filtrosService.idPeriodoLetivo = this.route.snapshot.queryParamMap.get('idPeriodoLetivo') ?? this.sessaoService.idPeriodoLetivo;
    this.filtrosService.idTurma = this.route.snapshot.queryParamMap.get('turma');
    this.filtrosService.idDisciplina = this.route.snapshot.queryParamMap.get('disciplina');
    this.filtrosService.idEtapa = this.route.snapshot.queryParamMap.get('etapa');

    this.filtrosService.obterInstituicao().subscribe(res => {
      this.instituicao = res.data;
    });
    this.filtrosService.obterPeriodo().subscribe(res => {
      this.periodo = res.data;
    });
    this.filtrosService.obterTurma().subscribe(res => {
      this.breadcrumb.turma = res.data?.nome;
    });
    this.filtrosService.obterDisciplina().subscribe(res => {
      this.breadcrumb.disciplina = res.data?.nome;
    });
  }

  alterarTab(ev: MatTabChangeEvent): void {
    const tab = Object.entries(this.tabs).find(([tab, index]) => index === ev.index);

    if (tab && tab[0] !== this.route.snapshot.params['tab']) {
      this.resetTab(tab[0]);
      this.router.navigate([tab[0]]);
    }
  }

  resetTab(tab: string): void {
    switch(tab) {
      case "turma":
        this.breadcrumb = {
          turma: null,
          disciplina: null,
          divisao: null
        };
        break;
      case "disciplina":
        this.breadcrumb.disciplina = null;
        this.breadcrumb.divisao = null;
        break;
      default:
    }

    this.tab = this.tabs[tab];
  }

  abrirPendenciasAvaliacao(ev: Event): void {

  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub?.unsubscribe());
  }
}
