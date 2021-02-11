import {MicroFunctionService} from '../../shared/services/micro-function.service';
import {Observable, Subject, throwError} from 'rxjs';
import {catchError, delay, map, tap} from 'rxjs/operators';
import {Functions} from '../../interfaces/functions';
import {Response} from '../../interfaces/response';

export class FunctionService extends MicroFunctionService {
  private urls: any = {
    function: '/namespaces/',
  };

  memoryUsage: Subject<number> = new Subject<number>();

  private _notification: Subject<boolean> = new Subject<boolean>();

  get notification$() {
    return this._notification.asObservable();
  }

  public getFunctions(idNamespaces: string): Observable<Functions[]> {
    const url: string = this.urls.function + idNamespaces + '/functions';
    return this.http.get<Response>(url).pipe(
      map((response: Response) => response.data),
      catchError((err: any) => {
      this.toastr.error(err || 'A problem occurred during recovery  Functions');
      return throwError('error');
    }));
  }

  public createFunctions(idNamespaces: string, functions: Functions): Observable<any> {
    const url: string = this.urls.function + idNamespaces + '/functions';
    return this.http.post<Response>(url, functions).pipe(
      tap((response: Response) => {
        this.toastr.success(response.message);
      }),
      catchError((err: any) => {
      this.toastr.error(err || ` A problem occurred during recovery create Function ${err}`);
      return throwError('error');
    }));
  }

  public updateFunctions(idNamespaces: string, idFunction: string, functions: Functions) {
    const url: string = this.urls.function + idNamespaces + '/functions/' + idFunction;
    return this.http.put<Response>(url, functions).pipe(
      tap((response: Response) => {
        this.toastr.success(response.message);
      }),
      catchError((err: any) => {
      this.toastr.error(err || 'A problem occurred during recovery update Function');
      return throwError('error');
    }));
  }

  public getFunction(idNamespaces: string, idFunction: string): Observable<Functions> {
    const url: string = this.urls.function + idNamespaces + '/functions/' + idFunction;
    return this.http.get<Response>(url).pipe(
      map((response: Response) => response.data),
      catchError((err: any) => {
      this.toastr.error(err || 'A problem occurred during recovery  Function');
      return throwError('error');
    }));
  }

  public getlogs(idNamespaces: string, idFunction: string, logstimestamps?: any): Observable<any> {
    const url: string = this.urls.function + idNamespaces + '/functions/' + idFunction + '/logs';

    return this.http.post<Response>(url, {logstimestamps}).pipe(
      map((response: Response) => response.data),
      catchError((err: any) => {
      this.toastr.error(err || 'A problem occurred during recovery logs Function');
      return throwError('error');
    }));
  }

  public liveScale(idNamespaces: string, idFunction: string, replicas: any): Observable<any> {
    const url: string = this.urls.function + idNamespaces + '/functions/' + idFunction + '/scale';

    return this.http.put<any>(url, {replicas}).pipe(catchError((err: any) => {
        this.toastr.error(err || 'A problem occurred while Scale');
        return throwError('error');
      }),
      delay(1000),
      tap(() => {
        this._notification.next(true);
      })
    );
  }

  public getMetrics(idNamespaces: string, idFunction: string, range?: number): Observable<any> {
    const url: string = `${this.urls.function}${idNamespaces}/functions/${idFunction}/metrics`;

    return this.http.get<Response>(url).pipe(
      map((response: Response) => response.data),
      catchError((err: any) => {
      this.toastr.error(err || 'A problem occurred during recovery Metrics Function');
      return throwError('error');
    }));
  }

  public getStatus(idNamespaces: string, idFunction: string): Observable<any> {
    const url: string = `${this.urls.function}${idNamespaces}/functions/${idFunction}/status`;

    return this.http.get<Response>(url).pipe(
      map((response: Response) => response.data),
      catchError((err: any) => {
      this.toastr.error(err || 'A problem occurred during recovery Status Function');
      return throwError(err);
    }));
  }

  public deleteFunction(idNamespaces: string, idFunction: string): Observable<any> {
    const url: string = this.urls.function + idNamespaces + '/functions/' + idFunction;
    return this.http.delete(url).pipe(catchError((err: any) => {
      this.toastr.error(err || 'A problem occurred during deleting Function');
      return throwError('error');
    }));
  }

  stopFunction(idNamespaces: any, idFunction: any) {
    const url: string = `${this.urls.function}${idNamespaces}/functions/${idFunction}/stop`;

    return this.http.get(url).pipe(catchError((err: any) => {
      this.toastr.error(err || 'A problem occurred during stop Function');
      return throwError('error');
    }));
  }

  startFunction(idNamespaces: any, idFunction: any) {
    const url: string = `${this.urls.function}${idNamespaces}/functions/${idFunction}/start`;

    return this.http.get(url).pipe(catchError((err: any) => {
      this.toastr.error(err || 'A problem occurred during stop Function');
      return throwError('error');
    }));
  }
}
