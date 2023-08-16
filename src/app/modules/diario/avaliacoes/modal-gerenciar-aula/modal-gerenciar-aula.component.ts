import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-modal-gerenciar-aula',
  templateUrl: './modal-gerenciar-aula.component.html',
  styleUrls: ['./modal-gerenciar-aula.component.scss']
})
export class ModalGerenciarAulaComponent implements OnInit, OnDestroy {

  indiceNotaEditada = -1;
  avaliacoes: any;
  lista: any;
  filtros: any;

  constructor(
    public dialogRef: MatDialogRef<ModalGerenciarAulaComponent>,
    @Inject(MAT_DIALOG_DATA) public dados: any,
    private snackBar: MatSnackBar,
  ) {
    this.avaliacoes = dados.avaliacoes;
    this.lista = dados.lista;
    this.filtros = dados.filtros;
  }

  ngOnDestroy() {
  }

  ngOnInit() {
  }

  this.avaliacao = {
    descricao: null,
    nota: null
  }
  this.computaConceito = this.filtros.disciplina.tipoMedida === 'CONCEITO';
  this.qtMaximoSubDivisoes = this.filtros.disciplina.qtMaximoSubavaliacoes;

  this.indexAvaliacaoSelecionada = null;

  this.avaliacoes = [];

  let avaliacoesFilter = this.ava.filter(function (av: any) {
    return av.flAvaliacaoFormativa == false
  })

  this.avaliacoes.push(JSON.parse(JSON.stringify(avaliacoesFilter)));

  this.notaMaximaDivisao = this.filtros.divisao.notaMaxima;

  if(this.avaliacoes[this.indexAvaliacaoSelecionada] && this.isTipoCalculoMedia) {
    this.avaliacao.nota = this.avaliacoes[this.indexAvaliacaoSelecionada].notaMaxima;
  }

  this.getSomaAvaliacoes = function () {
    var contador = 0;
    contador += this.avaliacao.nota;
    this.avaliacoes[this.indexAvaliacaoSelecionada].subAvaliacoes.forEach(function (entry: any, index: any) {
      if (this != index && entry.flagSubTipo && !entry.isRecuperacao) {
        contador += entry.notaMaxima;
      }
  });
  return contador;
}

this.isTipoCalculoMedia = function () {
  return (this.avaliacoes[this.indexAvaliacaoSelecionada] &&
    this.avaliacoes[this.indexAvaliacaoSelecionada].tipoCalculoSubavaliacoes === 2); // 2 = MEDIA
}

this.novaAvaliacao = function () {
  this.avaliacao.descricao = null;
  if (this.isTipoCalculoMedia()) {
    this.avaliacao.nota = this.avaliacoes[this.indexAvaliacaoSelecionada].notaMaxima;
  } else {
    this.avaliacao.nota = null;
  }
  desselecionarItens();
};

var desselecionarItens = function () {
  this.avaliacoes.forEach(function (aval: any) {
    aval.subAvaliacoes.forEach(function (entry: any) {
      entry.selecionado = false;
    });
  });
}

this.salvarAvaliacao = function () {
  var tamanho = null;
  if (this.avaliacoes) {
    tamanho = this.avaliacoes[this.indexAvaliacaoSelecionada].subAvaliacoes.filter(function (av, index) {
      return av.flagSubTipo == true && !(av.selecionado && index == this.indiceNotaEditada) && av.flAvaliacaoFormativa == false && (av.isRecuperacao == false || av.isRecuperacao === undefined)
    }).length;
  }

  if (this.qtMaximoSubDivisoes && tamanho == this.qtMaximoSubDivisoes) {
    this.snackBar.open('O número de SubTipos de Avaliação não pode ser maior que a quantidade máxima permitida: ' + this.qtMaximoSubDivisoes);
    return;
  }

  if (this.avaliacao.descricao === null || this.avaliacao.descricao === undefined || this.avaliacao.descricao === '') {
    this.snackBar.open('Atenção favor informar a descrição.');
    return;
  }

  if (!this.computaConceito) {
    if (this.avaliacao.nota === undefined || this.avaliacao.nota === null) {
      this.snackBar.open('Atenção favor informar a nota máxima.');
      return;
    } else if (this.avaliacao.nota <= 0) {
      this.snackBar.open('Atenção favor informar uma nota maior que zero.');
      return;
    }

    if (!this.isTipoCalculoMedia() && this.getSomaAvaliacoes() > this.avaliacoes[this.indexAvaliacaoSelecionada].notaMaxima) {
      this.snackBar.open('Atenção a soma das avaliações deve ser inferior a nota máxima do tipo de avaliação.');
      return;
    }

    if (!this.avaliacoes[this.indexAvaliacaoSelecionada].flagPermiteSubTipo && this.avaliacoes[this.indexAvaliacaoSelecionada].temLancamento) {
      this.snackBar.open('Já existem notas lançadas para a avaliação ' + this.avaliacoes[this.indexAvaliacaoSelecionada].nome + '.');
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
  desselecionarItens();
};

this.obterQtdSelecionados = function () {
  if (this.indexAvaliacaoSelecionada == null) {
    return 0;
  }

  var qtdSelecionados = this.avaliacoes[this.indexAvaliacaoSelecionada].subAvaliacoes.map(function (entry) {
    return entry.selecionado === true ? 1 : 0;
  });

  return qtdSelecionados.reduce(function (a, b) {
    return a + b
  });
};

this.selecionarAtividadeNota = function (indice: any) {
  this.avaliacoes[this.indexAvaliacaoSelecionada].subAvaliacoes.forEach(function (entry: any) {
    if (entry.id !== indice) {
      entry.selecionado = false;
    }
  });
};

this.editarAtividadeNota = function () {
  this.avaliacoes[this.indexAvaliacaoSelecionada].subAvaliacoes.forEach(function (entry: any, index: any) {
    if (entry.selecionado) {
      this.avaliacao.descricao = entry.nome;
      this.avaliacao.nota = entry.notaMaxima;
      this.indiceNotaEditada = index;
    }
  });
};

this.excluir = function () {
  this.avaliacoes[this.indexAvaliacaoSelecionada].subAvaliacoes.forEach(function (entry: any, index: any) {
    if (entry.selecionado) {
      this.avaliacoes[this.indexAvaliacaoSelecionada].subAvaliacoes.splice(index, 1);
    }
  });
  this.avaliacao.descricao = null;
  this.avaliacao.nota = null;
  this.indiceNotaEditada = -1;
};

this.fecharJanela = function () {
  this.dialogRef.close(null);
};

this.salvar = function () {
  var somaAvaliacoes = this.getSomaAvaliacoes();
  if (!this.isTipoCalculoMedia() &&
    somaAvaliacoes != null && somaAvaliacoes !== 0 &&
    somaAvaliacoes !== this.avaliacoes[this.indexAvaliacaoSelecionada].notaMaxima) {
    this.snackBar.open('A soma dos SubTipos de Avaliação deve ser igual à nota máxima do Tipo de Avaliação selecionado.);
    return;
  } else {
    this.dialogRef.close(this.avaliacoes);
  }
}

