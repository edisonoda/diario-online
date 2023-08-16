import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NotNullPipeModule } from 'src/app/shared/pipes/not-null.module';

import { DiarioComponent } from './diario.component';

import { FrequenciaComponent } from './frequencia/frequencia.component';
import { AvaliacoesComponent } from './avaliacoes/avaliacoes.component';

import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { TabelaFrequenciaComponent } from './frequencia/tabela/tabela.component';
import { ModalTrocaDivisaoComponent } from './modal-troca-divisao/modal-troca-divisao.component';
import { ModalParaDataComponent } from './frequencia/modal-para-data/modal-para-data.component';
import { ModalNovoDiaComponent } from './frequencia/modal-novo-dia/modal-novo-dia.component';
import { ModalPlanoAulaComponent } from './frequencia/modal-plano-aula/modal-plano-aula.component';
import { ModalAulasComponent } from './avaliacoes/modal-aulas/modal-aulas.component';
import { ModalErroComponent } from './avaliacoes/modal-erro/modal-erro.component';
import { ModalGerenciarAulaComponent } from './avaliacoes/modal-gerenciar-aula/modal-gerenciar-aula.component';

@NgModule({
  declarations: [
    DiarioComponent,
    FrequenciaComponent,
    AvaliacoesComponent,

    TabelaFrequenciaComponent,
    ModalTrocaDivisaoComponent,
    ModalParaDataComponent,
    ModalNovoDiaComponent,
    ModalPlanoAulaComponent,
    ModalAulasComponent,
    ModalErroComponent,
    ModalGerenciarAulaComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NotNullPipeModule,

    MatTabsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatDialogModule,
    MatMenuModule,
    MatSelectModule,
    MatDatepickerModule,
  ],
  exports: [DiarioComponent]
})
export class DiarioModule { }
