import { ActivatedRoute, Router } from '@angular/router';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { SessaoService } from 'src/app/core/services/sessao.service';
import { DiarioService } from '../../../core/services/diario.service';
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { ModalErroComponent } from "./modal-erro/modal-erro.component";
import * as CryptoJS from 'crypto-js';
import { CONSTANTS } from "../../../core/constants";
import { MatSnackBar, MatSnackBarModule }  from '@angular/material/snack-bar';
import { FiltrosService } from 'src/app/core/services/filtros.service';
import * as moment from "moment/moment";
import { ModalGerenciarAulaComponent } from "./modal-gerenciar-aula/modal-gerenciar-aula.component";
import { ModalTrocaDivisaoComponent } from '../modal-troca-divisao/modal-troca-divisao.component';
import { DiarioComponent } from '../diario.component';


@Component({
  selector: 'app-avaliacoes',
  templateUrl: './avaliacoes.component.html',
  styleUrls: ['./avaliacoes.component.css'],
})
export class AvaliacoesComponent implements OnInit, OnDestroy {
  @Input() avaliacoes: any[] = [];
  @Input() lista: any[] = [];
  @Input() conceitos: any[] = [];
  @Input() diario: MatDialogRef<DiarioComponent>|null = null;

  subAvaliacoes: any[] = [];

  houveModificacao: boolean = false;
  computaConceito: boolean;
  habilitaBotaoSubDivisao: boolean = false;
  indiceAtivo: number = -1;

  quantTelaMax: number = 0; // Maximo de aulas na tela
  indiceInicial: number = 0; // Primeira aula visivel na tela

  botaoEsquerda: boolean = false; // Indica se os botoes de navegação estarão habilitados
  botaoDireita: boolean = false;

  permissoes: string = "";

  constructor(
    public dialog: MatDialog,
    private sessaoService: SessaoService,
    private diarioService: DiarioService,
    private router: Router,
    private filtrosService: FiltrosService,
    private snackBar: MatSnackBar
  ) {

    this.computaConceito = true
    if (this.sessaoService.permissoes) {
      this.permissoes = this.sessaoService.permissoes;
    }
  }

  ngOnInit() {
    this.calcularLarguras();
  }

  focarPersistencia(): void {
    // Scroll até o btn de salvar
    document.getElementById('botaoSalvar')?.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest"
    });

    this.snackBar.open('Salve antes de prosseguir.', '', {
      duration: 5000,
      panelClass: ['md-error-toast-theme']
    });
  }
  mostrarJanelaErro(error: any): void {
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

  trocarDivisao(ev: Event): void {
    const dialogRef = this.dialog.open(ModalTrocaDivisaoComponent, {
      minWidth: "300px",
      maxWidth: "800px",
      minHeight: "130px",
      maxHeight: "810px",
      data: {
        divisao: this.filtrosService.divisao
      }
    });

    const sub = dialogRef.afterClosed().subscribe(result => {
      if (result) {
        sub.unsubscribe();
        this.diario?.close();
  
        this.dialog.open(DiarioComponent, {
          data: { divisao: result },
          maxWidth: '100vw',
          maxHeight: '100vh',
          height: '100%',
          width: '100%'
        });
      }
    });
  }

  salvarLancamentos(ev: Event) {
    var lancamentosNota: any[] = [];

    this.subAvaliacoes.filter((av: any) => {
      return !av.isRecuperacao
    }).forEach((aval) => {
      var listaAlunoNotaAvaliacao = [];

      var lancamentoNota: any = {
        "idTipoAvaliacao": aval.id,
        "flagSubTipo": aval.flagSubTipo,
        "listaAlunoNotaAvaliacao": []
      };

      this.lista.forEach((aluno) => {
        if (aluno.modificado) {
          aluno.notas.forEach((nota: any) => {
            if (nota.id === aval.id && nota.flagNotaSubTipo === aval.flagSubTipo) {
              if (!this.computaConceito) {
                var alunoNota: any = {
                  "idAluno": aluno.id
                }
                if (aval.flagSubTipo) {
                  if (aval.flPermiteRecuperacao) {
                    alunoNota.notaRecuperacaoParalela = nota.vl_nota_recuperacao;
                  }
                  alunoNota.nota = nota.vl_nota;
                } else {
                  alunoNota.nota = nota.vl_nota;
                }
                lancamentoNota.listaAlunoNotaAvaliacao.push(alunoNota);
              } else {
                lancamentoNota.listaAlunoNotaAvaliacao.push({
                  "idAluno": aluno.id,
                  "idConceito": nota.idConceito
                });
              }
            }
          });
        }
      });
      lancamentosNota.push(lancamentoNota);
    });

    this.diarioService.salvarNotas(this.filtrosService.instituicao.id, this.filtrosService.idPeriodoLetivo, this.filtrosService.turma.id,
      this.filtrosService.disciplina.id, this.filtrosService.divisao.id, lancamentosNota, this.filtrosService.turma.etapa.id).subscribe((data) => {
        this.houveModificacao = false;
        this.snackBar.open('Notas salvas com sucesso.', '', {
          duration: 5000,
          panelClass: ['md-success-toast-theme']
        });
        this.lista.forEach((aluno) => {
          aluno.modificado = false;
          if (aluno.resolverPendencia) {
            aluno.resolverPendencia = false;
            this.snackBar.open('Pendência resolvida com sucesso.', '', {
              duration: 5000,
              panelClass: ['md-success-toast-theme']
            });
            document.getElementById('aluno-id-' + aluno.id)?.scrollIntoView({
              behavior: "smooth",
              block: "start",
              inline: "nearest"
            });
          }
        });
      }, (error) => {
        var data = error.data;
        if (data !== null && data.error !== null && data.error.message !== null) {
          this.mostrarJanelaErro(data.error.message);
        }
      });
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
      minWidth: "300px",
      minHeight: "450px",
      data: {
        avaliacoes: this.avaliacoes,
        lista: this.lista,
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      let avaliacoesRest: any = [];
      data.forEach(function (aval: any) {
        aval.subAvaliacoes?.forEach(function (sub: any) {
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

      this.diarioService.salvarAvaliacoes(this.filtrosService.instituicao.id, this.filtrosService.divisao.id, this.filtrosService.turma.id,
        this.filtrosService.disciplina.id, avaliacoesRest, this.filtrosService.idEtapa).subscribe((data: any) => {
          this.avaliacoes = data;
          this.diarioService.obterAlunos(this.filtrosService.idInstituicao, this.filtrosService.idPeriodoLetivo, this.filtrosService.idTurma,
            this.filtrosService.idDisciplina, this.filtrosService.idDivisao, this.filtrosService.idEtapa).subscribe((dataAluno) => {
              this.lista = dataAluno;
              this.prepararAvaliacoes();
              this.obterSubAvaliacoes();
              this.calcularLarguras();
              this.snackBar.open('Avaliações salvas com sucesso.', '', {
                duration: 5000,
                panelClass: ['md-success-toast-theme']
              });
            });
        });
    });
  };

  calcularLarguras() {
    var larguraJanela = window.innerWidth;
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

    this.avaliacoes.forEach((aval) => {
      if (!this.habilitaBotaoSubDivisao && aval.flagPermiteSubTipo && aval.id != -1) {
        this.habilitaBotaoSubDivisao = true;
      }
      //total fake de aval de conceito
      if (aval.subAvaliacoes?.length > 0 && this.computaConceito) {
        var avalCopy = JSON.parse(JSON.stringify(aval));
        avalCopy.nome = "Total";
        avalCopy.totalConceito = true;
        aval.subAvaliacoes?.push(avalCopy);
      }
      //se nao tem subavaliacao cria uma para atender o layout
      if (!aval.subAvaliacoes?.length) {
        var avalCopy = JSON.parse(JSON.stringify(aval));
        avalCopy.nome = null;
        aval.subAvaliacoes?.push(avalCopy);
      }

      var index = 0;

      for (var index = 0; index < aval.subAvaliacoes?.length; index++) {
        aval.subAvaliacoes[index].isRecuperacao = false;
        if (aval.subAvaliacoes[index] && aval.subAvaliacoes[index].flPermiteRecuperacao === true) {
          var avalCopy = JSON.parse(JSON.stringify(aval.subAvaliacoes[index]));
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
      this.lista.forEach((aluno: any) => {
        aluno.remanejadoOuVeioDeRemanejamento = this.remanejadoOuVeioDeRemanejamento(aluno);
        this.ocultarNotaSeRemanejadoOuVeioDeRemanejamento(aluno);

        //atualiza notas dos alunos
        if (this.avaliacoes && this.avaliacoes.length > 0 && !this.computaConceito) {
          this.atualizarNota(aluno, false);
        }

        aluno.resultados.forEach((aval: any, k2: any) => {
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

  ocultarNotaSeRemanejadoOuVeioDeRemanejamento(aluno: any) {
    if (aluno.remanejadoOuVeioDeRemanejamento) {
      aluno.notas.forEach(function (nota: any) {
        nota.vl_nota = '';
        nota.vl_nota_recuperacao = '';
      });
    }
  }

  atualizarNota(aluno: any, controleModificacao: any) {
    aluno.notas.forEach((alunoNota: any) => {
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

  remanejadoOuVeioDeRemanejamento(aluno: any) {
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

  getNotaFinal(notas: any, quantidadeCasasDecimais: any) {
    var notaCalculada = 0;
    this.avaliacoes.forEach((aval) => {

      var notaAval = 0;
      var qtSubs = 0;
      aval.subAvaliacoes?.forEach((sub: any) => {
        if (!sub.isRecuperacao) {
          notaAval = notaAval + this.getNotaSubAvaliacao(notas, sub);
          qtSubs++;
        }
      })

      if (aval.tipoCalculoSubavaliacoes == 2 && notaAval && notaAval > 0) {
        notaAval = notaAval / qtSubs;
        var notaAvalAjustada = this.ajustarNumeroCasasDecimais('' + notaAval, quantidadeCasasDecimais);
        notaAval = parseFloat(notaAvalAjustada);
      }

      notaCalculada = notaCalculada + notaAval;
    })

    return Math.round(notaCalculada * 100) / 100;
  }

  obterSubAvaliacoes() {
    this.subAvaliacoes = [];
    this.avaliacoes.forEach(aval => {
      aval.subAvaliacoes?.forEach((sub: any) => {
        sub.nomeAvaliacao = aval.nome;
        this.subAvaliacoes.push(sub);
      });
    });
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

  alunoModificado(aluno: any) {
    this.houveModificacao = true;
    aluno.modificado = true;
  }

  ajustarNumeroCasasDecimais(num: any, dec: any) {
    var anum = num.split('.');
    var numnew;
    if (anum[1]) {
      numnew = anum[0] + '.' + anum[1].substring(0, dec);
    } else {
      numnew = anum[0];
    }
    return numnew;
  }

  getNotaSubAvaliacao(notas: any, sub: any) {
    var notaSub = 0;
    notas.forEach(function (nota: any) {
      if (sub.id === nota.id) {
        notaSub = nota.vl_nota_processada;
      }
    })
    return notaSub;
  }

  selecionarConceito() {
    this.houveModificacao = true;
    //this.modificado = true;
  };

  onchangeNota(avaliacao: any, nota: any, aluno: any, isRecuperacao: any) {
    const validarNota = (vl_nota: any) => {

      if (vl_nota === undefined || isNaN(Number(vl_nota))) {
        return null;
      } else if (vl_nota > avaliacao.notaMaxima || vl_nota < 0) {
        this.snackBar.open('Nota inválida', '', {
          duration: 5000,
          panelClass: ['md-error-toast-theme']
        });
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

  onchangeConceito(avaliacao: any, nota: any, aluno: any) {
    this.alunoModificado(aluno);
    // se tem somente uma avaliação e total o valor é atribuido automaticamente
    if (this.avaliacoes.length == 2 && aluno.notas.length == 2) {
      aluno.notas.forEach(function (alunoNota: any) {
        alunoNota.idConceito = nota.idConceito;
      });
    }
  }

  descartarAlteracoes(): void {
    this.diario?.close();

    this.dialog.open(DiarioComponent, {
      data: { divisao: this.filtrosService.divisao },
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%'
    });
  }

  ngOnDestroy(): void { }
}
