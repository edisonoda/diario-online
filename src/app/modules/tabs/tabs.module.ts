import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DiarioModule } from '../diario/diario.module';
import { TabsComponent } from './tabs.component';
import { TurmasComponent } from './turmas/turmas.component';
import { DisciplinasComponent } from './disciplinas/disciplinas.component';
import { DivisoesComponent } from './divisoes/divisoes.component';
import {ModalPendenciaAvaliacaoComponent} from './modal-pendencia-avaliacao/modal-pendencia-avaliacao.component';
import {ModalPendenciaAvaliacaoAlunoComponent} from './modal-pendencia-avaliacao-aluno/modal-pendencia-avaliacao-aluno.component';

import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import {NotNullPipeModule} from "../../shared/pipes/not-null.module";

@NgModule({
  declarations: [
    TabsComponent,

    TurmasComponent,
    DisciplinasComponent,
    DivisoesComponent,
    ModalPendenciaAvaliacaoComponent,
    ModalPendenciaAvaliacaoAlunoComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,

    DiarioModule,

    MatTabsModule,
    MatInputModule,
    MatFormFieldModule,
    MatGridListModule,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
    MatSnackBarModule,
    MatDialogModule,
    MatMenuModule,
    NotNullPipeModule,
  ],
  exports: [TabsComponent]
})
export class TabsModule { }
