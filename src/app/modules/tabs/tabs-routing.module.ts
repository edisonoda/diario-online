import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TurmasComponent } from './turmas/turmas.component';

const routes: Routes = [
  {
    path: 'turmas',
    component: TurmasComponent
  },
  {
    path: '**',
    redirectTo: 'turmas',
  },
];
@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabRoutingModule { }
