import { Component, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from 'moment';
import { DiarioService } from 'src/app/core/services/diario.service';
import { FiltrosService } from 'src/app/core/services/filtros.service';
import { ModalTrocaDivisaoComponent } from '../../modal-troca-divisao/modal-troca-divisao.component';
import { ModalParaDataComponent } from '../modal-para-data/modal-para-data.component';
import { DialogConfirmacao } from 'src/app/shared/components/dialog-confirmacao/dialog-confirmacao.component';
import { ModalNovoDiaComponent } from '../modal-novo-dia/modal-novo-dia.component';
import { SessaoService } from 'src/app/core/services/sessao.service';

@Component({
  selector: 'app-tabela-frequencia',
  templateUrl: './tabela.component.html',
  styleUrls: ['./tabela.component.css'],
})
export class TabelaFrequenciaComponent implements OnInit, OnDestroy {
  @Input() lista: any[] = [];
  @Input() aulas: any[] = [];

  houveModificacao: boolean = false;
  aulaEditada: any = null;
  exibirDiaAula: boolean = false;
  idFreq: number = 0;
  indiceAtivo: number = -1;

  quantAulasTelaMax: number = 0; // Maximo de aulas na tela
  indiceInicial: number = 0; // Primeira aula visivel na tela
  botaoEsquerda: boolean = false; // Indica se os botoes de navegação estarão habilitados
  botaoDireita: boolean = false;
  deveDesabilitarBotaoNovoDiaDeAula: boolean = false;

  frequenciaDiaria: number = 0;
  totalAulasLancadasDiario: number = 0;
  possuiDiferencaAulasLecionadas: boolean = false;
  numeroMaxDeAulasPorDia: number = 0;

  permissoes: string[] = [];

  divisao: any;

  @HostListener('window:resize', ['$event'])
  onResize(event?: any) {
    this.calcularLarguras();
  }

  constructor(
    public dialog: MatDialog,
    private filtrosService: FiltrosService,
    private sessaoService: SessaoService,
    private diarioService: DiarioService,
    private snackBar: MatSnackBar
  ) {
    this.initAlunos();
    this.diarioService.buscarNumeroMaxDeAulasPorDia().subscribe(res => {
      this.numeroMaxDeAulasPorDia = res.data;
    });

    this.idFreq = this.aulas !== null && this.aulas !== undefined ? this.aulas.length : 0;
    if (this.sessaoService.permissoes)
      this.permissoes = JSON.parse(this.sessaoService.permissoes);
  }

  ngOnInit() {
    this.filtrosService.obterDivisao().subscribe(res => {
      this.divisao = res.data;
    });
  }

  initAlunos(): void {
    this.lista.forEach(aluno => {
      aluno.frequencia.forEach((freq: any) => {
        freq.desabilitado = !habilitarFrequencia(aluno, freq);
        freq.indisponivel = this.dataAulaIndisponivel(freq.dataAula, aluno.dataEnturmacao, aluno.dataEncerramento, aluno.dataRemanejamento);
      });

      function habilitarFrequencia(aluno: any, freq: any) {
        var retorno = false;
        switch (aluno.status) {
          case "D":
            retorno = false;
            break;
          case "A":
            retorno = aluno.dataEnturmacao &&
              moment(freq.dataAula).isSameOrAfter(moment(aluno.dataEnturmacao));
            break;
          case "E":
            retorno = aluno.dataEncerramento && aluno.dataEnturmacao &&
              moment(freq.dataAula).isSameOrBefore(moment(aluno.dataEncerramento)) &&
              moment(freq.dataAula).isSameOrAfter(moment(aluno.dataEnturmacao));
            break;
          case "R":
            retorno = aluno.dataRemanejamento && aluno.dataEnturmacao &&
              moment(freq.dataAula).isSameOrBefore(moment(aluno.dataRemanejamento)) &&
              moment(freq.dataAula).isSameOrAfter(moment(aluno.dataEnturmacao));
            break;

          default:
            retorno = false;
            break;
        }

        return retorno;
      }

      if (aluno.resolverPendencia) {
        document.getElementById('aluno-id-' + aluno.id)?.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest"
        });
      }

      // calcula as faltas
      this.contarFaltas(aluno);

      if (aluno.qtdFaltasVeioRest == null) {
        aluno.qtdFaltasVeioRest = 0;
      }
      if (aluno.qtdFaltasDiario == null) {
        aluno.qtdFaltasDiario = 0;
      }
      aluno.totalFaltaInconsistente = aluno.qtdFaltasVeioRest == null || (aluno.qtdFaltasVeioRest !== aluno.qtdFaltasDiario);
    });
  }

  alunoModificado(aluno: any): void {
    this.houveModificacao = true;
    aluno.modificado = true;
  };

  contarFaltas(al: any): void {
    if (al.frequencia && al.frequencia.length > 0) {
      var faltasPorDia = al.frequencia.map((alunoFrequencia: any) => {
        return alunoFrequencia.flPresente === false ? 1 : 0;
      });

      al.qtdFaltasDiario = faltasPorDia.reduce((a: number, b: number) => {
        return a + b;
      });
    }
  }

  atualizarFaltas(al: any) {
    if (al.frequencia && al.frequencia.length > 0) {
      this.contarFaltas(al);
    } else if (al.frequencia.length == 0) {
      al.qtdFaltasDiario = 0;
    }

    al.qtdFaltasVeioRest = al.totalFaltaInconsistente
      ? al.qtdFaltasDiario + al.qtdFaltasUltimoRemanejamento
      : al.qtdFaltasDiario;
  }

  dataAulaIndisponivel(dataAula: Date | string, dataEnturmacao: Date | string, dataEncerramento: Date | string, dataRemanejamento: Date | string) {
    return moment(dataAula).isBefore(dataEnturmacao) || moment(dataAula).isAfter(dataEncerramento) || moment(dataAula).isAfter(dataRemanejamento);
  }

  calcularLarguras() {
    var larguraJanela = window.innerWidth;
    var larguraTabela = larguraJanela > 1167 ? 1134 : (larguraJanela - 33); // 17 + 16
    var larguraItensFixos = 23 + 23 + 35; // O, S e Total
    var larguraAula = 50;
    var larguraMinimaNome = larguraTabela / 2; //50%
    var largTempNome = larguraTabela - larguraItensFixos;
    var quantAulasTelaMax = 0;

    while (largTempNome > larguraMinimaNome) { // Descobre o máximo de aulas possiveis, mantendo a largura minima do nome
      largTempNome -= larguraAula;
      quantAulasTelaMax++;
    }
    quantAulasTelaMax--;

    this.quantAulasTelaMax = quantAulasTelaMax;

    this.calcularBotoesAtivos();
  }

  calcularBotoesAtivos() {
    var totalAulas = this.aulas !== null && this.aulas !== undefined ? this.aulas.length : 0;

    if (totalAulas <= this.quantAulasTelaMax) { // Se todos estão visiveis, o indice deve ser zero
      this.indiceInicial = 0;
    } else { // ao aumentar a janela, tentamos manter o indice, caso não seja grande demais
      if ((this.indiceInicial + this.quantAulasTelaMax) > totalAulas) {
        this.indiceInicial = totalAulas - this.quantAulasTelaMax;
      }
    }
    var aulasS = this.aulas !== null && this.aulas !== undefined ? this.aulas.length : 0;
    this.botaoEsquerda = this.indiceInicial > 0;
    this.botaoDireita = (this.indiceInicial + this.quantAulasTelaMax) < aulasS;
    this.deveDesabilitarBotaoNovoDiaDeAula = this.divisao.tipoAvaliacao == 'A';
  }

  rolarFrequencia(direcao: string): void {
    if (direcao === 'esq') {
      this.indiceInicial--;
    } else {
      this.indiceInicial++;
    }

    this.calcularBotoesAtivos();
  }

  /*
   * Mostra uma aula na tela. Útil caso exista rolagem de aulas
   * - Se estiver sem parametros, mostra a aula mais proxima da data corrente (ou deveria ser a última?)
   * - Se tiver indice, mostra-lo o mais proximo do meio da tela possivel
   */
  mostrarAulaNaTela(indice: number) {
    var quantAulasTelaMax = this.quantAulasTelaMax;
    var indiceInicial = this.indiceInicial;

    if (indice !== null) {
      if (indice < indiceInicial) {
        this.indiceInicial = indice;
      } else if (indice >= (indiceInicial + quantAulasTelaMax)) {
        this.indiceInicial = (indice - quantAulasTelaMax) + 1;
      }
    }

    this.calcularBotoesAtivos();
  }

  ativarAula(data: any, indice: number, novoDiaAula: boolean): void {
    this.indiceAtivo = indice;
    this.aulaEditada = data;

    this.lista.filter(aluno => {
      return data
        && aluno.status !== 'D'
        && moment(data.data).isSameOrAfter(moment(aluno.dataEnturmacao))
        && (aluno.status === 'A'
          || (aluno.status === 'E'
            && moment(data.data).isBefore(moment(aluno.dataEncerramento)))
          || (aluno.status === 'R'
            && moment(data.data).isBefore(moment(aluno.dataRemanejamento))))
    }).forEach(aluno => {
      var encontrouData = false;

      aluno.frequencia.forEach((frequencia: any) => {
        if (data && frequencia.programacaoDivisaoAulaId === data.id) {
          encontrouData = true;
        }

        // habilita lancamento se for a data selecionada
        frequencia.desabilitado = aluno.status !== 'A' || !data || frequencia.programacaoDivisaoAulaId != data.id;
        if (!frequencia.desabilitado) {
          frequencia.flPresente = frequencia.flPresente !== null ? frequencia.flPresente : data.presencaDefault;
        }
      });

      if (data && !encontrouData) {
        var dataDia = {
          flPresente: null,
          ordem: data.ordem,
          programacaoDivisaoAulaId: data.id,
          desabilitado: (aluno.status !== 'A')
        };

        // quando uma nova aula é criada, ela pode ter um valor default de presença
        if (data != null) {
          dataDia.flPresente = data.presencaDefault;

          if (aluno.totalFaltaInconsistente) {
            this.contarFaltas(aluno);
            aluno.totalFaltaInconsistente = aluno.qtdFaltasVeioRest !== aluno.qtdFaltasDiario;
          }

          if (!novoDiaAula) {
            this.alunoModificado(aluno);
          }
        };

        aluno.frequencia.push(dataDia);
        this.atualizarFaltas(aluno);
      }
    });
  }

  focarPersistencia(): void {
    // Scroll até o btn de salvar
    // $location.hash('botaoSalvarFrequencia');

    this.snackBar.open('Salve antes de prosseguir.');
  }

  adicionarAula(programacaoDivisaoAula: any, indice: number): void {
    if (!this.divisao.aulasLecionadas) {
      this.divisao.aulasLecionadas = 0;
    }

    this.divisao.aulasLecionadas += 1;
    this.totalAulasLancadasDiario += 1;

    this.ativarAula(programacaoDivisaoAula, indice, true);

    this.idFreq++;

    this.mostrarAulaNaTela(indice);

    this.onResize();
  }

  trocarDivisao(ev: Event): void {
    const dialogRef = this.dialog.open(ModalTrocaDivisaoComponent, {
      minWidth: "300px",
      maxWidth: "800px",
      minHeight: "130px",
      maxHeight: "810px",
      data: {
        divisao: this.divisao
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.divisao = result;
    });
  }

  irParaData(ev: Event): void {
    const dialogRef = this.dialog.open(ModalParaDataComponent, {
      minWidth: "200px",
      maxWidth: "300px",
      minHeight: "80px",
      maxHeight: "200px",
      data: {
        listaDias: this.aulas.map(a => {
          return a.data;
        })
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== null) {
        function isDataSelecionada(element: any) {
          var aulaMoment = moment(element.data, 'YYYY-MM-DD', true);
          return aulaMoment.isSame(result, 'day') &&
            aulaMoment.isSame(result, 'month') &&
            aulaMoment.isSame(result, 'year');
        };

        var indice = this.aulas.findIndex(isDataSelecionada);

        if (indice !== null && indice >= 0) {
          this.ativarAula(this.aulas[indice], indice, false);
          this.mostrarAulaNaTela(indice);
        }
      }
    });
  }

  removerAula(ev: Event, aula: any, indice: number) {
    const dialogRef = this.dialog.open(DialogConfirmacao, {
      data: {
        descricao: 'Deseja realmente excluir a aula?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.diarioService.removerDiaAula(this.filtrosService.idInstituicao, aula.id, this.filtrosService.idTurma, this.filtrosService.idDisciplina, this.filtrosService.idEtapa, this.filtrosService.idDivisao).subscribe(res => {
          if (res.error)
            return;
    
          this.divisao.aulasLecionadas -= 1;
          this.totalAulasLancadasDiario -= 1;
    
          var dataAula = this.aulas.splice(indice, 1)[0];
    
          this.possuiDiferencaAulasLecionadas = false;
    
          if (this.aulas != null && this.aulas.length > 0) {
            this.possuiDiferencaAulasLecionadas = this.divisao.aulasLecionadas !== this.aulas.length;
          }
    
          this.lista.forEach(aluno => {
            aluno.frequencia = aluno.frequencia.filter(function (fr: any) {
              return fr.programacaoDivisaoAulaId !== dataAula.id
            });
          });
    
          this.lista.forEach(aluno => {
            this.atualizarFaltas(aluno);
    
            if (aluno.totalFaltaInconsistente) {
              aluno.totalFaltaInconsistente = aluno.qtdFaltasVeioRest !== aluno.qtdFaltasDiario;
            }
          });
    
          // atualiza as ordens (já é feito no backend)
          this.aulas.filter(function (aula) {
            return moment(aula.data, 'YYYY-MM-DD', true).isSame(dataAula.data) &&
              aula.ordem > dataAula.ordem
          }).forEach(function (data) {
            data.ordem = data.ordem - 1;
          });
    
          this.onResize();
          this.snackBar.open('Aula removida com sucesso.');
        });
      }
    });
  }

  adicionarAulaNovoDia(ev: Event): void {
    const dialogRef = this.dialog.open(ModalNovoDiaComponent, {
      minWidth: "300px",
      maxWidth: "800px",
      minHeight: "130px",
      maxHeight: "810px",
    });

    dialogRef.afterClosed().subscribe(dataAula => {
      var dataInformada = new Date(dataAula);

      if (this.diaJaAtingiuLimiteDeAula(dataInformada)) {
        this.snackBar.open('Número máximo de aulas diárias atingido.');
        return;
      }

      this.diarioService.criarNovoDiaAula(this.filtrosService.idInstituicao, this.filtrosService.idTurma, this.filtrosService.idDisciplina, this.filtrosService.idDivisao, dataInformada, this.filtrosService.idEtapa).subscribe(res => {
        if (res.error) {
          this.snackBar.open('Mensagem de erro do sistema: ' + res.error.message);
          return;
        }

        var i;
        res.data = moment(res.data).format('YYYY-MM-DD');

        if (this.aulas && this.aulas !== undefined) {
          for (i = 0; i < this.aulas.length; i++) {
            if (moment(this.aulas[i].data).isAfter(moment(res.data))) {
              break;
            }
          }

          this.aulas.splice(i, 0, res);
        } else {
          i = 0;
          this.aulas = [];
          this.aulas.push(res);
        }

        // Se for o primeiro, deixa retornar -1 mesmo
        this.adicionarAula(res, i);

        this.possuiDiferencaAulasLecionadas = false;
        if (this.aulas != null && this.aulas.length > 0) {
          this.possuiDiferencaAulasLecionadas = this.divisao.aulasLecionadas !== this.aulas.length;
        }

        this.lista.forEach(aluno => {
          if (aluno.totalFaltaInconsistente) {
            aluno.totalFaltaInconsistente = aluno.qtdFaltasVeioRest !== aluno.qtdFaltasDiario;
          }
        });

        this.houveModificacao = true;

        this.snackBar.open('Nova aula criada para o dia ' + moment(dataAula).format('dd/MM/yyyy') + '.');
      });
    });
  }

  diaJaAtingiuLimiteDeAula(dataInformada: any): boolean {
    return this.aulas
      && this.aulas !== undefined
      && this.getNumeroDeAulasNoDia(dataInformada).length >= this.numeroMaxDeAulasPorDia;
  };

  getNumeroDeAulasNoDia(dataInformada: any): any[] {
    return this.aulas.filter(function (aula) {
      return moment(aula.data, 'YYYY-MM-DD', true).isSame(dataInformada)
        || moment(aula.data).isSame(dataInformada)
    });
  }

  dialogPlanoAula(ev: Event, aula: any): void {
    const dialogRef = this.dialog.open(ModalNovoDiaComponent, {
      maxWidth: "500px",
      maxHeight: "900px",
    });

    dialogRef.afterClosed().subscribe(dataAula => {
      this.diarioService.salvarPlanoAula(this.filtrosService.idInstituicao, dataAula.id, this.filtrosService.idTurma, this.filtrosService.idDisciplina, dataAula.conteudo, dataAula.modulo,
        this.filtrosService.idEtapa, dataAula.recuperacaoParalela).subscribe(res => {
          if (res.error)
            return;

          this.snackBar.open('Diário de Conteúdo atualizado para o dia ' + moment(aula.data).format('dd/MM/yyyy') + '.');
        });
    });
  }

  salvarDiaAula(): void {
    var lancamentosFrequencia: any[] = [];

    this.lista.forEach(aluno => {
      aluno.frequencia.forEach((frequencia: any) => {
        if (frequencia.programacaoDivisaoAulaId === this.aulaEditada.id) {
          lancamentosFrequencia.push({
            idAluno: aluno.id,
            foiModificado: aluno.modificado,
            flPresente: frequencia.flPresente,
            modificaTotalFaltas: !aluno.totalFaltaInconsistente
          });
        }
      });
    });

    this.aulaEditada.data = moment(this.aulaEditada.data, 'YYYY-MM-DD', true).toDate();

    this.diarioService.salvarDiaAula(this.filtrosService.idInstituicao, this.filtrosService.idPeriodoLetivo, this.filtrosService.idTurma,
      this.filtrosService.idDisciplina, this.filtrosService.idDivisao, this.aulaEditada, lancamentosFrequencia, this.filtrosService.idEtapa).subscribe(res => {
        if (res.error)
          return;

        this.snackBar.open('Frequências salvas com sucesso.');
        this.houveModificacao = false;
        this.ativarAula(null, -1, false);

        this.lista.forEach(aluno => {
          if (aluno.resolverPendencia) {
            aluno.resolverPendencia = false;
            this.snackBar.open('Pendência resolvida com sucesso.');
          }
          if (aluno.totalFaltaInconsistente) {
            aluno.totalFaltaInconsistente = aluno.qtdFaltasVeioRest !== aluno.qtdFaltasDiario;
          }

          aluno.modificado = false;
        });
      });
  }

  corrigirTotalFaltas(ev: Event, aluno: any): void {
    const dialogRef = this.dialog.open(DialogConfirmacao, {
      data: {
        descricao: 'Deseja realmente alterar o total de ' + aluno.qtdFaltasVeioRest + ' falta(s) para ' + aluno.qtdFaltasDiario + ' falta(s) conforme os lançamentos do Diário Online?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.diarioService.corrigirTotalFaltas(this.filtrosService.idInstituicao, this.filtrosService.idPeriodoLetivo, this.filtrosService.idTurma, this.filtrosService.idDisciplina,
          this.filtrosService.idDivisao, this.filtrosService.idEtapa, aluno.id, aluno.qtdFaltasVeioRest, aluno.qtdFaltasDiario, aluno.indice)
          .subscribe(res => {
            if (res.error)
              return;
    
            aluno.qtdFaltasVeioRest = aluno.qtdFaltasDiario;
    
            this.snackBar.open('Total de faltas corrigido com sucesso.');
          });
      }
    });
  }

  ngOnDestroy(): void { }
}
