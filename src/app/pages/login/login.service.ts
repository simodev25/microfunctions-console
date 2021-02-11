import {AppConfig} from '../../app.config';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {JwtHelperService} from '@auth0/angular-jwt';
import {Injectable} from '@angular/core';

const jwt = new JwtHelperService();

@Injectable()
export class LoginService {
  config: any;
  _isFetching: boolean = false;
  _errorMessage: string = '';

  constructor(
    appConfig: AppConfig,
    private http: HttpClient,
    private router: Router,
  ) {
    this.config = appConfig.getConfig();
  }

  get isFetching() {
    return this._isFetching;
  }

  set isFetching(val: boolean) {
    this._isFetching = val;
  }

  get errorMessage() {
    return this._errorMessage;
  }

  set errorMessage(val: string) {
    this._errorMessage = val;
  }

  isAuthenticated() {
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }
    const date = new Date().getTime() / 1000;
    const data = jwt.decodeToken(token);
    return date < data.exp;
  }

  loginUser(creds) {

    this.requestLogin();

    if (creds.social) {
      // tslint:disable-next-line
      window.location.href = this.config.baseURLApi + '/auth/signin/' + creds.social + (process.env.NODE_ENV === 'production' ? '?app=microfunctions' : '');
    } else if (creds.email.length > 0 && creds.password.length > 0) {

      const url: string = `/auth/signin`;
      this.http.post(url, creds).subscribe((res: any) => {
        if (res) {
          const token = res.accessToken;
          this.receiveToken(token);
        }
        this.loginError('login  Error');
      }, err => {
        this.loginError(err);
      });

    } else {
      this.loginError('Something was wrong. Try again');
    }

  }


  getUrlSocial(creds) {
    return this.config.baseURLApi + '/auth/signin/githubprofile';
  }

  receiveToken(token) {
    let payload: any = {};
    if (token) {
      payload = jwt.decodeToken(token);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(payload.email));
      localStorage.setItem('typeClient', payload.typeClient);
      localStorage.setItem('profiles', JSON.stringify(payload.profiles || []));
      this.receiveLogin();
    } else {
      this.router.navigate(['/login']);
    }

  }

  logoutUser() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('typeClient');
    localStorage.removeItem('profiles');
    this.errorMessage = '';
    document.cookie = 'token=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    this.router.navigate(['/login']);
  }

  loginError(payload) {
    this.isFetching = false;
    this.errorMessage = payload;
  }

  receiveLogin() {
    this.isFetching = false;
    this.errorMessage = '';
    this.router.navigate(['/microfunctions/namespace']);
  }

  requestLogin() {
    this.isFetching = true;
  }
}
