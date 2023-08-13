import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TabRoutingModule } from './tabs-routing.module';
import { TabsComponent } from './tabs.component';
import { TurmasComponent } from './turmas/turmas.component';

import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    TabsComponent,

    TurmasComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    TabRoutingModule,
    FormsModule,
    ReactiveFormsModule,

    MatTabsModule,
    MatInputModule,
    MatFormFieldModule,
    MatGridListModule,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
  ],
  exports: [TabsComponent]
})
export class TabsModule { }
