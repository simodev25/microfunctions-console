import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ComponentBase} from '../../../interfaces/component';
import {Functions} from '../../../interfaces/functions';
import {FunctionService} from '../function.service';
import {interval, Observable, Subject, timer} from 'rxjs';
import {delay, mergeMap, takeWhile, tap} from 'rxjs/operators';
import {StatusFunctionEnum} from '../../../enums/status.function.enum';
import {Namespace} from '../../../interfaces/namespace';

@Component({
  selector: 'functions',
  templateUrl: './functions.html',
  styleUrls: ['./functions.scss'],
})
export class FunctionsComponent extends ComponentBase implements OnInit, OnDestroy {
  functions$: Subject<Functions[]> = new Subject<Functions[]>();
  initFunctions$: Subject<boolean> = new Subject<boolean>();
  functions: Functions[];
  hasUnknownStatus: boolean = true;
  memoryUsage: number = 0;
  @Input('namespace') namespace: Namespace;
  constructor(
    public functionService: FunctionService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    super();
  }

  createNewFunctions() {
    this.router.navigate(['/microfunctions/namespace/', this.route.params['value'].id, 'functions', 'create']);
  }

  ngOnInit(): void {

    this.initFunctions();
    this.initFunctions$.next(true);
  }

  private initFunctions() {
   const initFunctionSub = this.initFunctions$.subscribe((hasUnknownStatus$: boolean) => {
      this.receiving();
      const interval$ = timer(0, 1000 * 10);
      interval$.pipe(takeWhile(() => this.hasUnknownStatus),
        mergeMap(() => {
          return this.functionService.getFunctions(this.route.params['value'].id).pipe(tap((functions: Functions[]) => {
            this.memoryUsage = 0;
            functions.filter((function$: Functions) => function$.status.status !== 'stopping').forEach((function$: Functions) => {
              this.memoryUsage += (parseInt(function$.memory, 10) * function$.replicas);
            })
            const unknownFunction = functions.find((f) => f.status.status === StatusFunctionEnum.UNKNOWN
              || f.status.status === StatusFunctionEnum.PENDING);
            this.hasUnknownStatus = unknownFunction ? true : false;
          }));
        })).subscribe((functions: Functions[]) => {
        this.functions = functions;
        this.functionService.memoryUsage.next(this.memoryUsage);
        this.functions$.next(functions);
      });
      this.receives();
    });
    this.subscriptions.push(initFunctionSub) ;

  }

  deleteFunctions(idFunctions) {
    this.isDeleting = true;
    this.idToDelete = idFunctions;
    const deleteFunction = this.functionService.deleteFunction(this.route.params['value'].id, idFunctions).pipe(
      tap(() => {

        this.functions.forEach((functions: Functions) => {

          if (functions.idFunctions === idFunctions) {
            functions.status = Object.assign(functions.status, {
              status: 'Pending'
            });
          }
        });

      }),
      delay(1000 * 5),
    ).subscribe(() => {
      this.initFunctions$.next(true);
      this.hasUnknownStatus = true;
      this.isDeleting = false;
      this.receives();
    });
    this.subscriptions.push(deleteFunction);
  }

  ngOnDestroy() {
    this.hasUnknownStatus = false;
    this.unsubscribe();
  }

  stopFunction(idFunctions: any) {
    this.isStopping = true;
    this.idToStop = idFunctions;
    const stopFunction = this.functionService.stopFunction(this.route.params['value'].id, idFunctions).pipe(
      tap(() => {

        this.functions.forEach((functions: Functions) => {

          if (functions.idFunctions === idFunctions) {
            functions.status = Object.assign(functions.status, {
              status: 'Pending'
            });
          }
        });

      }),
      delay(1000 * 5),
    ).subscribe(() => {
      this.initFunctions$.next(true);
      this.hasUnknownStatus = true;
      this.isStopping = false;
      this.receives();
    });
    this.subscriptions.push(stopFunction);
  }

  startFunction(idFunctions: any) {
    this.isStart = true;
    this.idToStart = idFunctions;
    const startFunction = this.functionService.startFunction(this.route.params['value'].id, idFunctions).pipe(
      tap(() => {

        this.functions.forEach((functions: Functions) => {

          if (functions.idFunctions === idFunctions) {
            functions.status = Object.assign(functions.status, {
              status: 'Pending'
            });
          }
        });

      }),
      delay(1000 * 5),
    ).subscribe(() => {
      this.initFunctions$.next(true);
      this.hasUnknownStatus = true;
      this.isStart = false;
      this.receives();
    });
    this.subscriptions.push(startFunction);
  }
}
