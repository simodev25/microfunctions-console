import {AppConfig} from '../../app.config';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {Injectable} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {catchError, tap} from "rxjs/operators";
import {throwError} from "rxjs";

@Injectable()
export class RegisterService {
  config: any;
  _isFetching: boolean = false;
  _errorMessage: string = '';

  constructor(
    appConfig: AppConfig,
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService
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

  registerUser(payload) {

    this.requestRegister();
    const creds = payload;
    if (creds.email.length > 0 && creds.password.length > 0) {
    return   this.http.post('/auth/signup', creds).pipe(
        tap(() => {
          this.receiveRegister();
          this.toastr.success('You\'ve been add successfully');
          this.router.navigate(['/microfunctions/settings/access']);
        }),
      catchError((err)=>{
        this.registerError(err);
        console.log(err)
        return throwError(err);
      })
      );
    } else {
      this.registerError('Something was wrong. Try again');
    }

  }

  requestRegister() {
    this.errorMessage = '';
    this.isFetching = true;
  }

  receiveRegister() {
    this.isFetching = false;
   // this.errorMessage = '';
  }

  registerError(payload) {
    this.isFetching = false;
    this.errorMessage = payload;
  }
}
