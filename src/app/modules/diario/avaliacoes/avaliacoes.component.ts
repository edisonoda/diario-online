import {ActivatedRoute, Router} from '@angular/router';
import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {SessaoService} from 'src/app/core/services/sessao.service';
import {DiarioService} from '../../../core/services/diario.service';
import {MatDialog} from "@angular/material/dialog";
import {ModalErroComponent} from "./modal-erro/modal-erro.component";
import * as CryptoJS from 'crypto-js';
import {CONSTANTS} from "../../../core/constants";
import {MatSnackBar} from '@angular/material/snack-bar';
import {FiltrosService} from 'src/app/core/services/filtros.service';
import {ModalGerenciarAulaComponent} from "./modal-gerenciar-aula/modal-gerenciar-aula.component";


@Component({
  selector: 'app-avaliacoes',
  templateUrl: './avaliacoes.component.html',
  styleUrls: ['./avaliacoes.component.css'],
})
export class AvaliacoesComponent implements OnInit, OnDestroy {
  @Input() avaliacoes: any[] = [];
  @Input() lista: any[] = [];
  @Input() conceitos: any[] = [];
  @Input() filtros: any[] = [];


  subAvaliacoes: any[] = [];

  houveModificacao: boolean = false;
  computaConceito: boolean;
  habilitaBotaoSubDivisao: boolean = false;
  indiceAtivo: number = -1;

  quantTelaMax: number = 0; // Maximo de aulas na tela
  indiceInicial: number = 0; // Primeira aula visivel na tela

  botaoEsquerda: boolean = false; // Indica se os botoes de navegação estarão habilitados
  botaoDireita: boolean = false;

  permissoes: string[] = [];

  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private sessaoService: SessaoService,
    private diarioService: DiarioService,
    private router: Router,
    private filtrosService: FiltrosService,
    private snackbar: MatSnackBar
  ) {
    this.computaConceito = this.filtrosService.disciplina.tipoMedia === 'CONCEITO';

    if (this.sessaoService.permissoes)
      this.permissoes = JSON.parse(this.sessaoService.permissoes);
  }

  ngOnInit() {
  }

  focarPersistencia(): void {

  }
  mostrarJanelaErro(error:any): void {
    const dialogRef = this.dialog.open(ModalErroComponent, {
      minWidth: "300px",
      maxWidth: "800px",
      minHeight: "130px",
      maxHeight: "810px",
      data: {
       error: error
      }
    })
  }
  gerenciarAulaModal(ev: Event): void {
    const dialogRef = this.dialog.open(ModalGerenciarAulaComponent, {
      data: {
        avaliacoes: this.avaliacoes,
        lista: this.lista,
        filtros: this.filtrosService
      }
    });

    let avaliacoesRest:any = []
    dialogRef.afterClosed().subscribe(data => {
        data.forEach(function (aval:any) {
          aval.subAvaliacoes.forEach(function (sub:any) {
          if (sub.flagSubTipo && !sub.isRecuperacao) {
            avaliacoesRest.push({
              "id": sub.id,
              "notaMaxima": sub.notaMaxima,
              "nome": sub.nome,
              "idProgramaItemDivisao": aval.idProgramaItemDivisao
            });
          }
        });
      });

      this.diarioService.salvarAvaliacoes(this.filtros.instituicao.id, this.filtros.divisao.id, this.filtros.turma.id,
        this.filtros.disciplina.id, avaliacoesRest, this.filtros.turma.etapa.id).then(function (data:any) {
          this.avaliacoes = data;
          this.diarioService.obterAlunos(this.filtros.instituicao.id, this.filtros.periodoLetivo.id, this.filtros.turma.id,
            this.filtros.disciplina.id, this.filtros.divisao.id, this.filtros.turma.etapa.id).then(function (dataAluno:any) {
            this.lista = dataAluno;
            this.prepararAvaliacoes();
            this.subAvaliacoes = scope.obterSubAvaliacoes();
            this.calcularLarguras();
            this.snackBar.open('Avaliações salvas com sucesso.');

            });
        },
        function (error:any) {
          var data = error.data;
          if (data !== null && data.error !== null && data.error.message !== null) {
            this.snackBar.open(data.error.message);
          }
        });

    });
  }

  trocarDivisao(ev: Event): void {

  }

  gerenciarAvaliacoes(ev: Event) {
    // verifica se ja tem lancamento para as macroavaliacoes
    this.avaliacoes.forEach((aval: any) => {
      var alunoEncontrado = this.lista.find(f);

      function f(aluno: any) {
        if (aluno.status != 'R') {
          var notaEncontrada = aluno.notas.find(function (nota: any) {
            // se tem entre as notas do aluno algum lancamento para a avaliacao testada
            return nota.id === aval.id && !nota.flagNotaSubTipo && nota.vl_nota != null;
          });
          return notaEncontrada != null;
        }

        return false;
      }

      aval.temLancamento = alunoEncontrado != null;
    });

    const dialogRef = this.dialog.open(ModalGerenciarAulaComponent, {
      data: {
        avaliacoes: this.avaliacoes,
        lista: this.lista,
        filtros: this.filtros
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      let avaliacoesRest:any = [];
      data.forEach(function (aval:any) {
        aval.subAvaliacoes.forEach(function (sub:any) {
          if (sub.flagSubTipo && !sub.isRecuperacao) {
            avaliacoesRest.push({
              "id": sub.id,
              "notaMaxima": sub.notaMaxima,
              "nome": sub.nome,
              "idProgramaItemDivisao": aval.idProgramaItemDivisao
            });
          }
        });
      });

      this.diarioService.salvarAvaliacoes(this.filtrosService.idInstituicao, this.filtrosService.idDivisao, this.filtrosService.idTurma,
        this.filtrosService.idDisciplina, avaliacoesRest, this.filtrosService.idEtapa).subscribe((data: any) => {
          this.avaliacoes = data;
          this.diarioService.obterAlunos(this.filtrosService.idInstituicao, this.filtrosService.idPeriodoLetivo, this.filtrosService.idTurma,
            this.filtrosService.idDisciplina, this.filtrosService.idDivisao, this.filtrosService.idEtapa).subscribe((dataAluno) => {
            this.lista = dataAluno;
            this.prepararAvaliacoes();
            this.obterSubAvaliacoes();
            this.calcularLarguras();
            this.snackbar.open('Avaliações salvas com sucesso.');
          });
        },
        (error: any) => {
          var data = error.data;
          if (data !== null && data.error !== null && data.error.message !== null) {
            this.snackbar.open(data.error.message);
          }
        });
    });
  };

  calcularLarguras() {
    var larguraJanela = $(window).width();
    var larguraTabela = larguraJanela > 1167 ? 1134 : (larguraJanela - 33); // 17 + 16
    var larguraItensFixos = 23 + 23 + 45; // O, S e Total
    var larguraAula = 45;
    var larguraMinimaNome = larguraTabela / 2; //50%
    var largTempNome = larguraTabela - larguraItensFixos;
    var quantTelaMax = 0;
    while (largTempNome > larguraMinimaNome) { // Descobre o máximo de avaliacoes possiveis, mantendo a largura minima do nome
      largTempNome -= larguraAula;
      quantTelaMax++;
    }
    quantTelaMax--;

    this.quantTelaMax = quantTelaMax;

    this.calcularBotoesAtivos();
  }

  prepararAvaliacoes() {

    this.habilitaBotaoSubDivisao = false;

    this.avaliacoes.forEach(function (aval) {
      if (!this.habilitaBotaoSubDivisao && aval.flagPermiteSubTipo && aval.id != -1) {
        this.habilitaBotaoSubDivisao = true;
      }
      //total fake de aval de conceito
      if (aval.subAvaliacoes.length > 0 && this.computaConceito) {
        var avalCopy = angular.copy(aval);
        avalCopy.nome = "Total";
        avalCopy.totalConceito = true;
        aval.subAvaliacoes.push(avalCopy);
      }
      //se nao tem subavaliacao cria uma para atender o layout
      if (aval.subAvaliacoes.length == 0) {
        var avalCopy = angular.copy(aval);
        avalCopy.nome = null;
        aval.subAvaliacoes.push(avalCopy);
      }

      var index = 0;
      this.teste = aval.tipoCalculoSubavaliacoes;

      for (var index = 0; index < aval.subAvaliacoes.length; index++) {
        aval.subAvaliacoes[index].isRecuperacao = false;
        if (aval.subAvaliacoes[index] && aval.subAvaliacoes[index].flPermiteRecuperacao === true) {
          var avalCopy = angular.copy(aval.subAvaliacoes[index]);
          avalCopy.flPermiteRecuperacao = false;
          avalCopy.nome = 'Recuperação';
          avalCopy.isRecuperacao = true;
          aval.subAvaliacoes.splice(index + 1, 0, avalCopy);
          index++;
        }
      }

    /*
     * É preciso definir um id para cada frequencia, por causa dos ng-repeats
     * Usar o $index não estava dando certo ao inserir novas aulas
     */
    this.lista.forEach(function (aluno:any) {
      aluno.remanejadoOuVeioDeRemanejamento = this.remanejadoOuVeioDeRemanejamento(aluno);
      this.ocultarNotaSeRemanejadoOuVeioDeRemanejamento(aluno);

      //atualiza notas dos alunos
      if (this.avaliacoes && this.avaliacoes.length > 0 && !this.computaConceito) {
        this.atualizarNota(aluno, false);
      }

      aluno.resultados.forEach(function (aval:any, k2:any) {
        aval.$$id = k2;
      });


      if (aluno.resolverPendencia) {
        document.getElementById('aluno-id-' + aluno.id)?.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest"
        });
      }
    });
  });
  }

  ocultarNotaSeRemanejadoOuVeioDeRemanejamento(aluno:any) {
    if (aluno.remanejadoOuVeioDeRemanejamento) {
      aluno.notas.forEach(function(nota:any) {
        nota.vl_nota = '';
        nota.vl_nota_recuperacao = '';
      });
    }
  }

  descartarAlteracoes = function () {
    var entrada = {
      idInstituicao: this.filtros.instituicao.id,
      idPeriodoLetivo: this.filtros.periodoLetivo.id,
      idTurma: this.filtros.turma.id,
      idEtapa: this.filtros.turma.etapa.id,
      idDisciplina: this.filtros.disciplina.id,
      idDivisao: this.filtros.divisao.id,
      tipoAvaliacao: this.filtros.divisao.tipoAvaliacao,
      aba: 1
    };
    var json = CryptoJS.AES.encrypt(JSON.stringify(entrada), CONSTANTS.KEY);
    this.router.navigate(['site', 'diario'], {
      queryParams: {
        entry: json,
        reload: true,
        inherit: true,
        notify: true
      }
    });
  };

  atualizarNota(aluno:any, controleModificacao:any) {
    aluno.notas.forEach(function (alunoNota:any) {
      alunoNota.vl_nota_processada = alunoNota.vl_nota;
      // se existe nota, verifico a nota de recuperação
      if (alunoNota.vl_nota_processada != null) {
        alunoNota.vl_nota_processada = (alunoNota.vl_nota_recuperacao !== null &&
          alunoNota.vl_nota_recuperacao > alunoNota.vl_nota) ?
          alunoNota.vl_nota_recuperacao : alunoNota.vl_nota;
      } else {
        alunoNota.vl_nota_recuperacao = null;
      }

      if (controleModificacao && alunoNota.modificado) {
        aluno.modificado = true;
        this.houveModificacao = true;
        alunoNota.modificado = false;
      }
    });

    if (aluno.notas.length > 0) {
      aluno.totalNotas = this.getNotaFinal(aluno.notas, aluno.quantidadeCasasDecimais);
    }
    //scope.$apply();
  };

  remanejadoOuVeioDeRemanejamento(aluno:any) {
    return aluno.status === 'R' && aluno.alunoVeioDeRemanejamento;
  }

  rolar(direcao: string): void {
    if (direcao === 'esq') {
      this.indiceInicial--;
    } else {
      this.indiceInicial++;
    }

    this.calcularBotoesAtivos();
  };

  getNotaFinal(notas:any, quantidadeCasasDecimais:any) {

    var notaCalculada = 0;
    this.avaliacoes.forEach(function (aval) {

      var notaAval = 0;
      var qtSubs = 0;
      aval.subAvaliacoes.forEach(function (sub:any) {

        if (!sub.isRecuperacao) {
          notaAval = notaAval + this.getNotaSubAvaliacao(notas, sub);
          qtSubs++;
        }
      })

      if (aval.tipoCalculoSubavaliacoes == 2 && notaAval && notaAval > 0) {
        notaAval = notaAval / qtSubs;
        var notaAvalAjustada = this.ajustarNumeroCasasDecimais(''+notaAval, quantidadeCasasDecimais);
        notaAval = parseFloat(notaAvalAjustada);
      }

      notaCalculada = notaCalculada + notaAval;
    })

    return Math.round(notaCalculada * 100)/100;
  }

  obterSubAvaliacoes() {
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

  alunoModificado(aluno:any) {
    this.houveModificacao = true;
    aluno.modificado = true;
  }

  ajustarNumeroCasasDecimais(num:any, dec:any) {
    var anum = num.split('.');
    var numnew;
    if (anum[1]) {
      numnew = anum[0] + '.' + anum[1].substring(0, dec);
    } else {
      numnew = anum[0];
    }
    return numnew;
  }

  getNotaSubAvaliacao(notas:any, sub:any) {
    var notaSub = 0;
    notas.forEach(function (nota:any) {
      if (sub.id === nota.id) {
        notaSub = nota.vl_nota_processada;
      }
    })
    return notaSub;
  }

  selecionarConceito(){
    this.houveModificacao = true;
    //this.modificado = true;
  };

  onchangeNota(avaliacao:any, nota:any, aluno:any, isRecuperacao:any) {
    function validarNota(vl_nota:any) {

      if (vl_nota === undefined || isNaN(Number(vl_nota))) {
        return null;
      } else if (vl_nota > avaliacao.notaMaxima || vl_nota < 0) {
        this.snackBar.open('Nota inválida');
        return null;
      }
      return vl_nota;
    }

    if (nota.vl_nota !== null) {

      if (isRecuperacao === true) {
        nota.vl_nota_recuperacao = validarNota(nota.vl_nota_recuperacao);
      } else {
        nota.vl_nota = validarNota(nota.vl_nota);
        if (nota.vl_nota === null || nota.vl_nota === undefined || nota.vl_nota === avaliacao.notaMaxima) {
          nota.vl_nota_recuperacao = null;
        }
      }
    }
    nota.modificado = true;
    this.atualizarNota(aluno, true);
  };

  nchangeConceito = function (avaliacao:any, nota:any, aluno:any) {
    this.alunoModificado(aluno);
    // se tem somente uma avaliação e total o valor é atribuido automaticamente
    if (this.avaliacoes.length == 2 && aluno.notas.length == 2) {
      aluno.notas.forEach(function (alunoNota:any) {
        alunoNota.idConceito = nota.idConceito;
      });
    }
  }
  ngOnDestroy(): void { }
}
