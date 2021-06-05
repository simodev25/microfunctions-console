import {Routes, RouterModule} from '@angular/router';
import {LayoutComponent} from './layout.component';

const routes: Routes = [
  {
      path: '', component: LayoutComponent, children: [
      {path: '', redirectTo: 'namespace', pathMatch: 'full'},
      {path: 'namespace', loadChildren: '../pages/namespace/namespace.module#NamespaceModule'},
      {path: 'cli', loadChildren: '../pages/cli/cli.module#CliModule'},
      {path: 'cluster', loadChildren: '../pages/cluster/cluster.module#ClusterModule'},
      {path: 'settings', loadChildren: '../pages/settings/settings.module#SettingsModule'},
      {path: 'dashboard', loadChildren: '../pages/dashboard/dashboard.module#DashboardModule'},
    ]
  }
];

export const ROUTES = RouterModule.forChild(routes);
