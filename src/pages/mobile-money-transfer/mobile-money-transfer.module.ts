import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MobileMoneyTransferPage } from './mobile-money-transfer';

@NgModule({
  declarations: [
    MobileMoneyTransferPage,
  ],
  imports: [
    IonicPageModule.forChild(MobileMoneyTransferPage),
  ],
})
export class MobileMoneyTransferPageModule {}
