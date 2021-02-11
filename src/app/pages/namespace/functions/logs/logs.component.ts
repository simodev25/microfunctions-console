import {ChangeDetectorRef, Component, ElementRef, Input, TemplateRef, ViewChild} from '@angular/core';
import {combineLatest, Subscription, timer} from 'rxjs';
import {map, mergeMap, tap} from 'rxjs/operators';
import {FunctionService} from '../../function.service';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {Functions} from '../../../../interfaces/functions';


@Component({
  selector: 'logs',
  templateUrl: './logs.template.html',
})
export class LogsComponent {
  isReceivinglogs: boolean = false;
  logs: string [] = [];
  logsTimestamp: string;
  logsbloc: Map<string, { logs, logsTimestamp, isReceivingNewlogs, pod? }> = new Map();
  unsubscribeinterval$: boolean = false;
  unsubscribetimer: boolean = false;
  progressbar: number = 0;
  progressbarSubscription: Subscription;
  private interval$ = timer(0, 1000 * 10);
  modalRef: BsModalRef;
  subscriptions: Subscription[] = [];
  podName: string = 'REPLICAS';
  notification: number = 0;

  @ViewChild('scrollframe', {static: false}) scrollFrame: ElementRef;
  @Input('namespace') namespace: string;
  @Input('functions') functions: Functions;

  get pods() {
    return Array.from(this.logsbloc.keys());
  }

  constructor(private functionService: FunctionService,
              private modalService: BsModalService,
              private changeDetection: ChangeDetectorRef) {

  }


  openModal(template: TemplateRef<any>) {

    const _combine = combineLatest([
      this.modalService.onShow,
      this.modalService.onShown,
      this.modalService.onHide,
      this.modalService.onHidden]
    ).subscribe(() => this.changeDetection.markForCheck());

    this.subscriptions.push(
      this.modalService.onShow.subscribe((reason: string) => {
        this.subscriptions.push(this.receivinglogs());
        this.subscriptions.push(this.progressbarSubscription);
      })
    );
    this.subscriptions.push(
      this.modalService.onShown.subscribe((reason: string) => {
      })
    );
    this.subscriptions.push(
      this.modalService.onHide.subscribe((reason: string) => {
      })
    );
    this.subscriptions.push(
      this.modalService.onHidden.subscribe((reason: string) => {
        this.unsubscribe();
      })
    );
    this.modalRef = this.modalService.show(template, {class: 'modal-xl '});

  }

  unsubscribe() {
    this.progressbarSubscription.unsubscribe();
    this.subscriptions.forEach((subscription: Subscription) => {
      if (subscription) {
        subscription.unsubscribe();
      }
    });
    this.subscriptions = [];
  }

  receivinglogs() {
    this.unsubscribeinterval$ = false;
    this.unsubscribetimer = false;
    this.progressbar = 0;
    return this.interval$.pipe(
      mergeMap((count: number) => {
        const logsTimestamp: any = this.logsbloc.size > 0 ? Array.from(this.logsbloc.values()).map((logsbloc: any) => {
          return {
            logstimestamp: logsbloc.logsTimestamp,
            pod: logsbloc.pod
          };
        }) : null;
        return this.functionService.getlogs(this.namespace, this.functions.idFunctions, logsTimestamp).pipe(map((logs$: any[]) => {
          this.notification = 0;
          logs$.forEach((l: any) => {
            const logs = this.logsbloc.get(l.pod) ? this.logsbloc.get(l.pod) : {
              logs: [],
              isReceivingNewlogs: false,
              logsTimestamp: '',
            };
            if (logs.logs.length > 0 && l.logs.length > 0 && !logs.isReceivingNewlogs) {
              // tslint:disable-next-line:max-line-length
              logs.logs.push('-------------------------------------------------------------------------------------------------new-------------------------------------------------------------------------------------------------');
              logs.isReceivingNewlogs = true;
            }
            if (logs.isReceivingNewlogs && l.logs.length > 0) {
               this.notification = l.logs.length;
            }
            logs.logs.push(...l.logs.reverse());
            logs.logsTimestamp = l.logsTimestamp || logs.logsTimestamp;
            logs.pod = l.pod;
            this.logsbloc.set(l.pod, logs);
          });

          if (this.logsbloc.size === 1) {
            this.podName = Array.from(this.logsbloc.values())[0].pod;
          }

          this.isReceivinglogs = true;
          setTimeout(() => {
            this.scrollToBottom();
          }, 1000);
          return count;
        }));
      })
    ).subscribe((count) => {
      // tslint:disable-next-line:no-unused-expression
      this.progressbarSubscription ? this.progressbarSubscription.unsubscribe() : null;
      this.progressbarSubscription = timer(0, 1000).pipe(
        tap((time) => {
          this.progressbar = time * 10;


        }))
        .subscribe(() => {

        });
    });

  }

  private removeTimestamps(logs: string) {
    const logstemps = logs.replace(/^\d+.*?\s/gm, '');
    return logstemps.replace(logstemps.substring(0, logstemps.indexOf('--[')), '');
  }


  private scrollToBottom(): void {
    if (document.getElementById('scrollframe')) {
      document.getElementById('scrollframe').scroll({
        top: document.getElementById('scrollframe').scrollHeight,
        left: 0,
        behavior: 'smooth'
      });
    }

  }

  get Object() {
    return Object;
  }

  replicasChange(podname: any) {
    this.podName = podname;
    this.notification = 0;

  }
}
