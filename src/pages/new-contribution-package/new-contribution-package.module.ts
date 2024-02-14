import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewContributionPackagePage } from './new-contribution-package';

@NgModule({
  declarations: [
    NewContributionPackagePage,
  ],
  imports: [
    IonicPageModule.forChild(NewContributionPackagePage),
  ],
})
export class NewContributionPackagePageModule {}
