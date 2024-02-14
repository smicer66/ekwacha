import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListContributionsPage } from './list-contributions';

@NgModule({
  declarations: [
    ListContributionsPage,
  ],
  imports: [
    IonicPageModule.forChild(ListContributionsPage),
  ],
})
export class ListContributionsPageModule {}
