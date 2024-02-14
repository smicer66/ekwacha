import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListContributionPackagesPage } from './list-contribution-packages';

@NgModule({
  declarations: [
    ListContributionPackagesPage,
  ],
  imports: [
    IonicPageModule.forChild(ListContributionPackagesPage),
  ],
})
export class ListContributionPackagesPageModule {}
