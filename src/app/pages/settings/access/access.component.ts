import { Component, OnInit } from '@angular/core';
import {ComponentBase} from "../../../interfaces/component";
import {AccressService} from "./accress.service";
import {Collaborators} from "../../../interfaces/collaborators";

@Component({
  selector: 'app-access',
  templateUrl: './access.component.html',
  styleUrls: ['./access.component.scss']
})
export class AccessComponent extends ComponentBase implements OnInit {
  collaborators: Collaborators[];

  constructor(private accressService:AccressService) {
    super();
  }

  ngOnInit() {
    this.receiving();
    const getCollaborators = this.accressService.getCollaborators().subscribe((collaborators: Collaborators[]) => {
      this.collaborators = collaborators;
      this.receives();
    });

    this.subscriptions.push(getCollaborators);
  }

  deleteCollaborators(id) {

  }
  ngOnDestroy(): void {
    this.unsubscribe();
  }

}
