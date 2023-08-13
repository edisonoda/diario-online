import { TratamentoErrosService } from './tratamento-erros.service';
import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  imports: [
    MatSnackBarModule
  ],
  providers: [
    TratamentoErrosService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TratamentoErrosService,
      multi: true,
    },
  ],
})
export class TratamentoErrosModule { }
