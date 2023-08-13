import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TurmasComponent } from './turmas/turmas.component';
import { DisciplinasComponent } from './disciplinas/disciplinas.component';

const routes: Routes = [
  {
    path: 'turma',
    component: TurmasComponent
  },
  {
    path: 'disciplina',
    component: DisciplinasComponent
  },
  {
    path: '**',
    redirectTo: 'turma',
  },
];
@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabRoutingModule { }
