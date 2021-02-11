import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {GitService, Repo} from './git.service';
import {ComponentBase} from '../../../../interfaces/component';
import {Helper} from '../../../../shared/helper';
import {LoginService} from '../../../login/login.service';
import {SafeResourceUrl} from '@angular/platform-browser';

@Component({
  selector: 'git',
  templateUrl: './git.template.html',
  styleUrls: ['./git.style.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class GitComponent extends ComponentBase implements OnInit, OnDestroy {


  subscriptions: Subscription[] = [];
  allRepos: Repo[];
  listBranches: any[];
  branche: any;
  private _index: string;
  private _visibilityPrivate: boolean = true;
  _isActive: boolean = false;
  urlSocial: SafeResourceUrl;
  popup: any;

  @Input('index')
  set index(index: string) {
    this._index = index;
  }

  get isActive() {
    return this._isActive;
  }

  get visibilityPrivate() {

    return this._visibilityPrivate;
  }

  switchVisibilityPrivate() {

    this._visibilityPrivate = !this._visibilityPrivate;
    this.getALLRepos();
  }


  constructor(private gitService: GitService, private loginService: LoginService,
              private changeDetection: ChangeDetectorRef) {
    super();
  }


  ngOnInit(): void {
    this.gitService.isActive$.subscribe((isActive$: boolean) => {
      this._isActive = isActive$;
      if (this._isActive) {
        this.getALLRepos();
      }
    });


  }

  githubLogin() {

    this.popup = this.popupwindow(this.loginService.getUrlSocial({social: 'github'}), 'github', 500, 600);
    this.popup.onmessage = (e) => {
      if (e.data && e.data.source === 'github') {
        this.gitService.profile$.next(e.data);
        this.popup.close();
      } else {
        console.log(e);
      }
    };

  }

  private popupwindow(url, title, w, h) {
    const left = (screen.width / 2) - (w / 2);
    const top = (screen.height / 2) - (h / 2);
    // tslint:disable-next-line:max-line-length
    return window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);
  }


  private getALLRepos() {
    this.receiving();
    this.changeDetection.detectChanges();
    const getALLRepos = this.gitService.getALLRepos(this._visibilityPrivate ? 'private' : 'all').subscribe((repos: any[]) => {
      this.allRepos = repos;
      if (this.allRepos.length > 0) {
        this.reposChanged({value: this.allRepos[0].id});
      }

      this.receive();
    });
    this.subscriptions.push(getALLRepos);
  }

  get allReposOptions() {
    return Helper.select2Options;
  }

  reposChanged(repo: any) {
    if (repo.value) {
      const getlistBranches = this.gitService.getlistBranches(repo.value).subscribe((listBranches: any) => {
        this.listBranches = listBranches;
        if (this.listBranches.length > 0) {
          this.branchesChanged({value: this.listBranches[0].id});
        }
      });
      this.subscriptions.push(getlistBranches);
    }

  }

  branchesChanged(branche: any) {
    this.branche = branche.value;
  }

  refreshCode(branche) {

    this.gitService.initCodeSource(branche).subscribe(() => {
      this.gitService.refreshCode();
    });

  }

  ngOnDestroy(): void {
    this.unsubscribe();
  }

}
