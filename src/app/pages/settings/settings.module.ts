import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccessComponent } from './access/access.component';
import {RouterModule} from "@angular/router";
import {SharedModule} from "../shared.module";
import {
  AccordionModule,
  AlertModule, BsDropdownModule,
  ButtonsModule, CollapseModule,
  PopoverModule,
  ProgressbarModule,
  TooltipModule
} from "ngx-bootstrap";

import {RegisterModule} from "../register/register.module";
export const routes = [

  {path: 'access', component: AccessComponent, pathMatch: 'full'},


];
@NgModule({
  declarations: [AccessComponent],
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    RegisterModule,
    AlertModule.forRoot(),
    PopoverModule.forRoot(),
    TooltipModule.forRoot(),
    AccordionModule.forRoot(),
    ProgressbarModule.forRoot(),
    ButtonsModule.forRoot(),
    BsDropdownModule.forRoot(),
    CollapseModule.forRoot(),
    CommonModule,
  ]
})
export class SettingsModule { }
