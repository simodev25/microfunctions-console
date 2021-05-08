import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ComponentBase} from '../../../../interfaces/component';
import {FunctionService} from '../../function.service';
import {timer} from 'rxjs';
import {map, mergeMap} from 'rxjs/operators';

import {Functions} from '../../../../interfaces/functions';
import {IMetrics, MetricsService} from './metrics.service';


@Component({
  selector: 'metrics',
  templateUrl: './metrics.template.html'
})
export class MetricsComponent extends ComponentBase implements OnInit, OnDestroy {

  @Input('namespace') namespace: string;
  @Input('functions') functions: Functions;
  metrics: { memoryUsage?, memoryRequests?, memoryLimits?, countSentSuccess?, countSentFailure?,requestTime?, cpuUsage?, fsUsage? ,cpuLimits?} = {};
  private interval$ = timer(0, 1000 * 30);//TODO 1000 * 10

  constructor(private functionService: FunctionService,
              private metricsService: MetricsService) {
    super();
  }

  get memoryRequests() {
    const value = this.metrics.memoryRequests;
    // tslint:disable-next-line:radix
    return this.metricsService.formateMemory(value);
  }

  get memoryUsage() {
    const value = this.metrics.memoryUsage;
    // tslint:disable-next-line:radix
    return this.metricsService.formateMemory(value);
  }

  get countSentSuccess() {
    return this.metrics.countSentSuccess ||  0;
  }

  get countSentFailure() {
    return this.metrics.countSentFailure ||  0;
  }


  get cpuUsage() {
    const value = this.metrics.cpuUsage;
    const cpuUsage = this.metricsService.formateCpu(value)
    return cpuUsage === 0  ? '-' : cpuUsage ;

  }
  get cpuLimits() {
    const value = this.metrics.cpuLimits;
    const cpuLimits = this.metricsService.formateCpu(value);
    return cpuLimits === 0  ? '-' : cpuLimits ;
  }
  get memoryProgressbar() {
    return ((this.metrics.memoryUsage * 100) / this.metrics.memoryRequests);
  }

  get requestTime() {
    return this.metrics.requestTime || 0;
  }

  get cpuUsageProgressbar() {
    return ((this.metrics.cpuUsage * 100) / 10000);
  }




  getProgressbarTye(progressbar: number) {
    if (progressbar < 60) {
      return 'primary';
    }
    if (progressbar >= 60 && progressbar < 90) {
      return 'warning';
    }
    if (progressbar >= 90) {
      return 'danger';
    }
  }
  getProgressbarRequestTime(progressbar: number) {
    if (progressbar < 100) {
      return 'primary';
    }
    if (progressbar >= 100 && progressbar < 400) {
      return 'warning';
    }
    if (progressbar >= 400) {
      return 'danger';
    }
  }

  ngOnInit(): void {
    this.subscriptions.push(this.receivingMetrics());
  }

  private receivingMetrics() {
    return this.interval$.pipe(
      mergeMap((count: number) => {
        return this.functionService.getMetrics(this.namespace, this.functions.idFunctions);
      }),
      map((metrics$: IMetrics) => {
        const metrics: { memoryUsage?, memoryRequests?, memoryLimits?, networkTransit?, networkReceive?, cpuUsage?, fsUsage? } = {};
        Object.keys(metrics$).forEach((key: string) => {
          let values = 0;
          const results: IMetrics = this.metricsService.normalizeMetrics(metrics$[key]);
          const result: Partial<{ [metric: string]: number }> = metrics$[key].data.result;
          if (results.data.result.length > 0 && results.data.result[0].values[0] && results.data.result[0].values[0].length > 0) {
            results.data.result.forEach((r: any) => {
              values += parseInt(r.values[0][1], 10);
            });
          }
          this.metrics[key] = values;
          metrics[key] = result;
        });
        this.metricsService.next(metrics);
        this.receiving();

      })
    ).subscribe();
  }


  ngOnDestroy(): void {
    this.unsubscribe();
  }
}
