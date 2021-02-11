import {Status} from './status';

export interface Namespace {
  id?: string;
  name?: string;
  idNamespace?: string;
  idUser?: string;
  createdAt?: Date;
  updatedAt?: Date;
  apiKey: string;
  status: Status;
  clusterName: string;
  host: { host:string };


}
