import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-botao-chamada',
  templateUrl: './botao-chamada.component.html',
  styleUrls: ['./botao-chamada.component.css'],
})
export class BotaoChamadaComponent implements OnInit, OnDestroy {
  @Input() aula: any;
  @Input() disabled: boolean = false;

  @Output() atualizarFaltas: EventEmitter<void> = new EventEmitter();
  @Output() alunoModificado: EventEmitter<void> = new EventEmitter();

  letra: string = '&nbsp;';
  classe: string = 'vazio';
  descricao: string = '';

  girando: boolean = false;

  constructor() {
    this.atualizarHtml(this.configAtual());
  }

  ngOnInit() { }

  proximoEstado() {
    return this.aula.flPresente ? false : true;
  }

  // Configuração do que aparece na tela (letra, cor, estilo)
  configAtual() {
      console.log(this.aula)
      var letra, descricao;
      if (this.aula.flPresente === null || this.aula.flPresente === undefined) {
        letra = '&nbsp;';
        this.classe = 'vazio';
      } else if (this.aula.flPresente) {
        letra = 'P';
        this.classe = 'presente';
        descricao = 'Presente';
      } else if (!this.aula.flPresente) {
        letra = 'F';
        this.classe = 'falta';
        descricao = 'Faltou';
      }
      return { letra, descricao };
  }

  atualizarHtml(config: any) {
    this.letra = config.letra;
    this.descricao = config.descricao;
  }

  flipAula() {
      this.aula.flPresente = this.proximoEstado();
      var config = this.configAtual();

      this.girando = true;
      setTimeout(() => {
        this.girando = false;
        this.atualizarHtml(config);
        this.atualizarFaltas.emit();
        this.alunoModificado.emit();
      }, 120);
  };

  ngOnDestroy(): void { }
}
