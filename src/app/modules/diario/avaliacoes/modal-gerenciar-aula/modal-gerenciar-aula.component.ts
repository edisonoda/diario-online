import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { FiltrosService } from 'src/app/core/services/filtros.service';
import { SessaoService } from 'src/app/core/services/sessao.service';

@Component({
  selector: 'app-modal-gerenciar-aula',
  templateUrl: './modal-gerenciar-aula.component.html',
  styleUrls: ['./modal-gerenciar-aula.component.scss']
})
export class ModalGerenciarAulaComponent implements OnInit, OnDestroy {
  avaliacoes: any[] = [];
  lista: any[] = [];

  indiceNotaEditada = -1;

  avaliacao: any = {
    descricao: null,
    nota: null
  };

  computaConceito: boolean;
  qtMaximoSubDivisoes: number;

  indexAvaliacaoSelecionada: number = -1;
  notaMaximaDivisao: number;

  permissoes: any = [];

  constructor(
    public dialogRef: MatDialogRef<ModalGerenciarAulaComponent>,
    @Inject(MAT_DIALOG_DATA) public dados: any,
    public filtrosService: FiltrosService,
    private sessaoService: SessaoService,
    private snackBar: MatSnackBar,
  ) {
    this.avaliacoes = JSON.parse(JSON.stringify(dados.avaliacoes.filter((av: any) => {
      return av.flAvaliacaoFormativa == false;
    })));
    this.lista = dados.lista;

    this.computaConceito = this.filtrosService.disciplina.tipoMedida === 'CONCEITO';
    this.qtMaximoSubDivisoes = this.filtrosService.disciplina.qtMaximoSubavaliacoes;

    this.notaMaximaDivisao = this.filtrosService.divisao.notaMaxima;
    if (this.avaliacoes[this.indexAvaliacaoSelecionada] && this.isTipoCalculoMedia()) {
      this.avaliacao.nota = this.avaliacoes[this.indexAvaliacaoSelecionada].notaMaxima;
    }

    this.permissoes = this.sessaoService.permissoes;
  }

  ngOnDestroy() {
  }

  ngOnInit() {
  }

  getSomaAvaliacoes() {
    var contador = 0;
    contador += this.avaliacao.nota;
    this.avaliacoes[this.indexAvaliacaoSelecionada].subAvaliacoes.forEach((entry: any, index: any) => {
      if (this != index && entry.flagSubTipo && !entry.isRecuperacao) {
        contador += entry.notaMaxima;
      }
    });
    return contador;
  }

  isTipoCalculoMedia() {
    return (this.avaliacoes[this.indexAvaliacaoSelecionada] &&
      this.avaliacoes[this.indexAvaliacaoSelecionada].tipoCalculoSubavaliacoes === 2); // 2 = MEDIA
  }

  novaAvaliacao() {
    this.avaliacao.descricao = null;
    if (this.isTipoCalculoMedia()) {
      this.avaliacao.nota = this.avaliacoes[this.indexAvaliacaoSelecionada].notaMaxima;
    } else {
      this.avaliacao.nota = null;
    }
    this.desselecionarItens();
  };

  desselecionarItens() {
    this.avaliacoes.forEach(function (aval: any) {
      aval.subAvaliacoes.forEach(function (entry: any) {
        entry.selecionado = false;
      });
    });
  }

  salvarAvaliacao() {
    var tamanho = null;
    if (this.avaliacoes) {
      tamanho = this.avaliacoes[this.indexAvaliacaoSelecionada].subAvaliacoes.filter((av: any, index: number) => {
        return av.flagSubTipo == true && !(av.selecionado && index == this.indiceNotaEditada) && av.flAvaliacaoFormativa == false && (av.isRecuperacao == false || av.isRecuperacao === undefined)
      }).length;
    }

    if (this.qtMaximoSubDivisoes && tamanho == this.qtMaximoSubDivisoes) {
      this.snackBar.open('O número de SubTipos de Avaliação não pode ser maior que a quantidade máxima permitida: ' + this.qtMaximoSubDivisoes, '', {
        duration: 5000,
        panelClass: ['md-error-toast-theme']
      });
      return;
    }

    if (this.avaliacao.descricao === null || this.avaliacao.descricao === undefined || this.avaliacao.descricao === '') {
      this.snackBar.open('Atenção favor informar a descrição.', '', {
        duration: 5000,
        panelClass: ['md-error-toast-theme']
      });
      return;
    }

    if (!this.computaConceito) {
      if (this.avaliacao.nota === undefined || this.avaliacao.nota === null) {
        this.snackBar.open('Atenção favor informar a nota máxima.', '', {
          duration: 5000,
          panelClass: ['md-error-toast-theme']
        });
        return;
      } else if (this.avaliacao.nota <= 0) {
        this.snackBar.open('Atenção favor informar uma nota maior que zero.', '', {
          duration: 5000,
          panelClass: ['md-error-toast-theme']
        });
        return;
      }

      if (!this.isTipoCalculoMedia() && this.getSomaAvaliacoes() > this.avaliacoes[this.indexAvaliacaoSelecionada].notaMaxima) {
        this.snackBar.open('Atenção a soma das avaliações deve ser inferior a nota máxima do tipo de avaliação.', '', {
          duration: 5000,
          panelClass: ['md-error-toast-theme']
        });
        return;
      }

      if (!this.avaliacoes[this.indexAvaliacaoSelecionada].flagPermiteSubTipo && this.avaliacoes[this.indexAvaliacaoSelecionada].temLancamento) {
        this.snackBar.open('Já existem notas lançadas para a avaliação ' + this.avaliacoes[this.indexAvaliacaoSelecionada].nome + '.', '', {
          duration: 5000,
          panelClass: ['md-error-toast-theme']
        });
        ;
        return;
      }
    }

    if (this.indiceNotaEditada == -1) {
      var programacaoDivisaoNotaRestVO = {
        nome: this.avaliacao.descricao,
        notaMaxima: this.avaliacao.nota,
        flagSubTipo: true,
        selecionado: false,
        isRecuperacao: false,
        flAvaliacaoFormativa: false
      };

      this.avaliacoes[this.indexAvaliacaoSelecionada].subAvaliacoes.push(programacaoDivisaoNotaRestVO);
    } else {
      var notaEditada = this.avaliacoes[this.indexAvaliacaoSelecionada].subAvaliacoes[this.indiceNotaEditada];
      notaEditada.nome = this.avaliacao.descricao;
      notaEditada.notaMaxima = this.avaliacao.nota;
    }

    this.avaliacao.descricao = null;
    this.avaliacao.nota = null;
    this.indiceNotaEditada = -1;
    this.desselecionarItens();
  };

  obterQtdSelecionados() {
    if (this.indexAvaliacaoSelecionada == null) {
      return 0;
    }

    var qtdSelecionados = this.avaliacoes[this.indexAvaliacaoSelecionada].subAvaliacoes.map((entry: any) => {
      return entry.selecionado === true ? 1 : 0;
    });

    return qtdSelecionados.reduce((a: number, b: number) => {
      return a + b
    });
  };

  selecionarAtividadeNota(indice: any) {
    this.avaliacoes[this.indexAvaliacaoSelecionada].subAvaliacoes.forEach(function (entry: any) {
      if (entry.id !== indice) {
        entry.selecionado = false;
      }
    });
  };

  editarAtividadeNota() {
    this.avaliacoes[this.indexAvaliacaoSelecionada].subAvaliacoes.forEach((entry: any, index: any) => {
      if (entry.selecionado) {
        this.avaliacao.descricao = entry.nome;
        this.avaliacao.nota = entry.notaMaxima;
        this.indiceNotaEditada = index;
      }
    });
  };

  excluir() {
    this.avaliacoes[this.indexAvaliacaoSelecionada].subAvaliacoes.forEach((entry: any, index: any) => {
      if (entry.selecionado) {
        this.avaliacoes[this.indexAvaliacaoSelecionada].subAvaliacoes.splice(index, 1);
      }
    });
    this.avaliacao.descricao = null;
    this.avaliacao.nota = null;
    this.indiceNotaEditada = -1;
  };

  fecharJanela() {
    this.dialogRef.close(null);
  };

  salvar() {
    var somaAvaliacoes = this.getSomaAvaliacoes();
    if (!this.isTipoCalculoMedia() &&
      somaAvaliacoes != null && somaAvaliacoes !== 0 &&
      somaAvaliacoes !== this.avaliacoes[this.indexAvaliacaoSelecionada].notaMaxima) {
      this.snackBar.open('A soma dos SubTipos de Avaliação deve ser igual à nota máxima do Tipo de Avaliação selecionado.', '', {
        duration: 5000,
        panelClass: ['md-error-toast-theme']
      });
      return;
    } else {
      this.dialogRef.close(this.avaliacoes);
    }
  }
}

