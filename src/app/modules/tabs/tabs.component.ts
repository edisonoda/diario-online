import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SessaoService } from 'src/app/core/services/sessao.service';
import { TabsService } from './tabs.service';
import { Subscription } from 'rxjs';

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

  idInstituicao: any;
  idPeriodoLetivo: any;
  idTurma: any;
  idDisciplina: any;
  idEtapa: any;

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
  ) {
    this.idInstituicao = this.route.snapshot.queryParamMap.get('idInstituicao') ?? this.sessaoService.idInstituicao;
    this.idPeriodoLetivo = this.route.snapshot.queryParamMap.get('idPeriodoLetivo') ?? this.sessaoService.idPeriodoLetivo;
    this.idTurma = this.route.snapshot.queryParamMap.get('turma');
    this.idDisciplina = this.route.snapshot.queryParamMap.get('disciplina');
    this.idEtapa = this.route.snapshot.queryParamMap.get('etapa');
  }

  ngOnInit() {
    this.tabsService.obterInstituicao(this.idInstituicao).subscribe(res => {
      this.instituicao = res.data;
    });
    this.tabsService.obterPeriodo(this.idPeriodoLetivo).subscribe(res => {
      this.periodo = res.data;
    });

    if (this.idTurma != undefined && this.idEtapa != undefined) {
      this.tabsService.obterTurma(this.idTurma, this.idEtapa).subscribe(res => {
        this.breadcrumb.turma = res.nome;
      });

      if (this.idDisciplina != undefined)
        this.tabsService.obterDisciplina(this.idInstituicao, this.idTurma, this.idDisciplina, this.idEtapa).subscribe(res => {
          this.breadcrumb.disciplina = res.nome;
        });
    }

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
