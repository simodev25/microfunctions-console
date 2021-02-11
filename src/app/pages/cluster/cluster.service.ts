import { Injectable } from '@angular/core';
import {MicroFunctionService} from '../../shared/services/micro-function.service';
import {Observable, throwError} from 'rxjs';

import {catchError, map} from 'rxjs/operators';
import {Cluster, SupportVersion} from '../../interfaces/cluster';
import {VisibilityCluster} from '../../enums/visibility.cluster';
import {StatusHist} from '../../interfaces/status.hist';
import {Response} from "../../interfaces/response";

@Injectable({
  providedIn: 'root'
})
export class ClusterService extends MicroFunctionService {
  private urls: any = {
    cluster: '/cluster/',
  };




  public addCluster(name: string, config: string, visibility: VisibilityCluster): Observable<any> {
    const url: string = this.urls.cluster;
    return this.http.post<Response>(url, {name, config, visibility}).pipe(catchError((err: any) => {
      this.toastr.error(err);
      return throwError('error');
    }));
  }

  public getClusters(): Observable<Cluster[]> {
    const url: string = this.urls.cluster;
    return this.http.get<Response>(url).pipe(
      map((response: Response) => response.data),
      catchError((err: any) => {
      this.toastr.error(err);
      return throwError('error');
    }));
  }

  deleteClusterById(id: any) {
    const url: string = `${this.urls.cluster}${id}`;
    return this.http.delete<any>(url).pipe(catchError((err: any) => {
      this.toastr.error(err);
      return throwError('error');
    }));
  }

  installCusterById(id: any) {
    const url: string = `${this.urls.cluster}${id}/install`;
    return this.http.get<string>(url).pipe(catchError((err: any) => {
      this.toastr.error(err);
      return throwError('error');
    }));
  }
  uninstallClusterById(id: any) {
    const url: string = `${this.urls.cluster}${id}/uninstall`;
    return this.http.get<string>(url).pipe(catchError((err: any) => {
      this.toastr.error(err);
      return throwError('error');
    }));
  }

  getStatus(idCluster: any) {
    const url: string = `${this.urls.cluster}${idCluster}/status`;
    return this.http.get<Response>(url).pipe(
      map((response: Response) => response.data),
      catchError((err: any) => {
      this.toastr.error(err);
      return throwError('error');
    }));
  }
  listSupportVersion() {
    const url: string = `${this.urls.cluster}support-version`;
    return this.http.get<Response>(url).pipe(
      map((response: Response) => response.data),
      catchError((err: any) => {
      this.toastr.error(err);
      return throwError('error');
    }));
  }
}
