import {Injectable} from '@angular/core';
import {MicroFunctionService} from '../../shared/services/micro-function.service';
import {Namespace} from '../../interfaces/namespace';
import {catchError, map} from 'rxjs/operators';
import {CliKey} from '../../interfaces/cliKey';
import {Response} from "../../interfaces/response";

@Injectable()
export class CliService extends MicroFunctionService {
  private urls: any = {
    cli: '/cli',
    cliGenerate: '/cli/generate',
  };

  getCliKey() {
    const url: string = this.urls.cli;
    return this.http.get<Response>(url).pipe(
      map((response: Response) => response.data),
      catchError((err: any) => {
      this.toastr.error('A problem occurred during recovery clikey');
      return [];
    }));
  }

  createNewcli() {
    const url: string = this.urls.cliGenerate;
    return this.http.get<Response>(url).pipe(
      map((response: Response) => response.data),
      catchError((err: any) => {
      this.toastr.error(`A problem occurred during recovery clikey:${err}`);
      return [];
    }));
  }

  deleteCli(id: string) {
    const url: string = `${this.urls.cli}/${id}`;
    return this.http.delete(url).pipe(catchError((err: any) => {
        this.toastr.error('A problem occurred during recovery clikey');
        return null;
      }),
      map(() => id)
    );
  }
}
