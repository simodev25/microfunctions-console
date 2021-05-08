import {Component, OnDestroy, OnInit} from '@angular/core';
import {Cluster} from '../../interfaces/cluster';
import {ComponentBase} from '../../interfaces/component';
import {Router} from '@angular/router';
import {ClusterService} from './cluster.service';
import {Namespace} from '../../interfaces/namespace';
import {delay, map, mergeMap, tap} from 'rxjs/operators';
import {timer} from 'rxjs';

@Component({
  selector: 'app-cluster',
  templateUrl: './cluster.component.html',
  styleUrls: ['./cluster.component.scss']
})
export class ClusterComponent extends ComponentBase implements OnInit, OnDestroy {
  clusters: Cluster[];
  private interval$ = timer(0, 1000 * 5);

  constructor(
    public clusterService: ClusterService,
    private router: Router
  ) {
    super();
  }

  ngOnInit() {
    this.receiving();
    const getClusters = this.interval$.pipe(
      mergeMap((count: number) => {
        return this.clusterService.getClusters().pipe(map((clusters$: Cluster[]) => {
          this.clusters = clusters$;
          this.receives();
        }));
      })).subscribe();


    this.subscriptions.push(getClusters);
  }

  addCluster() {
    this.router.navigate(['/microfunctions/cluster/add']);
  }

  ngOnDestroy(): void {
    this.unsubscribe();
  }

  deleteCluster(id: any) {
    this.isDeleting = true;
    this.idToDelete = id;
    const deleteClusterById = this.clusterService.deleteClusterById(id).pipe(
      tap(() => {
        this.clusters.forEach((cluster: Cluster) => {
          if (cluster.id === id) {
            cluster.status = Object.assign(cluster.status, {
              status: 'Removing'
            });
          }
        });
      }),
      delay(1000 * 10),
      mergeMap((deleteResult: any) => {
        return this.clusterService.getClusters();
      })).subscribe((clusters: Cluster[]) => {
      this.clusters = clusters;
      this.receives();
    });
    this.subscriptions.push(deleteClusterById);
  }

  installCuster(id: any) {
    this.isDeleting = true;
    this.idToDelete = id;
    const deleteClusterById = this.clusterService.installCusterById(id).pipe(
      tap(() => {
        this.clusters.forEach((cluster: Cluster) => {
          if (cluster.id === id) {
            cluster.status = Object.assign(cluster.status, {
              status: 'Removing'
            });
          }
        });
      }),
      delay(1000 * 10),
      mergeMap((deleteResult: any) => {
        return this.clusterService.getClusters();
      })).subscribe((clusters: Cluster[]) => {
      this.clusters = clusters;
      this.receives();
    });
    this.subscriptions.push(deleteClusterById);
  }

}
