import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListGroupMembersPage } from './list-group-members';

@NgModule({
  declarations: [
    ListGroupMembersPage,
  ],
  imports: [
    IonicPageModule.forChild(ListGroupMembersPage),
  ],
})
export class ListGroupMembersPageModule {}
