import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {AppConfig} from '../../app.config';
import {Injectable} from '@angular/core';
import {Subject, throwError} from 'rxjs';
import {LoginService} from '../../pages/login/login.service';
import {catchError} from 'rxjs/operators';

@Injectable()
export class MicroFunctionService {
  config: any;
  profileGit$: Subject<any> = new Subject<any>();
  private deleteaccountUrl: any = {
    deleteaccount: '/deleteaccount',
  };
  constructor(
    protected http: HttpClient,
    protected router: Router,
    public toastr: ToastrService,
    appConfig: AppConfig,
    protected loginService: LoginService
  ) {
    this.config = appConfig.getConfig();
    this.profileGit$.subscribe((gitProfile: any) => {
      console.log(gitProfile);
      // this.popup.close();
    });
  }

  public deactivateaccount() {
    const url: string = `${this.deleteaccountUrl.deleteaccount}`;
    return this.http.delete(url).pipe(catchError((err: any) => {
      this.toastr.error('A problem occurred during recovery Namespace');
      return throwError('error');
    })).subscribe(() => {
      this.loginService.logoutUser();
    });

  }
  /* To copy Text from Textbox */
  copyInputMessage(value: any) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = value;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.toastr.success('Endpoint successfully copied to the clipboard');
  }
}
