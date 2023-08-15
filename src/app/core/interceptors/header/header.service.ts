import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpHeaders
} from '@angular/common/http';

@Injectable()
export class HeaderInterceptor implements HttpInterceptor {
  constructor() { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const headers = new HttpHeaders({});
    const token = sessionStorage.getItem('token');
    const grupo = sessionStorage.getItem('idGrupoAcesso');

    if (token)
      headers.set('X-Auth-Token', token);

    if (grupo)
      headers.set('X-Auth-Acess-Group', grupo);

    if (request.headers)
      request.headers.keys().forEach((key) => {
        const lista = request.headers.getAll(key);
        if (lista)
          headers.set(key, lista);
      });

    console.log(headers);

    return next.handle(request.clone({
      headers: headers
    }));
  }
}
