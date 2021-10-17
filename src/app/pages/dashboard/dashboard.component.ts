import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {Cluster} from "../../interfaces/cluster";
import {ComponentBase} from "../../interfaces/component";
import {ClusterService} from "../cluster/cluster.service";
import {mergeMap} from "rxjs/operators";

import {timer} from "rxjs";
import {IMetricsCluster} from "../../interfaces/metrics";
import {IMainChart} from "./IChart";
import {Select2OptionData} from "ng2-select2";
import {IMetrics, MetricsService} from "../metrics.service";
import {NamespaceService} from "../namespace/namespace.service";
import {Namespace} from "../../interfaces/namespace";
import {FunctionService} from "../namespace/function.service";
import {Functions} from "../../interfaces/functions";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None,

})
export class DashboardComponent extends ComponentBase implements OnInit, OnDestroy {

  clustersSelected: Select2OptionData[];
  namespaceSelected: Select2OptionData[];
  functionsSelected: Select2OptionData[];
  metricsCluster: IMetricsCluster = {}

  chartSelected: 'CPU' | 'MEMORY' = 'MEMORY'
  select2OptionsNamespace: any = {
    theme: 'bootstrap',
    placeholder: "Select a state",
    allowClear: true
  };
  private metrics: IMetrics;
  private mainChart: IMainChart;
  private currentClustersId: string;
  private currentNamespacesId: string;
  private currentFunctionsId: string;
  private interval$ = timer(0, 1000 * 300);//TODO 1000 * 10
  private isInit :boolean = true;
  private namespaces:{id:string,name:string,idCluster:string}[];
  private functions:{id:string,name:string,idNamespace:string}[];
  constructor(
    public clusterService: ClusterService,
    private metricsService: MetricsService,
    private namespaceService: NamespaceService,
    private functionService:FunctionService,

  ) {
    super();
  }

  get data() {
    return this.mainChart;
  }

  ngOnInit() {
    this.receiving();
    const getClusters = this.clusterService.getClusters().subscribe((clusters$: Cluster[])=>{
      const clusters = clusters$.filter((c: Cluster) => c.status.status === 'Active');
      this.currentClustersId = clusters[0].id;
      this.clustersSelected = clusters.map((c: Cluster) => {
        return {
          id: c.id,
          text: c.name,
        };
      });

      this.subscriptions.push(this.receivingNamespaces());
      this.subscriptions.push(this.receivingClusterMetrics());

    });
    this.subscriptions.push(getClusters);

  }
  private receivingNamespaces(){

    return  this.namespaceService.getNamespaces().subscribe((namespaces:Namespace[])=>{
      this.namespaces = namespaces.map((namespace: Namespace)=>{
        return {
              id:namespace.id,
              name:namespace.name,
              idCluster:namespace.idCluster
        }
      })
      this.selectedNamespace()
    });
  }
  private receivingFunctions(){
    return  this.functionService.getFunctions(this.currentNamespacesId).subscribe((functions:Functions[])=>{
      this.functions = functions.map((functions: Functions)=>{
        return {
          id:functions.id,
          name:functions.name,
          idNamespace:functions.idNamespace
        }
      })
      this.selectedFunctions()
    });

  }
  private selectedNamespace(){
    this.namespaceSelected = [{
      id: '-1',
      text: 'Select a Namespace',
    }]
    this.namespaceSelected = this.namespaceSelected.concat(this.namespaces.filter((namespace)=>namespace.idCluster == this.currentClustersId)
      .map((namespace) => {

        return {
          id: namespace.id,
          text: namespace.name,
        };
      }))

  }

  public selectedFunctions(){
    this.functionsSelected = [{
      id: '-1',
      text: 'Select a Function',
    }]
    this.functionsSelected = this.functionsSelected.concat(this.functions
      .map((functions) => {
        return {
          id: functions.id,
          text: functions.name,
        };
      }))

  }
  public receivingClusterMetrics() {
    return this.interval$.pipe(
      mergeMap((count: number) => {
        return this.clusterService.getMetrics(this.currentClustersId, '3600');
      })
    ).subscribe((metrics$: IMetrics) => {
      this.metrics = metrics$;
      this.normalizeMetrics();
      this.normalizeForChart();
      this.receives();
    });
  }
  private receivingNamespaceMetrics() {
    return this.interval$.pipe(
      mergeMap((count: number) => {
        return this.namespaceService.getMetrics(this.currentNamespacesId, '3600');
      })
    ).subscribe((metrics$: IMetrics) => {
      this.metrics = metrics$;
      this.normalizeForChart();
      this.receives();
    });
  }
  private receivingFunctionMetrics() {
    return this.interval$.pipe(
      mergeMap((count: number) => {
        return this.functionService.getMetrics(this.currentNamespacesId,this.currentFunctionsId, '3600');
      })
    ).subscribe((metrics$: IMetrics) => {
      this.metrics = metrics$;
      this.normalizeFunctionsForChart();
      this.receives();
    });
  }
  private normalizeMetrics() {
    Object.keys(this.metrics).forEach((key: string) => {
      const results: IMetrics = this.metricsService.normalizeMetrics(this.metrics[key]);
      const lastIndex = results.data.result[0].values.length - 1;
      if (results.data.result.length > 0 && results.data.result[0].values[lastIndex] && results.data.result[0].values[lastIndex].length > 0) {
        const value = results.data.result[0].values[lastIndex][1];
        this.metricsCluster[key] = parseFloat(value);
      }
    });
  }

  private normalizeForChart() {
    const metricsChart: IMetricsCluster = {};
    Object.keys(this.metrics).forEach((key: string) => {
      const results: IMetrics = this.metricsService.normalizeMetrics(this.metrics[key]);
      if (results.data.result.length > 0 && results.data.result[0].values[0] && results.data.result[0].values[0].length > 0) {
        metricsChart[key] = results.data.result[0].values;
      }
    });

    let data;
    let categories;

    if (this.chartSelected === 'CPU' && metricsChart.cpuUsage) {
      data = metricsChart.cpuUsage.map((m: any[]) => this.metricsService.formateCpu(parseFloat(m[1])));
      categories = metricsChart.cpuUsage.map((m: any[]) => {
        return m;
      });
    } else if(metricsChart.memoryUsage){
      data = metricsChart.memoryUsage.map((m: any[]) => m[1]);
      categories = metricsChart.memoryUsage.map((m: any[]) => {
        return m;
      });
    }


    this.mainChart = {name: this.chartSelected, data, categories ,type:this.chartSelected};
  }
  private normalizeFunctionsForChart() {
    const metricsChart: IMetricsCluster = {};
    Object.keys(this.metrics).forEach((key: string) => {
      const results: IMetrics = this.metricsService.normalizeMetrics(this.metrics[key]);
      if (results.data.result.length > 0 && results.data.result[0].values[0] && results.data.result[0].values[0].length > 0) {
        metricsChart[key] = results.data.result[0].values;
      }
    });

    let data;
    let categories;

    if (this.chartSelected === 'CPU' && metricsChart.cpuUsage) {
      data = metricsChart.cpuUsage.map((m: any[]) => this.metricsService.formateCpu(parseFloat(m[1])));
      categories = metricsChart.cpuUsage.map((m: any[]) => {
        return m;
      });
    } else if(metricsChart.memoryUsage){
      data = metricsChart.memoryUsage.map((m: any[]) => m[1]);
      categories = metricsChart.memoryUsage.map((m: any[]) => {
        return m;
      });
    }


    this.mainChart = {name: this.chartSelected, data, categories ,type:this.chartSelected};
  }


  chartSelectedAction(chartSelected: 'CPU' | 'MEMORY') {
    this.chartSelected = chartSelected;
    this.normalizeForChart()
  }

  clustersChanged($event: any) {

    if(!this.isInit){

      this.currentClustersId = $event.value
      this.unsubscribe();
      this.subscriptions.push(this.receivingClusterMetrics());
      this.selectedNamespace();
    }
    this.isInit = false;
  }
  namespacesChanged($event: any) {

    if($event.value!=='-1'){
      this.currentNamespacesId = $event.value;
      this.subscriptions.push(this.receivingNamespaceMetrics());
      this.subscriptions.push(this.receivingFunctions());

    }

  }
  functionsChanged($event: any) {

    if($event.value!=='-1'){
      this.currentFunctionsId = $event.value;
      this.subscriptions.push(this.receivingFunctionMetrics());
    }

  }

  ngOnDestroy(): void {
    this.unsubscribe();
  }


}
