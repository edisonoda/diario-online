import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.css'],
})
export class TabsComponent implements OnInit, OnDestroy {
  navLinks = [
    { link: 'turmas', label: 'Turmas' },
    { link: 'disciplina', label: 'Disciplina' },
    { link: 'divisao', label: 'Divisão'}
  ];
  
  constructor() { }

  ngOnInit() { }

  ngOnDestroy(): void { }
}