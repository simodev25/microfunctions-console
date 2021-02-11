import {TypeClientEnums} from "../enums/typeClient.enums";

export interface Collaborators {
  id: string,
  email: string,
  typeClient: TypeClientEnums,
  createdAt: Date
}
