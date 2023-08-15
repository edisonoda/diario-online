import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import * as moment from 'moment';
import 'moment/locale/pt-br';
import localePt from '@angular/common/locales/pt';
import { registerLocaleData } from '@angular/common';

moment.locale('pt-br');
registerLocaleData(localePt, 'pt-br');

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';

import { AppComponent } from './app.component';
import { HeaderComponent } from './core/layout/header/header.component';
import { FooterComponent } from './core/layout/footer/footer.component';
import { AuthComponent } from './core/auth/auth.component';

import { MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { HeaderInterceptorModule } from './core/interceptors/header/header.module';
import { TratamentoErrosModule } from './core/interceptors/tratamento-erros/tratamento-erros.module';
import { HttpClientModule, HttpClientXsrfModule } from '@angular/common/http';
import { InterceptorLoaderModule } from './core/interceptors/loader/loader.module';
import { GetFiltroModule } from './core/interceptors/get-filtros/get-filtro.module';

const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY-MM-DD',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  },
};

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    AuthComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule.routing,
    BrowserAnimationsModule,
    NgbModule,
    HttpClientModule,
    HttpClientXsrfModule,

    // HeaderInterceptorModule,
    // TratamentoErrosModule,
    InterceptorLoaderModule,
    GetFiltroModule,

    MatToolbarModule,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
    MatCardModule,
    MatDialogModule,
  ],
  providers: [
    [
      { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
      { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    ]
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
