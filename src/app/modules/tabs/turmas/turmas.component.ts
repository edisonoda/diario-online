import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { TabsService } from '../tabs.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FiltrosService } from 'src/app/core/services/filtros.service';
import { DiarioService } from 'src/app/core/services/diario.service';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-turmas',
  templateUrl: './turmas.component.html',
  styleUrls: ['./turmas.component.css'],
})
export class TurmasComponent implements OnInit, OnDestroy {
  filtroControl: FormControl = new FormControl();
  idInstituicao: any;
  idPeriodoLetivo: any;
  turmas: any[] = [];
  turmasF: any[] = [];

  private subs: Subscription[] = [];

  constructor(
    private tabsService: TabsService,
    private diarioService: DiarioService,
    private snackBar: MatSnackBar,
    private filtrosService: FiltrosService,
    private activatedRoute: ActivatedRoute,

  ) {
    this.idInstituicao = this.activatedRoute.snapshot.queryParamMap.get('idInstituicao');
    this.idPeriodoLetivo = this.activatedRoute.snapshot.queryParamMap.get('idPeriodoLetivoy');
  }

  ngOnInit() {
    this.subs.push(this.filtroControl.valueChanges.subscribe(value => {
      this.turmasF = this._filter(value);
    }));
    this.diarioService.obterTurmas(this.filtrosService.idInstituicao, this.filtrosService.idPeriodoLetivo).subscribe(res => {
      if (Array.isArray(res))
        this.tabsService.randomizarCores(res);
      else
        res = [];

      this.turmas = res;
      this.turmasF = res;
    });
    console.log(this.turmas)
  }

  turmaClick(turma: any): void {
    if (turma !== undefined && turma.fechada !== undefined && !turma.fechada)
      this.snackBar.open('Por favor solicite que a secretaria da escola feche o diário. Para realizar os lançamentos nesta turma.', undefined, {
        duration: 5000,
        horizontalPosition: 'end',
        verticalPosition: 'bottom'
      });

    this.filtrosService.idTurma = turma.id;
    this.filtrosService.idEtapa = turma.etapa.id;
    this.filtrosService.turma = turma;

    this.tabsService.passarEtapa('turma', 'disciplina', turma, `turma=${turma.id}&etapa=${turma.etapa.id}`);
  }

  getCols(): number {
    return this.tabsService.getCols();
  }

  private _filter(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.turmas.filter(turma => turma?.nome?.toLowerCase().includes(filterValue));
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub?.unsubscribe());
  }
}
