import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GroupDashboardPage } from './group-dashboard';

@NgModule({
  declarations: [
    GroupDashboardPage,
  ],
  imports: [
    IonicPageModule.forChild(GroupDashboardPage),
  ],
})
export class GroupDashboardPageModule {}
