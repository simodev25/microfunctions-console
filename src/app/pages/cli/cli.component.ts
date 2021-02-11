import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ComponentBase} from '../../interfaces/component';
import {CliKey} from '../../interfaces/cliKey';
import {CliService} from './cli.service';
import {delay, mergeMap, tap} from 'rxjs/operators';
import {Namespace} from '../../interfaces/namespace';

@Component({
  selector: 'cli',
  templateUrl: './cli.template.html',
  styleUrls: ['./cli.style.scss'],
})
export class CliComponent extends ComponentBase implements OnInit, OnDestroy {
  cliKeys: CliKey[] = [];

  constructor(
    private router: Router,
    private cliService: CliService,
  ) {
    super();
  }


  ngOnInit(): void {
    this.receiving();
    const getCliKey = this.cliService.getCliKey().subscribe((cli: any) => {
      this.cliKeys = cli.keys;
      this.receives();
    });

    this.subscriptions.push(getCliKey);
  }


  ngOnDestroy(): void {
    this.unsubscribe();
  }

  createNewcli() {
    this.receiving();
    const createNewcli = this.cliService.createNewcli().subscribe((cli: any) => {
      this.cliKeys = this.cliKeys.concat(cli.keys);
      this.receives();
    });

    this.subscriptions.push(createNewcli);
  }

  deleteCliKey(id: any) {
    this.isDeleting = true;
    this.idToDelete = id;
    const deleteNamespaceById = this.cliService.deleteCli(id).pipe(
    ).subscribe((id$: string) => {
      if (id$) {
        this.cliKeys = this.cliKeys.filter((cliKey: CliKey) => cliKey.id !== id$);
      }
      this.receives();
    });
    this.subscriptions.push(deleteNamespaceById);
  }
}
