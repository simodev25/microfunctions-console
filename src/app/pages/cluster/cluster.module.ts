import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ClusterComponent} from './cluster.component';
import {SharedModule} from '../shared.module';
import {
  AccordionModule,
  AlertModule,
  BsDropdownModule, BsModalService,
  ButtonsModule,
  CollapseModule,
  PopoverModule,
  ProgressbarModule,
  TooltipModule
} from 'ngx-bootstrap';
import {RouterModule} from '@angular/router';
import {AddComponent} from './add/add.component';
import { StatusComponent } from './status/status.component';

export const routes = [

  {path: '', component: ClusterComponent, pathMatch: 'full'},
  {path: 'add', component: AddComponent, pathMatch: 'full'},

];
@NgModule({
  declarations: [ClusterComponent, AddComponent, StatusComponent],
  providers:[ BsModalService],
  imports: [
    CommonModule,
    SharedModule,
    AlertModule.forRoot(),
    PopoverModule.forRoot(),
    TooltipModule.forRoot(),
    AccordionModule.forRoot(),
    ProgressbarModule.forRoot(),
    ButtonsModule.forRoot(),
    BsDropdownModule.forRoot(),
    CollapseModule.forRoot(),
    RouterModule.forChild(routes),

  ]
})
export class ClusterModule { }
