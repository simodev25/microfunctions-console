import {ChangeDetectorRef, Component, Input, OnDestroy, OnInit, TemplateRef} from '@angular/core';
import {combineLatest, timer} from 'rxjs';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {ComponentBase} from '../../../interfaces/component';
import {map, mergeMap, tap} from 'rxjs/operators';
import {ClusterService} from '../cluster.service';
import {Cluster} from '../../../interfaces/cluster';
import {StatusCluster, StatusHist} from '../../../interfaces/status.hist';

@Component({
  selector: 'cluster-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss']
})
export class StatusComponent extends ComponentBase implements OnInit, OnDestroy {

  private interval$ = timer(0, 1000 * 5);
  modalRef: BsModalRef;

  @Input('cluster') cluster: Cluster;
  statusHists: StatusHist[];
  status: StatusCluster;
  constructor( private modalService: BsModalService,
               private changeDetection: ChangeDetectorRef,
               private clusterService: ClusterService) {
    super();
  }

  ngOnInit() {
  }


  openModal(template: TemplateRef<any>) {

    const _combine = combineLatest([
      this.modalService.onShow,
      this.modalService.onShown,
      this.modalService.onHide,
      this.modalService.onHidden]
    ).subscribe(() => this.changeDetection.markForCheck());

    this.subscriptions.push(
      this.modalService.onShow.subscribe((reason: string) => {
        this.subscriptions.push(this.receivingStatus());
      })
    );
    this.subscriptions.push(
      this.modalService.onShown.subscribe((reason: string) => {
      })
    );
    this.subscriptions.push(
      this.modalService.onHide.subscribe((reason: string) => {
      })
    );
    this.subscriptions.push(
      this.modalService.onHidden.subscribe((reason: string) => {
        this.unsubscribe();
      })
    );
    this.modalRef = this.modalService.show(template, {class: 'modal-xl '});

  }

  private receivingStatus() {


    return this.interval$.pipe(
      mergeMap((count: number) => {

        return this.clusterService.getStatus(this.cluster.id).pipe(map((status: any) => {

          this.statusHists = status.statusHist;
          this.status = status.status;
          return count;
        }));
      })
    ).subscribe((count) => {

    });
  }
  ngOnDestroy(): void {
    this.unsubscribe();
  }
}
