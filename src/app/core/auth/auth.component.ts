import { Component, OnInit } from '@angular/core';
import { SessaoService } from '../services/sessao.service';
import { AesUtilService } from '../services/aes-util.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  template: `
    <mat-card>
      <mat-card-content>Aguarde... Redirecionando para o Diário Online</mat-card-content>
    </mat-card>
  `
})
export class AuthComponent implements OnInit {
  constructor(
    private sessaoService: SessaoService,
    private aesUtilService: AesUtilService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    try {
      const decodedEntry = JSON.parse(this.aesUtilService.decrypt(decodeURIComponent(this.activatedRoute.snapshot.params['entry'])));

      if (decodedEntry.token !== this.sessaoService.token) {
        this.sessaoService.buscarUser().subscribe(res => {
          this.sessaoService.setUserInfo({
            user: res.user,
            token: decodedEntry.token,
            backendServerURL: decodedEntry.backendServerURL,
            logoutURL: decodedEntry.logoutURL ? `${decodedEntry.logoutURL}/inicio.faces` : `${decodedEntry.backendServerURL.split('/rest')[0]}/inicio.faces`,
            idGrupoAcesso: decodedEntry.idGrupoAcesso,
          });

          this.router.navigate(['turmas'], {
            queryParams: {
              idInstituicao: decodedEntry.idInstituicao,
              idPeriodoLetivo: decodedEntry.idPeriodoLetivo
            }
          });
        });
      } else {
        this.sessaoService.logout();
      }
    } catch {
      this.sessaoService.logout();
    }
  }
}
