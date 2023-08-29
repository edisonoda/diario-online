import { Observable, throwError } from 'rxjs';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, tap } from 'rxjs/operators';
import { SessaoService } from '../../services/sessao.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoaderService } from '../loader/loader.service';
import { LoadingService } from 'src/app/shared/components/loader-geral/loader-geral.service';

@Injectable({
  providedIn: 'root'
})
export class TratamentoErrosService implements HttpInterceptor {
  constructor(
    private sessaoService: SessaoService,
    private loadingService: LoadingService,
    private snackBar: MatSnackBar,
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request)
      .pipe(
        tap(evt => {
          if (evt instanceof HttpResponse && evt.body.erro)
              this.snackBar.open(evt.body.erro, '', {
                duration: 5000,
                panelClass: ['md-error-toast-theme']
              });
        }),
        catchError(error => {
          return this.handleResponseError(error, request);
        })
      );
  }

  handleResponseError(error: HttpErrorResponse, request: HttpRequest<any>): Observable<never> {
    if (error.error instanceof Error) {
      this.snackBar.open(`Ocorreu um erro: ${error.error.message}`, '', {
        duration: 5000,
        panelClass: ['md-error-toast-theme']
      });
    } else {
      this.snackBar.open(`O servidor retornou um erro: ${error.status} - ${error.error.message}`, '', {
        duration: 5000,
        panelClass: ['md-error-toast-theme']
      });
    }

    this.loadingService.setLoading(false, request.url);

    return throwError(() => error);
  }
}
