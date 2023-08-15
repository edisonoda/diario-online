import { ActivatedRoute, Router } from '@angular/router';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { SessaoService } from 'src/app/core/services/sessao.service';
import { DiarioService } from '../../../core/services/diario.service';

@Component({
  selector: 'app-avaliacoes',
  templateUrl: './avaliacoes.component.html',
  styleUrls: ['./avaliacoes.component.css'],
})
export class AvaliacoesComponent implements OnInit, OnDestroy {
  @Input() avaliacoes: any[] = [];
  subAvaliacoes: any[] = [];

  houveModificacao: boolean = false;
  habilitaBotaoSubDivisao: boolean = false;

  quantTelaMax: number = 0; // Maximo de aulas na tela
  indiceInicial: number = 0; // Primeira aula visivel na tela

  botaoEsquerda: boolean = false; // Indica se os botoes de navegação estarão habilitados
  botaoDireita: boolean = false;

  permissoes: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private sessaoService: SessaoService,
    private diarioService: DiarioService,
    private router: Router
  ) {
    if (this.sessaoService.permissoes)
      this.permissoes = JSON.parse(this.sessaoService.permissoes);
  }

  ngOnInit() {
  }

  focarPersistencia(): void {

  }

  trocarDivisao(ev: Event): void {

  }

  gerenciarAvaliacoes(ev: Event): void {

  }

  rolar(direcao: string): void {
    if (direcao === 'esq') {
      this.indiceInicial--;
    } else {
      this.indiceInicial++;
    }

    this.calcularBotoesAtivos();
  };

  obterSubAvaliacoes(): void {
    this.subAvaliacoes = [];
    this.avaliacoes.forEach(aval => {
      aval.subAvaliacoes.forEach((sub: any) => {
        sub.nomeAvaliacao = aval.nome;
        this.subAvaliacoes.push(sub);
      });
    });
    
    this.subAvaliacoes;
  };

  calcularBotoesAtivos(): void {
    var totalAvaliacoes = this.avaliacoes !== null && this.avaliacoes !== undefined ? this.subAvaliacoes.length : 0;

    if (totalAvaliacoes <= this.quantTelaMax) { // Se todos estão visiveis, o indice deve ser zero
      this.indiceInicial = 0;
    } else { // ao aumentar a janela, tentamos manter o indice, caso não seja grande demais
      if ((this.indiceInicial + this.quantTelaMax) > totalAvaliacoes) {
        this.indiceInicial = totalAvaliacoes - this.quantTelaMax;
      }
    }

    this.botaoEsquerda = this.indiceInicial > 0;
    this.botaoDireita = (this.indiceInicial + this.quantTelaMax) < totalAvaliacoes;
  }

  ngOnDestroy(): void { }
}
