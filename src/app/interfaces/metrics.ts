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

export interface IMetricsCluster {
  memoryUsage?: any,
  memoryRequests?: any,
  memoryLimits?: any,
  memoryCapacity?: any,
  cpuUsage?: any,
  cpuRequests?: any,
  cpuLimits?: any,
  cpuCapacity?: any,
  podUsage?: any,
  podCapacity?: any,
}

export interface IMetrics {
  status: string;
  data: {
    resultType: string;
    result: IMetricsResult[];
  };
}
