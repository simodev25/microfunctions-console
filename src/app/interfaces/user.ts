export enum Provider {
  GOOGLE = 'google',
  GITHUB = 'github'
}

export interface Profile {
  id: string;
  provider: Provider;
  accessToken: string;
  login: string;
}
