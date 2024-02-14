import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VerifyBankAccountPage } from './verify-bank-account';

@NgModule({
  declarations: [
    VerifyBankAccountPage,
  ],
  imports: [
    IonicPageModule.forChild(VerifyBankAccountPage),
  ],
})
export class VerifyBankAccountPageModule {}
