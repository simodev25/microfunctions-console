import { Injectable } from '@angular/core';
import {Observable, throwError} from "rxjs";
import {Response} from "../../../interfaces/response";
import {catchError, map} from "rxjs/operators";
import {MicroFunctionService} from "../../../shared/services/micro-function.service";
import {Collaborators} from "../../../interfaces/collaborators";

@Injectable({
  providedIn: 'root'
})
export class AccressService extends MicroFunctionService{
  private urls: any = {
    collaborators: '/auth/collaborators/',
  };




  public getCollaborators(): Observable<Collaborators[]> {
    const url: string = this.urls.collaborators;
    return this.http.get<Response>(url).pipe(
      map((response: Response) => response.data),
      catchError((err: any) => {
        this.toastr.error(err || 'A problem occurred during recovery Namespaces');
        return [];
      }));
  }

  deleteCollaboratorById(id: any) {
    const url: string = `${this.urls.collaborators}${id}`;
    return this.http.delete<any>(url).pipe(catchError((err: any) => {
      this.toastr.error(err);
      return throwError('error');
    }));
  }
}
