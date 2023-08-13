import { ActivatedRoute } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { SessaoService } from 'src/app/core/services/sessao.service';
import { TurmasService } from './turmas.service';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-turmas',
  templateUrl: './turmas.component.html',
  styleUrls: ['./turmas.component.css'],
})
export class TurmasComponent implements OnInit, OnDestroy {
  idInstituicao: any;
  idPeriodoLetivo: any;

  filtroControl: FormControl = new FormControl();
  turmas: any[] = [];
  turmasF: any[] = [];

  instituicao: any;
  periodo: any;
  exibirCiOrientadora: any;
  exibirRegistroModulo: any;
  exibirRecupercaoParalela: any;
  validarLancamentoFrequenciaDomingo: any;

  private subs: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private sessaoService: SessaoService,
    private turmasService: TurmasService,
  ) {
    this.idInstituicao = this.route.snapshot.queryParamMap.get('idInstituicao') ?? this.sessaoService.idInstituicao;
    this.idPeriodoLetivo = this.route.snapshot.queryParamMap.get('idPeriodoLetivo') ?? this.sessaoService.idPeriodoLetivo;
  }

  ngOnInit() {
    this.subs.push(this.filtroControl.valueChanges.subscribe(value => {
      this.turmasF = this._filter(value);
    }));

    this.turmasService.obterInstituicao(this.idInstituicao).subscribe(res => {
      this.instituicao = res.data;
    });
    this.turmasService.obterTurmas(this.idInstituicao, this.idPeriodoLetivo).subscribe(res => {
      this.turmas = res.data;
      this.turmasF = res.data;
    });
    this.turmasService.obterPeriodo(this.idPeriodoLetivo).subscribe(res => {
      this.periodo = res.data;
    });
    this.turmasService.deveExibirCiOrientadora(this.idInstituicao).subscribe(res => {
      this.exibirCiOrientadora = res.data;
    });
    this.turmasService.deveExibirRegistroModulo(this.idInstituicao).subscribe(res => {
      this.exibirRegistroModulo = res.data;
    });
    this.turmasService.deveExibirRecuperacaoParalela(this.idInstituicao).subscribe(res => {
      this.exibirRecupercaoParalela = res.data;
    });
    this.turmasService.deveValidarLancamentoFrequenciaDomingo(this.idInstituicao).subscribe(res => {
      this.validarLancamentoFrequenciaDomingo = res.data;
    });
  }

  turmaClick(turma: any): void {

  }

  overFooter(e: Event): void {}
  outFooter(e: Event): void {}

  getCols(): number {
    const width = window.innerWidth;

    if (width < 576)
      return 1;
    else if (width < 768)
      return 3;
    else if (width < 992)
      return 4;
    else
      return 6;
  }

  private _filter(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.turmas.filter(option => option.toLowerCase().includes(filterValue));
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub?.unsubscribe());
  }

}
