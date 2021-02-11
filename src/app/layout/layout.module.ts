import 'jquery-slimscroll';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BsDropdownModule, TooltipModule } from 'ngx-bootstrap';

import { ROUTES } from './layout.routes';

import { LayoutComponent } from './layout.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NavbarComponent } from './navbar/navbar.component';

import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import {HelperComponent} from './helper/helper.component';
import {NewWidgetModule} from './new-widget/widget.module';
import {HelperService} from './helper/helper.service';

@NgModule({
  imports: [
    CommonModule,
    TooltipModule.forRoot(),
    BsDropdownModule.forRoot(),
    ROUTES,
    FormsModule,
    LoadingBarRouterModule,
    NewWidgetModule
  ],
  declarations: [
    LayoutComponent,
    SidebarComponent,
    NavbarComponent,
    HelperComponent
  ],
  providers: [
    HelperService
  ]
})
export class LayoutModule {
}
