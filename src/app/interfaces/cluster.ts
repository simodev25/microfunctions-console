import {Status} from './status';

export interface Cluster {
  id: string;
  createdAt: string;
  name: string;
  status: Status;
  distribution: string;
  nodesCount: number;
  version: string;
  capacity: { cpu: number, memory: number };
  visibility: string;
  canDelete: boolean;
  canInstall: boolean;
  canUninstall: boolean;
}


export interface SupportVersion {
  versions: string[];
  distributions: string[];
}
