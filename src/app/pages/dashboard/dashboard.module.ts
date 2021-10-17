import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DashboardComponent} from './dashboard.component';
import {RouterModule} from "@angular/router";
import {NewWidgetModule} from "../../layout/new-widget/widget.module";
import {ProgressbarModule, TooltipModule} from "ngx-bootstrap";
import {SharedModule} from "../shared.module";
import {MainChartComponent} from "./main-chart/main-chart.component";
import {NgApexchartsModule} from "ng-apexcharts";
import {FormsModule} from "@angular/forms";
import {ChartsModule, ThemeService} from 'ng2-charts';
export const routes = [
  {path: '', component: DashboardComponent, pathMatch: 'full'}

]
;

@NgModule({
  declarations: [DashboardComponent,MainChartComponent],
  imports: [
    FormsModule,
    RouterModule.forChild(routes),
    NgApexchartsModule,
    CommonModule,
    SharedModule,
    ChartsModule,
    NewWidgetModule,
    ProgressbarModule.forRoot(),
    TooltipModule
  ],
  providers:[ThemeService]
})
export class DashboardModule {
}
