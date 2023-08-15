import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './core/auth/auth.component';

import { canActivateLogin } from './core/guards/autenticacao.guard';
import { TabsComponent } from './modules/tabs/tabs.component';

const routes: Routes = [
  {
    path: 'site/:tab',
    component: TabsComponent,
    // canActivate: [canActivateLogin],
    loadChildren: () => import('./modules/tabs/tabs.module').then((m) => m.TabsModule)
  },
  {
    path: 'site/login',
    component: AuthComponent,
  },
  {
    path: '#/site/:tab',
    redirectTo: 'login',
  },
  {
    path: '#/site/login',
    redirectTo: 'login',
  },
  {
    path: '**',
    redirectTo: 'turma',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
