import {Component, OnDestroy, OnInit} from '@angular/core';

@Component({
  selector: 'app-modal-gerenciar-aula',
  templateUrl: './modal-gerenciar-aula.component.html',
  styleUrls: ['./modal-gerenciar-aula.component.scss']
})
export class ModalGerenciarAulaComponent implements OnInit, OnDestroy{

  indiceNotaEditada = -1;
  avaliacoes: any;
  lista: any;
  filtros: any;
  this.avaliacao = {
    descricao: null,
    nota: null
  }
  this.computaConceito = this.filtros.disciplina.tipoMedida === 'CONCEITO';
  this.qtMaximoSubDivisoes = this.filtros.disciplina.qtMaximoSubavaliacoes;

  this.indexAvaliacaoSelecionada = null;

  this.avaliacoes = [];
  angular.copy(avaliacoes.filter(function (av:any) {
    return av.flAvaliacaoFormativa == false
  }), this.avaliacoes);

  this.lista = lista;
  this.notaMaximaDivisao = filtros.divisao.notaMaxima;
  if (this.avaliacoes[this.indexAvaliacaoSelecionada] && this.isTipoCalculoMedia()) {
  this.avaliacao.nota = this.avaliacoes[this.indexAvaliacaoSelecionada].notaMaxima;
}

this.getSomaAvaliacoes = function () {
  var contador = 0;
  contador += this.avaliacao.nota;
  this.avaliacoes[this.indexAvaliacaoSelecionada].subAvaliacoes.forEach(function (entry:any, index:any) {
    if (this != index && entry.flagSubTipo && !entry.isRecuperacao) {
      contador += entry.notaMaxima;
    }
  });

  return contador;
}

this.isTipoCalculoMedia = function() {
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
  this.avaliacoes.forEach(function (aval:any) {
    aval.subAvaliacoes.forEach(function (entry:any) {
      entry.selecionado = false;
    });
  });
}

this.salvarAvaliacao = function () {
  var tamanho = null;
  if (this.avaliacoes) {
    tamanho = this.avaliacoes[this.indexAvaliacaoSelecionada].subAvaliacoes.filter(function (av:any, index:any) {
      return av.flagSubTipo == true && !(av.selecionado && index == indiceNotaEditada) && av.flAvaliacaoFormativa == false && (av.isRecuperacao == false || av.isRecuperacao === undefined)
    }).length;
  }

  if (this.qtMaximoSubDivisoes && tamanho == this.qtMaximoSubDivisoes) {
    .erro('O número de SubTipos de Avaliação não pode ser maior que a quantidade máxima permitida: ' + $scope.qtMaximoSubDivisoes);

    return;
  }

  if ($scope.avaliacao.descricao === null || $scope.avaliacao.descricao === undefined || $scope.avaliacao.descricao === '') {
    messagesService.erro('Atenção favor informar a descrição.');

    return;
  }

  if (!$scope.computaConceito) {
    if ($scope.avaliacao.nota === undefined || $scope.avaliacao.nota === null) {
      messagesService.erro('Atenção favor informar a nota máxima.');
      return;
    } else if ($scope.avaliacao.nota <= 0) {
      messagesService.erro('Atenção favor informar uma nota maior que zero.');
      return;
    }

    if (!$scope.isTipoCalculoMedia() && $scope.getSomaAvaliacoes() > $scope.avaliacoes[$scope.indexAvaliacaoSelecionada].notaMaxima) {
      messagesService.erro('Atenção a soma das avaliações deve ser inferior a nota máxima do tipo de avaliação.');
      return;
    }

    if (!$scope.avaliacoes[$scope.indexAvaliacaoSelecionada].flagPermiteSubTipo && $scope.avaliacoes[$scope.indexAvaliacaoSelecionada].temLancamento) {
      messagesService.erro('Já existem notas lançadas para a avaliação ' + $scope.avaliacoes[$scope.indexAvaliacaoSelecionada].nome + '.');
      return;
    }
  }

  if (indiceNotaEditada == -1) {
    var programacaoDivisaoNotaRestVO = {
      nome: $scope.avaliacao.descricao,
      notaMaxima: $scope.avaliacao.nota,
      flagSubTipo: true,
      selecionado: false,
      isRecuperacao: false,
      flAvaliacaoFormativa: false
    };
    $scope.avaliacoes[$scope.indexAvaliacaoSelecionada].subAvaliacoes.push(programacaoDivisaoNotaRestVO);
  } else {
    var notaEditada = $scope.avaliacoes[$scope.indexAvaliacaoSelecionada].subAvaliacoes[indiceNotaEditada];
    notaEditada.nome = $scope.avaliacao.descricao;
    notaEditada.notaMaxima = $scope.avaliacao.nota;
  }

  $scope.avaliacao.descricao = null;
  $scope.avaliacao.nota = null;
  indiceNotaEditada = -1;
  desselecionarItens();
};

$scope.obterQtdSelecionados = function () {
  if ($scope.indexAvaliacaoSelecionada == null) {
    return 0;
  }

  var qtdSelecionados = $scope.avaliacoes[$scope.indexAvaliacaoSelecionada].subAvaliacoes.map(function (entry) {
    return entry.selecionado === true ? 1 : 0;
  });

  return qtdSelecionados.reduce(function (a, b) {
    return a + b
  });
};

$scope.selecionarAtividadeNota = function (indice) {
  $scope.avaliacoes[$scope.indexAvaliacaoSelecionada].subAvaliacoes.forEach(function (entry) {
    if (entry.id !== indice) {
      entry.selecionado = false;
    }
  });
};

$scope.editarAtividadeNota = function () {
  $scope.avaliacoes[$scope.indexAvaliacaoSelecionada].subAvaliacoes.forEach(function (entry, index) {
    if (entry.selecionado) {
      $scope.avaliacao.descricao = entry.nome;
      $scope.avaliacao.nota = entry.notaMaxima;
      indiceNotaEditada = index;
    }
  });
};

$scope.excluir = function () {
  $scope.avaliacoes[$scope.indexAvaliacaoSelecionada].subAvaliacoes.forEach(function (entry, index) {
    if (entry.selecionado) {
      $scope.avaliacoes[$scope.indexAvaliacaoSelecionada].subAvaliacoes.splice(index, 1);
    }
  });
  $scope.avaliacao.descricao = null;
  $scope.avaliacao.nota = null;
  indiceNotaEditada = -1;
};


$scope.fecharJanela = function () {
  $mdDialog.cancel();
};

this.salvar = function () {
  var somaAvaliacoes = $scope.getSomaAvaliacoes();
  if (!this.isTipoCalculoMedia() &&
    somaAvaliacoes != null && somaAvaliacoes !== 0 &&
    somaAvaliacoes !== $scope.avaliacoes[$scope.indexAvaliacaoSelecionada].notaMaxima) {
    messagesService.erro('A soma dos SubTipos de Avaliação deve ser igual à nota máxima do Tipo de Avaliação selecionado.');
    return;
  } else {
    $mdDialog.hide($scope.avaliacoes);
  }
};
}

}
