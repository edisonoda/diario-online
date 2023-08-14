import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SessaoService } from 'src/app/core/services/sessao.service';
import { TabsService } from './tabs.service';
import { Subscription } from 'rxjs';
import { FiltrosService } from 'src/app/core/services/filtros.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.css'],
})
export class TabsComponent implements OnInit, OnDestroy {
  navLinks = [
    { link: 'turma', label: '1 - Turma' },
    { link: 'disciplina', label: '2 - Disciplina' },
    { link: 'divisao', label: '3 - Divisão' }
  ];

  instituicao: any;
  periodo: any;
  breadcrumb: any = {
    turma: null,
    disciplina: null,
    divisao: null
  };

  private subs: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private sessaoService: SessaoService,
    private tabsService: TabsService,
    private filtrosService: FiltrosService,
  ) {
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

  ngOnInit() {
    this.subs.push(this.tabsService.selecionar$.subscribe(tab => {
      this.breadcrumb[tab.etapa] = tab.dados?.nome;
    }));
  }

  resetTab(tab: string): void {
    switch(tab) {
      case "disciplina":
        this.breadcrumb.disciplina = null;
        this.breadcrumb.divisao = null;
        break;
      default:
        this.breadcrumb = {
          turma: null,
          disciplina: null,
          divisao: null
        };
    }
  }

  abrirPendenciasAvaliacao(ev: Event): void {

  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub?.unsubscribe());
  }
}
