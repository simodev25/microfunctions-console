import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Functions, ReplicasStatus} from '../../../../interfaces/functions';

import {FunctionService} from '../../function.service';
import {timer} from 'rxjs';
import {IMetricsResult, MetricsService} from '../metrics/metrics.service';
import {ComponentBase} from '../../../../interfaces/component';
import {takeWhile, tap} from 'rxjs/operators';
import {StatusFunctionEnum} from '../../../../enums/status.function.enum';

interface Events {
  message: string;
  type: StatusFunctionEnum;
}

@Component({
  selector: 'functionDetails',
  templateUrl: './details.template.html',
  styleUrls: ['./details.style.scss'],

})
export class DetailsComponent extends ComponentBase implements OnInit, OnDestroy {

  @Input('namespace') namespace: string;
  @Input('functions') functions: Functions;
  replicas: ReplicasStatus[];
  isError: boolean = false;
  events: Events[] = [];
  private interval$ = timer(0, 1000 * 30);//1000 * 10

  constructor(protected functionService: FunctionService,
              private metricsService: MetricsService) {
    super();
  }

  ngOnInit(): void {
    this.receiving();
    if (this.functions.status.message) {
      this.events.push({
        message: this.functions.status.message,
        type: this.functions.status.status
      });
    }

    const getReplicasStatusinterval$ = this.interval$.pipe(
      takeWhile(() => !this.isError),
      tap(() => {
        this.getReplicasStatus();
      })).subscribe();

    const metricLastPoints = this.metricsService.metricLastPoints.subscribe((metrics: { [key: string]: IMetricsResult[] }) => {

      if (this.replicas && this.replicas.length > 0) {
        this.replicas.forEach((replicas: ReplicasStatus) => {
          if (metrics['cpuUsage']) {
            metrics['cpuUsage'].forEach((metric) => {
              if (replicas.name === metric.metric.pod) {
                replicas.cpu = this.metricsService.formateCpu(metric.lastPoints);
              }
            });
          }
          if (metrics['memoryUsage']) {
            metrics['memoryUsage'].forEach((metric) => {
              if (replicas.name === metric.metric.pod) {
                replicas.memory = this.metricsService.formateMemory(metric.lastPoints);
              }
            });
          }

        });
      }

    });

    const notification$ = this.functionService.notification$.subscribe(() => {
      this.getReplicasStatus();
    });
    this.subscriptions.push(notification$);
    this.subscriptions.push(metricLastPoints);
    this.subscriptions.push(getReplicasStatusinterval$);
  }

  private getReplicasStatus() {

    const getStatus = this.functionService.getStatus(this.namespace, this.functions.idFunctions)
      .subscribe((replicas$: ReplicasStatus[]) => {
        this.replicas = replicas$;
        this.receives();
      }, (error: any) => {
        this.events.push({
          message: error,
          type: StatusFunctionEnum.FAILED
        });
        this.isError = true;
      });
    this.subscriptions.push(getStatus);
  }

  /* To copy Text from Textbox */
  copyInputMessage(value: any) {
    this.functionService.copyInputMessage(value);
  }

  ngOnDestroy(): void {
    this.unsubscribe();
  }

}
