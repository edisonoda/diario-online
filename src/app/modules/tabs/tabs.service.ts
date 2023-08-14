import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject, of } from 'rxjs';
import { CORES } from 'src/app/core/constants';
import { SessaoService } from 'src/app/core/services/sessao.service';

@Injectable({
  providedIn: 'root'
})
export class TabsService {
  backendServerURL: string;

  private _selecionar = new Subject<{ etapa: string, dados: any }>();
  selecionar$: Observable<{ etapa: string, dados: any }> = this._selecionar.asObservable();

  constructor(
    private http: HttpClient,
    private sessaoService: SessaoService,
    private router: Router,
  ) {
    this.backendServerURL = this.sessaoService.backendServerURL ?? '';
  }

  passarEtapa(etapa: string, proxEtapa: string, dados: any, params: string): void {
    this._selecionar.next({ etapa, dados });
    this.router.navigate([proxEtapa], {
      queryParams: params.split('&').reduce((params: any, param) => {
        const [key, value] = param.split('=');
        params[key] = value;

        return params;
      }, {})
    });
  }

  getCols(): number {
    const width = window.innerWidth;

    if (width < 576)
      return 1;
    else if (width < 768)
      return 3;
    else if (width < 992)
      return 4;
    else
      return 6;
  }

  randomizarCores(list: any[]) {
    list.forEach(item => {
      if (!item.color) {
        // usa o id do item para definir a cor, sendo as cores um array com a quantidade de numeros decimais
        // possíveis [0...9]
        item.color = CORES[parseInt(`${item.ordem ? item.ordem : item.id}`.slice(-1))];
      }
    });
  };
}
