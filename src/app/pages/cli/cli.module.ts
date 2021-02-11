import {NgModule} from '@angular/core';
import {CliComponent} from './cli.component';
import {
  AccordionModule,
  AlertModule,
  BsDropdownModule,
  ButtonsModule,
  CollapseModule,
  PopoverModule,
  ProgressbarModule,
  TooltipModule
} from 'ngx-bootstrap';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {SharedModule} from '../shared.module';
import {CliService} from './cli.service';

export const routes = [

  {path: '', component: CliComponent, pathMatch: 'full'},


];

@NgModule({
  declarations: [CliComponent],
  imports: [
    SharedModule,
    AlertModule.forRoot(),
    PopoverModule.forRoot(),
    TooltipModule.forRoot(), // use forRoot() in main app module only.
    AccordionModule.forRoot(),
    ProgressbarModule.forRoot(),
    ButtonsModule.forRoot(),
    BsDropdownModule.forRoot(),
    CollapseModule.forRoot(),
    CommonModule,
    RouterModule.forChild(routes),
  ],
  providers: [CliService]
})
export class CliModule {

}
