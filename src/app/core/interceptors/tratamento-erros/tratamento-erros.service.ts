import { Observable, throwError } from 'rxjs';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { SessaoService } from '../../services/sessao.service';

@Injectable({
  providedIn: 'root'
})
export class TratamentoErrosService implements HttpInterceptor {
  constructor(
    private sessaoService: SessaoService
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request)
      .pipe(
        catchError(error => {
          return this.handleResponseError(error);
        })
      );
  }

  handleResponseError(error: HttpErrorResponse): Observable<never> {
    if (error.status === 401)
      this.sessaoService.logout();
    else if (error.status === 403)
      this.sessaoService.logout();
    else if (error.status === 419)
      this.sessaoService.logout();
    else if (error.status === 440)
      this.sessaoService.logout();

    return throwError(() => error);
  }
}
