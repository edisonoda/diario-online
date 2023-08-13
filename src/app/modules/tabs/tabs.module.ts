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
  ],
  exports: [TabsComponent]
})
export class TabsModule { }
