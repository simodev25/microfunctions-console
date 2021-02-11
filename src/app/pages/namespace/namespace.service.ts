import {Injectable} from '@angular/core';
import {MicroFunctionService} from '../../shared/services/micro-function.service';
import {Observable, of, throwError} from 'rxjs';
import {Namespace} from '../../interfaces/namespace';
import {catchError, map, tap} from 'rxjs/operators';
import {Response} from '../../interfaces/response';

@Injectable()
export class NamespaceService extends MicroFunctionService {
  private urls: any = {
    namespaces: '/namespaces',
  };


  public getNamespaces(): Observable<Namespace[]> {
    const url: string = this.urls.namespaces;
    return this.http.get<Response>(url).pipe(
      map((response: Response) => response.data),
      catchError((err: any) => {
        this.toastr.error(err || 'A problem occurred during recovery Namespaces');
        return [];
      }));
  }

  public createNamespaces(name: string, idCluster: string,host :string): Observable<Response> {
    const url: string = this.urls.namespaces;
    return this.http.post<Response>(url, {name, idCluster,host}).pipe(
      tap((response: Response) => {
        this.toastr.success(response.message);
      }),
      catchError((err: any) => {

        this.toastr.error(err || 'A problem occurred during createNamespaces');
        return throwError('error');
      }));
  }

  public getNamespaceById(id: string): Observable<Namespace> {
    const url: string = `${this.urls.namespaces}/${id}`;
    return this.http.get<Response>(url).pipe(
      map((response: Response) => response.data),
      catchError((err: any) => {
      this.toastr.error(err || 'A problem occurred during recovery Namespace');
      return throwError('error');
    }));
  }

  public deleteNamespaceById(id: string): Observable<Namespace | Response> {
    const url: string = `${this.urls.namespaces}/${id}`;
    return this.http.delete<Namespace | Response>(url).pipe(
      catchError((err: any) => {
        this.toastr.error(err || 'A problem occurred during deleting Namespace');
        return throwError('error');
      }), tap((response: Response) => {
        this.toastr.success(response.message);
      })
    );
  }


}
