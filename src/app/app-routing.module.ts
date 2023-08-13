import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './core/auth/auth.component';

import { TurmasComponent } from './modules/turmas/turmas.component';
import { canActivateLogin } from './core/guards/autenticacao.guard';

const routes: Routes = [
  {
    path: 'login/:entry',
    component: AuthComponent,
  },
  {
    path: '',
    canActivateChild: [canActivateLogin],
    children: [
      {
        path: 'turmas',
        component: TurmasComponent,
      },
    ]
  },
  {
    path: '**',
    redirectTo: '404',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
