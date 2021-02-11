import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest} from '@angular/common/http';
import {AppConfig} from './app.config';
import {catchError} from 'rxjs/operators';
import {LoginService} from './pages/login/login.service';
import {throwError} from 'rxjs';

@Injectable()
export class AppInterceptor implements HttpInterceptor {
  config;

  constructor(
    appConfig: AppConfig,
   private loginService: LoginService
  ) {
    this.config = appConfig.getConfig();
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    req = req.clone({url: this.config.baseURLApi + req.url});

    const token: string = localStorage.getItem('token');
    if (token) {
      req = req.clone({
        headers: req.headers.set('Authorization', 'Bearer ' + token)
      });
    }

    return next.handle(req).pipe(catchError((err) => {

      if (err.status === 403) {
        this.loginService.logoutUser();
      }
      return throwError(err.error ? (err.error.response ? err.error.response.message : err.error.message) : err.message);
    }));
  }
}
