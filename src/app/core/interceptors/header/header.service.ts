import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest
} from '@angular/common/http';
import { HeaderService } from '../../services/header.service';

@Injectable()
export class HeaderInterceptor implements HttpInterceptor {
  constructor(private headerService: HeaderService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const headers = this.headerService.headers;

    if (request.headers)
      Object.entries(request.headers).forEach(([key, value]) => headers.append(key, value));

    return next.handle(request.clone({
      headers: headers
    }));
  }
}
