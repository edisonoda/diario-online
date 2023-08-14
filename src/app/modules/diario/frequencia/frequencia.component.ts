import { Component, OnDestroy, OnInit } from '@angular/core';
import { FiltrosService } from 'src/app/core/services/filtros.service';

@Component({
  selector: 'app-frequencia',
  templateUrl: './frequencia.component.html',
  styleUrls: ['./frequencia.component.css'],
})
export class FrequenciaComponent implements OnInit, OnDestroy {
  divisao: any;

  constructor(
    private filtrosService: FiltrosService,
  ) {
    this.filtrosService.obterDivisao().subscribe(divisao => {
      this.divisao = divisao;

      if (divisao.aulasPrevistas < 0)
        divisao.aulasPrevistas = 0;
    });
  }

  ngOnInit() {
  }

  corrigirTotalAulasLancadas(ev: Event): void {

  }

  ngOnDestroy(): void { }
}
