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
import { TabelaFrequenciaComponent } from './frequencia/tabela/tabela.component';

@NgModule({
  declarations: [
    DiarioComponent,
    FrequenciaComponent,
    AvaliacoesComponent,

    TabelaFrequenciaComponent,
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
  ],
  exports: [DiarioComponent]
})
export class DiarioModule { }
