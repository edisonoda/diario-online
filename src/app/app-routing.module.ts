import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './core/auth/auth.component';

import { canActivateLogin } from './core/guards/autenticacao.guard';
import { TabsComponent } from './modules/tabs/tabs.component';

const routes: Routes = [
  {
    path: '',
    component: TabsComponent,
    canActivate: [canActivateLogin],
    loadChildren: () => import('./modules/tabs/tabs.module').then((m) => m.TabsModule)
  },
  {
    path: 'login',
    component: AuthComponent,
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
