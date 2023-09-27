import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './core/auth/auth.component';

import { TabsComponent } from './modules/tabs/tabs.component';

const routes: Routes = [
  {
    path: 'api/login',
    component: AuthComponent,
  },
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: 'site/turma',
        pathMatch: 'full',
      },
      {
        path: 'site/:tab',
        component: TabsComponent,
        loadChildren: () => import('./modules/tabs/tabs.module').then((m) => m.TabsModule)
      },
    ]
  }
];

export class AppRoutingModule {
  static routing: ModuleWithProviders<RouterModule> =
    RouterModule.forRoot(routes);
}
