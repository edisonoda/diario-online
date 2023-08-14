import { GetFiltro } from './get-filtros.service';
import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

@NgModule({
  providers: [
    GetFiltro,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: GetFiltro,
      multi: true,
    },
  ],
})

export class GetFiltroModule { }
