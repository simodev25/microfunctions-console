import {Component, OnDestroy, OnInit} from '@angular/core';
import {NamespaceService} from '../namespace.service';
import {Namespace} from '../../../interfaces/namespace';
import {ActivatedRoute, Router} from '@angular/router';
import {ComponentBase} from '../../../interfaces/component';
import {FunctionService} from '../function.service';

@Component({
  selector: 'namespace',
  templateUrl: './namespace.template.html',
  styleUrls: ['./namespace.style.scss']
})
export class NamespaceComponent extends ComponentBase implements OnInit, OnDestroy  {
  namespace: Namespace;
  memoryUsage: number = 0;
  hideApiKey = true;

  constructor(public namespaceService: NamespaceService,
              private functionService: FunctionService,
              private router: Router,
              private route: ActivatedRoute) {
    super();
  }

  ngOnInit(): void {
    this.receiving();
    this.namespaceService.getNamespaceById(this.route.params['value'].id).subscribe((namespace: Namespace) => {
      this.namespace = namespace;
      this.receives();
    });
   this.subscriptions.push(this.functionService.memoryUsage.subscribe((memoryUsage$: number) => {
     this.memoryUsage = memoryUsage$;
   })) ;

  }

  goBack() {
    this.router.navigate(['/microfunctions/namespace/']);
  }


  get memoryProgressbar() {
    return ((this.memoryUsage * 100) / 1000);
  }

  getProgressbarTye(progressbar: number) {
    if (progressbar < 60) {
      return 'primary';
    }
    if (progressbar >= 60 && progressbar < 90) {
      return 'warning';
    }
    if (progressbar >= 90) {
      return 'danger';
    }
  }
  /* To copy Text from Textbox */
  copyInputMessage(value: any) {
    this.functionService.copyInputMessage(value);
  }
  ngOnDestroy(): void {
    this.unsubscribe();
  }


}
