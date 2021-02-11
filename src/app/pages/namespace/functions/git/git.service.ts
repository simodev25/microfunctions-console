import {Injectable} from '@angular/core';
import {Profile, Provider} from '../../../../interfaces/user';
import GitHub from 'github-api';
import {BehaviorSubject, from, of, Subject, throwError} from 'rxjs';
import {catchError, map, mergeMap, tap} from 'rxjs/operators';
import {HttpBackend, HttpClient} from '@angular/common/http';
import {parsesObject} from '../../../../utils/shared.utils';
import {ToastrService} from 'ngx-toastr';
import {stringify} from 'querystring';

export interface Repo {
  id: string;
  name: string;
}

export enum FileName {
  INDEXJS = 'index.js',
  ENV = '.env',
  src = 'src',
  PACKAGEJSON = 'package.json',
}

@Injectable()
export class GitService {
  private httpClient: HttpClient;
  private gitProfiles: Profile;
  private gh: any;
  private user: any;
  private repo: any;
  private listBranches: any[];
  private files: any[];
  indexjs$: Subject<string> = new Subject<string>();
  dependencies$: Subject<any> = new Subject<any>();
  env$: Subject<any> = new Subject<any>();
  profile$: Subject<any> = new Subject<any>();
  isActive$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  profile: Profile;


  constructor(private  handler: HttpBackend, private toastr: ToastrService) {

    this.httpClient = new HttpClient(handler);
    const profiles: Profile[] = JSON.parse(localStorage.getItem('profiles')) as Profile[];

    this.gitProfiles = profiles.find((profile: Profile) => profile.provider === 'github');
    if (this.gitProfiles) {
      this.gh = new GitHub({
        username: this.gitProfiles.login,
        token: this.gitProfiles.accessToken

      });
      this.profile = this.gitProfiles;
      this.user = this.gh.getUser();
      this.isActive$.next(true);
    }
    this.profile$.subscribe((profile: Profile) => {
      this.gh = new GitHub({
        username: profile.login,
        token: profile.accessToken
      });
      this.profile = {id: profile.id, login: profile.login, accessToken: profile.accessToken, provider: Provider.GITHUB};
      profiles.push(this.profile);
      localStorage.setItem('profiles', JSON.stringify(profiles));
      this.user = this.gh.getUser();
      this.isActive$.next(true);
    });

  }

  getALLRepos(visibility) {

    return from(this.user.listRepos()).pipe(
      map((res: any) => res.data.map((repo: any) => {
        const {id, name} = repo;
        return {
          id: name,
          text: name
        };
      })),
      catchError((err) => {
        this.toastr.error('A problem occurred during recovery  Repos');
        return throwError('error');
      })
    );
  }

  getlistBranches(value: any) {

    this.repo = this.gh.getRepo(this.profile.login, value);
    return from(this.repo.listBranches()).pipe(
      map((branches: any) => {

        this.listBranches = branches.data;

        return branches.data.map((branche: any) => {
          const {name} = branche;
          return {
            id: name,
            text: name
          };
        });
      }),
      catchError((err) => {
        this.toastr.error('A problem occurred during recovery  Branches');
        return throwError('error');
      })
    )
      ;
  }

  initCodeSource(namebranche: any) {
    this.files = [];
    return from(this.repo.getContents(namebranche, '', true)).pipe(catchError((err) => {
      this.toastr.error('A problem occurred during recovery  CodeSource');
      return throwError('error');
    })).pipe(tap((files: any) => {
      files.data.forEach((file: any) => {
        if (Object.values(FileName).includes(file.name)) {
          this.files.push(file);
        }
      });
    }));
  }


  refreshCode() {
    const srcFile: any = this.files.find((file: any) => file.name === FileName.src);

    const packagejsonFile: any = this.files.find((file: any) => file.name === FileName.PACKAGEJSON);
    const envFile: any = this.files.find((file: any) => file.name === FileName.ENV);
    this.httpClient.get<any[]>(srcFile.url, {responseType: 'json'}).pipe(catchError((err) => {
      this.toastr.error('A problem occurred during recovery  index File');
      return throwError('error');
    }),
      mergeMap((srcs:any[]) => {
        const indexjsFile: any = srcs.find((file: any) => file.name === FileName.INDEXJS);
        return this.httpClient.get(indexjsFile.download_url, {responseType: 'text'});
      })
      ).subscribe((indexjs) => {
      this.indexjs$.next(indexjs);
    });

    this.httpClient.get(packagejsonFile.download_url, {responseType: 'json'}).pipe(catchError((err) => {
      this.toastr.error('A problem occurred during recovery  package File');
      return throwError('error');
    })).subscribe(($package) => {
      this.dependencies$.next(this.formatPackagejson($package));
    });
    this.httpClient.get(envFile.download_url, {responseType: 'text'}).pipe(catchError((err) => {
      this.toastr.error('A problem occurred during recovery  env File');
      return throwError('error');
    })).subscribe((env) => {
      this.env$.next(parsesObject(env));
    });
  }

  pushCode(codeSource: any) {

  }

  private formatPackagejson($package: any) {
 const {dependencies} = $package;
    return {dependencies};
  }
}
