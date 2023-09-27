import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { SessaoService } from 'src/app/core/services/sessao.service';
import { TabsService } from './tabs.service';
import { Subscription } from 'rxjs';
import { FiltrosService } from 'src/app/core/services/filtros.service';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { DiarioService } from 'src/app/core/services/diario.service';
import {ModalPlanoAulaComponent} from "../diario/frequencia/modal-plano-aula/modal-plano-aula.component";
import * as moment from "moment/moment";
import {MatDialog, MatDialogRef} from "@angular/material/dialog"
import {ModalPendenciaAvaliacaoComponent} from "./modal-pendencia-avaliacao/modal-pendencia-avaliacao.component";

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
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private sessaoService: SessaoService,
    private tabsService: TabsService,
    private filtrosService: FiltrosService,
    private diarioService: DiarioService,
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
    this.filtrosService.idInstituicao = this.route.snapshot.queryParamMap.get('idInstituicao') ?? this.filtrosService.idInstituicao;
    this.filtrosService.idPeriodoLetivo = this.route.snapshot.queryParamMap.get('idPeriodoLetivo') ?? this.filtrosService .idPeriodoLetivo;
    this.filtrosService.idTurma = this.route.snapshot.queryParamMap.get('turma');
    this.filtrosService.idDisciplina = this.route.snapshot.queryParamMap.get('disciplina');
    this.filtrosService.idEtapa = this.route.snapshot.queryParamMap.get('etapa');

    this.filtrosService.obterInstituicao().subscribe(res => {
      this.instituicao = res;
      this.filtrosService.instituicao = this.instituicao;
    });
    this.filtrosService.obterPeriodo().subscribe(res => {
      this.periodo = res;
      this.filtrosService.periodo = this.periodo;
    });

    if(this.filtrosService.idTurma) {
      this.filtrosService.obterTurma().subscribe(res => {
        this.breadcrumb.turma = res?.nome;
        this.filtrosService.turma = res;
      });
    }
    if(this.filtrosService.idDisciplina) {
      this.filtrosService.obterDisciplina().subscribe(res => {
        this.breadcrumb.disciplina = res?.nome;
        this.filtrosService.disciplina = res;
      });
    }
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
    let turma = this.filtrosService.turma;
    let idInstituicao = this.filtrosService.idInstituicao;
    let idDisciplina = this.filtrosService.disciplina.idItem;

    this.diarioService.obterTotalPendenciasAvaliacaoDisciplina(idInstituicao, turma.id, turma.etapa.id, idDisciplina).subscribe(res => {
      const dialogRef = this.dialog.open(ModalPendenciaAvaliacaoComponent, {
        minWidth: "600px",
        maxWidth: "1200px",
        maxHeight: "800px",
        minHeight: "400px",
        data: {
          pendencias: res,
          turma: turma
        }
      });

      // dialogRef.afterClosed().subscribe(dataAula => {
      //   this.diarioService.salvarPlanoAula(this.filtrosService.instituicao.id, dataAula.id, this.filtrosService.turma.id, this.filtrosService.disciplina.id, dataAula.conteudo, dataAula.modulo,
      //     this.filtrosService.idEtapa, dataAula.recuperacaoParalela).subscribe(res => {
      //
      //     this.snackBar.open('Diário de Conteúdo atualizado para o dia ' + moment(aula.data).format('dd/MM/yyyy') + '.', '', {
      //       duration: 5000,
      //       panelClass: ['md-success-toast-theme']
      //     });
      //   });
      // });
    });
  }

  ngOnDestroy(): void {
    //this.subs.forEach(sub => sub?.unsubscribe());
  }
}
