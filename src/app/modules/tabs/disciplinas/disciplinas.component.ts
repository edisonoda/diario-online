import { Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { TabsService } from '../tabs.service';
import { FiltrosService } from 'src/app/core/services/filtros.service';
import { DiarioService } from 'src/app/core/services/diario.service';

@Component({
  selector: 'app-disciplinas',
  templateUrl: './disciplinas.component.html',
  styleUrls: ['./disciplinas.component.css'],
})
export class DisciplinasComponent implements OnInit, OnDestroy {
  disciplinas: any[] = [];

  constructor(
    private tabsService: TabsService,
    private diarioService: DiarioService,
    private filtrosService: FiltrosService,
    private router: Router,
  ) {
    if (this.filtrosService.idTurma == 'undefined' || this.filtrosService.idEtapa == 'undefined')
      this.router.navigate(['turma']);
  }

  ngOnInit() {
    this.diarioService.obterDisciplinas(this.filtrosService.idInstituicao, this.filtrosService.idTurma, this.filtrosService.idEtapa).subscribe(res => {
      if (res.error)
        return;

      if (Array.isArray(res))
        this.tabsService.randomizarCores(res);
      else
        res = [];

      this.disciplinas = res;

      if (this.disciplinas.length === -1)
        this.disciplinaClick(this.disciplinas[0]);
    });
  }

  disciplinaClick(disciplina: any): void {
    this.filtrosService.idDisciplina = disciplina.id;
    this.filtrosService.disciplina = disciplina;
    this.tabsService.passarEtapa('disciplina', 'divisao', disciplina, `turma=${this.filtrosService.idTurma}&etapa=${this.filtrosService.idEtapa}&disciplina=${disciplina.id}`);
  }

  getCols(): number {
    return this.tabsService.getCols();
  }

  ngOnDestroy(): void { }
}
