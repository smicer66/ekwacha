import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ViewLoanTransactionsPage } from './view-loan-transactions';

@NgModule({
  declarations: [
    ViewLoanTransactionsPage,
  ],
  imports: [
    IonicPageModule.forChild(ViewLoanTransactionsPage),
  ],
})
export class ViewLoanTransactionsPageModule {}
