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
    return next.handle(request.clone({
      headers: this.headerService.headers
    }));
  }
}
