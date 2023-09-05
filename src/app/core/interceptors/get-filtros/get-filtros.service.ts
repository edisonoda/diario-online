import { Observable, finalize } from 'rxjs';
import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpContextToken,
} from '@angular/common/http';

export const GET_FILTRO_TOKEN = new HttpContextToken<string>(() => '');

@Injectable()
export class GetFiltro implements HttpInterceptor {
  private currentRequests: HttpRequest<any>[] = [];

  constructor() { }

  intercept<T>(req: HttpRequest<T>, next: HttpHandler): Observable<HttpEvent<T>> {
    if (req.context.get(GET_FILTRO_TOKEN)){
      const current = this.currentRequests.find(current =>
        current.context.get(GET_FILTRO_TOKEN) === req.context.get(GET_FILTRO_TOKEN)
      );

      if (current)
        return next.handle(current);

      const index = this.currentRequests.push(req) - 1;
      return next.handle(req).pipe(
        finalize(() => {
          this.currentRequests.splice(index, 1);
        })
      );
    }

    return next.handle(req);
  }
}
