import { Component, OnInit } from '@angular/core';
import { CONFIGURACOES } from '../../constants';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  dataAtualizacao = CONFIGURACOES.DATA_VERSAO;

  constructor() { }

  ngOnInit(): void { }
}
