import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PayContributionPage } from './pay-contribution';

@NgModule({
  declarations: [
    PayContributionPage,
  ],
  imports: [
    IonicPageModule.forChild(PayContributionPage),
  ],
})
export class PayContributionPageModule {}
