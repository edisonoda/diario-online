import { ActivatedRoute } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { SessaoService } from 'src/app/core/services/sessao.service';
import { TurmasService } from './turmas.service';
@Component({
  selector: 'app-turmas',
  templateUrl: './turmas.component.html',
  styleUrls: ['./turmas.component.css'],
})
export class TurmasComponent implements OnInit, OnDestroy {
  idInstituicao: any;
  idPeriodoLetivo: any;

  instituicao: any;
  turmas: any;
  periodo: any;
  exibirCiOrientadora: any;
  exibirRegistroModulo: any;
  exibirRecupercaoParalela: any;
  validarLancamentoFrequenciaDomingo: any;

  constructor(
    private route: ActivatedRoute,
    private sessaoService: SessaoService,
    private turmasService: TurmasService,
  ) {
    this.idInstituicao = this.route.snapshot.queryParamMap.get('idInstituicao') ?? this.sessaoService.idInstituicao;
    this.idPeriodoLetivo = this.route.snapshot.queryParamMap.get('idPeriodoLetivo') ?? this.sessaoService.idPeriodoLetivo;
  }

  ngOnInit() {
    this.turmasService.obterInstituicao(this.idInstituicao).subscribe(res => {
      this.instituicao = res.data;
    });
    this.turmasService.obterTurmas(this.idInstituicao, this.idPeriodoLetivo).subscribe(res => {
      this.turmas = res.data;
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

  ngOnDestroy(): void { }

}
