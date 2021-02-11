import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {ComponentBase} from '../../../interfaces/component';
import {Cluster, SupportVersion} from '../../../interfaces/cluster';
import {ClusterService} from '../cluster.service';
import {Router} from '@angular/router';
import {Select2OptionData} from 'ng2-select2';
import {VisibilityCluster} from '../../../enums/visibility.cluster';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AddComponent extends ComponentBase implements OnInit, OnDestroy {
  clusterName: string;
  clusterConfig: string;
  visibilitys: Select2OptionData[];
  visibility: VisibilityCluster = VisibilityCluster.PRIVATE;
  supportVersion: SupportVersion;

  constructor(
    public clusterService: ClusterService,
    private router: Router
  ) {
    super();
  }

  ngOnInit() {
    const supportVersionSub = this.clusterService.listSupportVersion().subscribe((supportVersion$: SupportVersion) => {
        this.supportVersion = supportVersion$;
    });

    this.subscriptions.push(supportVersionSub);
  }

  goBack() {
    this.router.navigate(['/microfunctions/cluster/']);
  }

  addCluster() {

    const pattern = new RegExp('^(?=.*[a-zA-Z])([a-zA-Z0-9]+)$');
    if (!this.clusterName || this.clusterName.length < 6 || this.clusterName.length > 25 || !pattern.test(this.clusterName)) {
      this.errorMessage = 'The name contains invalid characters. Enter letters, numbers.Min length is 5, Max length is 14';
      return true;
    }
    if (this.clusterConfig.length < 100) {
      this.errorMessage = 'cluster Config invalid';
      return true;
    }

    const addCluster = this.clusterService.addCluster(this.clusterName, this.clusterConfig, this.visibility).subscribe(() => {
      this.router.navigate(['/microfunctions/cluster']);
    });
    this.subscriptions.push(addCluster);
  }


  ngOnDestroy(): void {
    this.unsubscribe();
  }
}
