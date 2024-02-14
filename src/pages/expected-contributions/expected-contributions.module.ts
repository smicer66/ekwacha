import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ExpectedContributionsPage } from './expected-contributions';

@NgModule({
  declarations: [
    ExpectedContributionsPage,
  ],
  imports: [
    IonicPageModule.forChild(ExpectedContributionsPage),
  ],
})
export class ExpectedContributionsPageModule {}
