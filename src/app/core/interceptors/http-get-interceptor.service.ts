import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
// import { LoadingService } from '../services/loading.service';
import { tap } from 'rxjs/operators';
import { LoadingService } from '../services/loading.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class HttpGetInterceptorService implements HttpInterceptor {

  constructor(
      private loadingService: LoadingService,
      private spinnerService: NgxSpinnerService
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const request = req;
    this.spinnerService.show();
    return next.handle(request).pipe(
        tap( (event: HttpEvent<any>) => {
            if ( event instanceof HttpResponse ) {
              this.spinnerService.hide();
            }
        }, err => {
              this.spinnerService.hide();
        })
     );
  }
}
