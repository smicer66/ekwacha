import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddMembersToGroupPage } from './add-members-to-group';

@NgModule({
  declarations: [
    AddMembersToGroupPage,
  ],
  imports: [
    IonicPageModule.forChild(AddMembersToGroupPage),
  ],
})
export class AddMembersToGroupPageModule {}
