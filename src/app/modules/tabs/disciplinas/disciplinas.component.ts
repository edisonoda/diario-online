import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { SessaoService } from 'src/app/core/services/sessao.service';
import { TabsService } from '../tabs.service';

@Component({
  selector: 'app-disciplinas',
  templateUrl: './disciplinas.component.html',
  styleUrls: ['./disciplinas.component.css'],
})
export class DisciplinasComponent implements OnInit, OnDestroy {
  idInstituicao: any;
  idPeriodoLetivo: any;
  idTurma: any;
  idEtapa: any;

  disciplinas: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private sessaoService: SessaoService,
    private tabsService: TabsService,
    private router: Router
  ) {
    this.idInstituicao = this.route.snapshot.queryParamMap.get('idInstituicao') ?? this.sessaoService.idInstituicao;
    this.idPeriodoLetivo = this.route.snapshot.queryParamMap.get('idPeriodoLetivo') ?? this.sessaoService.idPeriodoLetivo;
    this.idTurma = this.route.snapshot.queryParamMap.get('turma');
    this.idEtapa = this.route.snapshot.queryParamMap.get('etapa');

    if (!this.idTurma)
      this.router.navigate(['turma']);
  }

  ngOnInit() {
    this.tabsService.obterDisciplinas(this.idInstituicao, this.idTurma, this.idEtapa).subscribe(res => {
      if (res.error)
        return;

      if (Array.isArray(res.data))
        this.tabsService.randomizarCores(res.data);
      else
        res.data = [];

      this.disciplinas = res.data;

      if (this.disciplinas.length === -1)
        this.disciplinaClick(this.disciplinas[0]);
    });
  }

  disciplinaClick(disciplina: any): void {
    this.tabsService.passarEtapa('disciplina', 'divisao', disciplina, `turma=${this.idTurma}&etapa=${this.idEtapa}&disciplina=${disciplina.id}`);
  }

  getCols(): number {
    return this.tabsService.getCols();
  }

  ngOnDestroy(): void { }
}
