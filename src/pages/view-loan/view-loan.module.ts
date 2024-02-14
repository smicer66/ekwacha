import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ViewLoanPage } from './view-loan';

@NgModule({
  declarations: [
    ViewLoanPage,
  ],
  imports: [
    IonicPageModule.forChild(ViewLoanPage),
  ],
})
export class ViewLoanPageModule {}
