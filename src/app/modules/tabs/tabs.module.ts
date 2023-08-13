import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsComponent } from './tabs.component';
import { RouterModule } from '@angular/router';

import { MatTabsModule } from '@angular/material/tabs';
import { TabRoutingModule } from './tabs-routing.module';
import { TurmasComponent } from './turmas/turmas.component';

@NgModule({
  declarations: [
    TabsComponent,

    TurmasComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    TabRoutingModule,

    MatTabsModule,
  ],
  exports: [TabsComponent]
})
export class TabsModule { }
