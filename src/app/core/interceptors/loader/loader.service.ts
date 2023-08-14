import { Observable } from 'rxjs';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, finalize } from 'rxjs/operators';
import { LoadingService } from 'src/app/shared/components/loader-geral/loader-geral.service';

@Injectable({
  providedIn: 'root'
})
export class LoaderService implements HttpInterceptor {
  constructor(
    private loadingService: LoadingService,
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.loadingService.setLoading(true, request.url);
    return next.handle(request)
      .pipe(
        finalize(() => {
          this.loadingService.setLoading(false, request.url);
        })
      )
      .pipe(map<HttpEvent<any>, any>((evt: HttpEvent<any>) => {
        if (evt instanceof HttpResponse) {
          this.loadingService.setLoading(false, request.url);
        }
        return evt;
      }));
  }

}
