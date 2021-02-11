import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {NamespaceService} from '../namespace.service';
import {Namespace} from '../../../interfaces/namespace';
import {ComponentBase} from '../../../interfaces/component';
import {delay, mergeMap, takeWhile, tap} from 'rxjs/operators';
import {of, Subject, timer} from 'rxjs';

import {StatusFunctionEnum} from '../../../enums/status.function.enum';

@Component({
  selector: 'management',
  templateUrl: './management.html',
  styleUrls: ['./management.scss'],
})
export class ManagementComponent extends ComponentBase implements OnInit, OnDestroy {
  namespaces: Namespace[];
  namespaces$: Subject<Namespace[]> = new Subject<Namespace[]>();
  initNamespaces$: Subject<boolean> = new Subject<boolean>();
  hasUnknownStatus: boolean = true;
  autoRefresh: boolean = false;
  constructor(
    public namespaceService: NamespaceService,
    private router: Router
  ) {
    super();
  }

  createNewNamespace() {
    this.router.navigate(['/microfunctions/namespace/create']);
  }

  ngOnInit(): void {
    this.initFunctions();
    this.initNamespaces$.next(true);
  }

  private initFunctions() {

    const initNamespacesSub = this.initNamespaces$.subscribe((hasUnknownStatus$: boolean) => {
      this.receiving();
      const interval$ =  timer(0, 1000 * 5);
      interval$.pipe(takeWhile(() => this.hasUnknownStatus),
        mergeMap(() => {
          return this.namespaceService.getNamespaces().pipe(tap((namespaces: Namespace[]) => {

            const unknownFunction = namespaces.find((f) => f.status.status === StatusFunctionEnum.UNKNOWN
              || f.status.status === StatusFunctionEnum.PENDING);
            this.hasUnknownStatus = unknownFunction ? true : false;
          }));
        })).subscribe((namespaces: Namespace[]) => {


        this.namespaces$.next(namespaces);
      });
      this.receives();
    });
    this.subscriptions.push(initNamespacesSub) ;
  }



  deleteNamespace(idNamespaces) {
    this.isDeleting = true;
    this.idToDelete = idNamespaces;
    const deleteNamespaceById = this.namespaceService.deleteNamespaceById(idNamespaces).subscribe(() => {
      this.initNamespaces$.next(true);
      this.hasUnknownStatus = true;
      this.receives();
    });
    this.subscriptions.push(deleteNamespaceById);
  }

  ngOnDestroy(): void {
    this.hasUnknownStatus = false;
    this.unsubscribe();
  }
}
