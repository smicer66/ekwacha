import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListGroupsPage } from './list-groups';

@NgModule({
  declarations: [
    ListGroupsPage,
  ],
  imports: [
    IonicPageModule.forChild(ListGroupsPage),
  ],
})
export class ListGroupsPageModule {}
