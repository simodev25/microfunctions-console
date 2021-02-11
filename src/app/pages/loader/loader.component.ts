import {Component, HostBinding} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MicroFunctionService} from '../../shared/services/micro-function.service';

@Component({
  selector: 'app-loader',
  styleUrls: ['./loader.style.scss'],
  templateUrl: './loader.template.html',
})
export class LoaderAppComponent {
  @HostBinding('class') classes = 'error-page app';
  size: number = 100;
  router: Router;

  constructor(router: Router,
              private route: ActivatedRoute,
              private microFunctionService: MicroFunctionService) {
    this.router = router;
    this.route.queryParams.subscribe((params) => {
      if (params.git) {
        window.parent.postMessage({login: params.username, accessToken: params.git, source: 'github', id: params.id}, '*');
      }
      if (params.action && params.action === 'deactivateaccount') {
        this.microFunctionService.deactivateaccount();
      }
    });
  }


}
