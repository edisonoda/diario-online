import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { SessaoService } from 'src/app/core/services/sessao.service';
import { TabsService } from '../tabs.service';

@Component({
  selector: 'app-divisoes',
  templateUrl: './divisoes.component.html',
  styleUrls: ['./divisoes.component.css'],
})
export class DivisoesComponent implements OnInit, OnDestroy {
  idInstituicao: any;
  idTurma: any;
  idDisciplina: any;
  idEtapa: any;

  divisoes: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private sessaoService: SessaoService,
    private tabsService: TabsService,
    private router: Router
  ) {
    this.idInstituicao = this.route.snapshot.queryParamMap.get('idInstituicao') ?? this.sessaoService.idInstituicao;
    this.idTurma = this.route.snapshot.queryParamMap.get('turma');
    this.idDisciplina = this.route.snapshot.queryParamMap.get('disciplina');
    this.idEtapa = this.route.snapshot.queryParamMap.get('etapa');

    if (this.idTurma == 'undefined' || this.idDisciplina == 'undefined' || this.idEtapa == 'undefined')
      this.router.navigate(['turma']);
  }

  ngOnInit() {
    this.tabsService.obterDivisoes(this.idInstituicao, this.idTurma, this.idDisciplina, this.idEtapa).subscribe(res => {
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
