import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import moment from 'moment';
import {map} from 'rxjs/operators';
import {bytesToUnits, bytesToUnitsNumber} from '../utils/convertMemory';


export interface IMetricsResult {
  metric: {
    [name: string]: string;
    instance: string;
    node?: string;
    pod?: string;
    kubernetes?: string;
    kubernetes_node?: string;
    kubernetes_namespace?: string;
  };
  values: [number, string][];
  lastPoints: number;
}

export interface IMetrics {
  status: string;
  data: {
    resultType: string;
    result: IMetricsResult[];
  };
}

@Injectable({
  providedIn: 'root'
})
export class MetricsService {

  private metrics$: Subject<any> = new Subject<any>();
  private metricsObservable$: Observable<any> = this.metrics$.asObservable();


  get metricLastPoints() {
    return this.metricsObservable$.pipe(map((metrics$: any) => {
       return this.getMetricLastPoints(metrics$);
      })
    );
  }

  next(data: any) {
    this.metrics$.next(data);
  }

  public getMetricLastPoints(metrics: { [key: string]: IMetricsResult[] }) {
    const result: any = {};

    Object.keys(metrics).forEach(metricName => {
      try {
        const metricsPods: IMetricsResult[] = metrics[metricName];

        metricsPods.forEach((metric: IMetricsResult) => {
          metric.lastPoints = +metric.values.slice(-1)[0][1];
        });
        result[metricName] = metricsPods;
      } catch (e) {
      }
      return result;
    }, {});

    return result;
  }


  public normalizeMetrics(metrics: IMetrics, frames = 1): IMetrics {

    const {result} = metrics.data;
    if (result.length) {
      if (frames > 0) {
        // fill the gaps
        result.forEach(res => {
          if (!res.values || !res.values.length) {
            return;
          }
          while (res.values.length < frames) {
            const timestamp = moment.unix(res.values[0][0]).subtract(1, 'minute').unix();
            res.values.unshift([timestamp, '0']);
          }
        });
      }
    } else {
      // always return at least empty values array
      result.push({
        metric: {},
        values: []
      } as IMetricsResult);
    }

    return metrics;
  }

  formateCpu(value) {

    if (value === 0) { return 0; }
  //  if (value < 1) { return value.toFixed(3); }
    if (value < 10) { return value.toFixed(3); }
    if (value < 100) { return value.toFixed(2); }
    return value.toFixed(1);

  }

  formateMemory(value) {
    // tslint:disable-next-line:radix
    return parseFloat(value) < 1 ? value.toFixed(3) : bytesToUnits(parseInt(value));
  }



}
