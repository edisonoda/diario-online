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
  entry: any;

  constructor(
    private sessaoService: SessaoService,
    private aesUtilService: AesUtilService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.entry = this.activatedRoute.snapshot.queryParamMap.get('entry');

    if (!this.entry)
      this.sessaoService.logout();
  }

  ngOnInit(): void {
    let decodedEntry: any = JSON.parse(this.aesUtilService.decrypt(decodeURIComponent(this.entry.toString())));
    console.log(decodedEntry)
    if (decodedEntry) {
      console.log(decodedEntry.token)
      this.sessaoService.buscarUser(decodedEntry.token, decodedEntry.backendServerURL, decodedEntry.idGrupoAcesso).subscribe(res => {
        console.log(res)
        this.sessaoService.setUserInfo({
          user: res.user,
          token: decodedEntry.token,
          backendServerURL: decodedEntry.backendServerURL,
          logoutURL: decodedEntry.logoutURL ? `${decodedEntry.logoutURL}/inicio.faces` : `${decodedEntry.backendServerURL.split('/rest')[0]}/inicio.faces`,
          idGrupoAcesso: decodedEntry.idGrupoAcesso,
          listaPermissao: res.listaPermissao
        });

        this.router.navigate(['site', 'turmas'], {
          queryParams: {
            idInstituicao: decodedEntry.idInstituicao,
            idPeriodoLetivo: decodedEntry.idPeriodoLetivo
          }
        });
      });
    }
  }
}
