import {StepEnum} from '../enums/step.enum';
import {StatusClusterEnums} from '../enums/status.cluster.Enums';

export interface StatusHist {

  id: string;

  uuidInstall: string;

  step: StepEnum;

  status: StatusClusterEnums;

  message: string;

  createdAt: Date;

  updatedAt: Date;

  idCluster: string;

}

export interface StatusCluster {
  step?: StepEnum;
  status?: StatusClusterEnums;
  message?: string;

}
