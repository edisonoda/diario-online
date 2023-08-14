import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { SessaoService } from 'src/app/core/services/sessao.service';
import { DiarioService } from '../../../core/services/diario.service';

@Component({
  selector: 'app-avaliacoes',
  templateUrl: './avaliacoes.component.html',
  styleUrls: ['./avaliacoes.component.css'],
})
export class AvaliacoesComponent implements OnInit, OnDestroy {

  constructor(
    private route: ActivatedRoute,
    private sessaoService: SessaoService,
    private diarioService: DiarioService,
    private router: Router
  ) {
  }

  ngOnInit() {
  }

  ngOnDestroy(): void { }
}
