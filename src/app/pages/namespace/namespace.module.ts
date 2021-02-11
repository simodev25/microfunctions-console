import {NamespaceComponent} from './edite/namespace.component';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {NamespaceService} from './namespace.service';
import {ManagementComponent} from './management/management';

import {
  AccordionModule,
  AlertModule,
  BsDropdownModule,
  BsModalService,
  ButtonsModule,
  CollapseModule,
  PopoverModule,
  ProgressbarModule,
  TooltipModule
} from 'ngx-bootstrap';
import {NamespaceCreateComponent} from './create/namespace.component';
import {FunctionsComponent} from './functions/functions';
import {FunctionService} from './function.service';
import {FunctionEditeComponent} from './functions/edite/function.component';
import {FunctionCreateComponent} from './functions/create/function.component';
import {LogsComponent} from './functions/logs/logs.component';
import {DetailsComponent} from './functions/details/details.component';
import {MetricsComponent} from './functions/metrics/metrics.component';
import {MetricsService} from './functions/metrics/metrics.service';
import {GitComponent} from './functions/git/git.component';
import {GitService} from './functions/git/git.service';
import {SharedModule} from '../shared.module';
import {EditorModule} from "../../components/editor/editor.module";


export const routes = [

  {path: '', component: ManagementComponent, pathMatch: 'full'},
  {path: 'create', component: NamespaceCreateComponent, pathMatch: 'full'},
  {path: ':id', component: NamespaceComponent, pathMatch: 'full'},
  {path: ':idNamespace/functions/create', component: FunctionCreateComponent, pathMatch: 'full'},
  {path: ':idNamespace/functions/:idFunction', component: FunctionEditeComponent, pathMatch: 'full'},

];

@NgModule({
  imports: [
    SharedModule,
    EditorModule,
    AlertModule.forRoot(),
    PopoverModule.forRoot(),
    TooltipModule.forRoot(),
    AccordionModule.forRoot(),
    ProgressbarModule.forRoot(),
    ButtonsModule.forRoot(),
    BsDropdownModule.forRoot(),
    CollapseModule.forRoot(),
    CommonModule,
    RouterModule.forChild(routes),


  ],
  providers: [NamespaceService, FunctionService, BsModalService, MetricsService, GitService],
  declarations: [
    DetailsComponent,
    ManagementComponent,
    NamespaceCreateComponent,
    NamespaceComponent,
    FunctionsComponent,
    FunctionCreateComponent,
    FunctionEditeComponent,
    MetricsComponent,
    GitComponent,
    LogsComponent]
})
export class NamespaceModule {

}
