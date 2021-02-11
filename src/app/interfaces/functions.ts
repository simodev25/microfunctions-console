import {Status} from './status';


export interface Functions {

  idFunctions: string;
  name: string;
  allocated: boolean;
  memory: string;
  cpu: string;
  idUser: string;
  idNamespace: string;
  executedName: string;
  replicas: number;
  runtime: string;
  trigger: string;
  crontab: string;
  sourceCode?: any;
  dependencies?: any;
  status: Status;
  autoscaler: {
    averageCpu: string
    averageMemory: string
    enabled: boolean
    maxReplicas: number
    minReplicas: number
  }
  environments: {
    name: string,
    value: string,
  }[];
  createdAt: string;
  updatedAt: string;
  url: string;
}

export interface ReplicasStatus {
  name: string;
  status: string;
  statusMessage: string;
  statusPhase: string;
  restartsCount: number;
  cpu?: string;
  memory?: string;

}

