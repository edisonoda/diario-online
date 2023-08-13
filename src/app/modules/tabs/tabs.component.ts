import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.css'],
})
export class TabsComponent implements OnInit, OnDestroy {
  navLinks = [
    { link: 'turma', label: 'Turmas' },
    { link: 'disciplina', label: 'Disciplina' },
    { link: 'divisao', label: 'Divisão'}
  ];

  instituicao: any;
  periodo: any;
  abas: any;

  constructor() { }

  ngOnInit() { }

  ngOnDestroy(): void { }
}
