import { Component, OnInit } from '@angular/core';
import { SessaoService } from '../services/sessao.service';
import { AesUtilService } from '../services/aes-util.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: 'auth.component.html',
  styleUrls: ['auth.component.css']
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
    } catch {
      this.sessaoService.logout();
    }
  }
}
