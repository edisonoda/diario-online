import { Component, OnInit } from '@angular/core';
import { SessaoService } from '../services/sessao.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  constructor(private sessaoService: SessaoService) { }

  ngOnInit(): void { }

  sair(): void {
    this.sessaoService.logout();
  }
}
