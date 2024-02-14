import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NimaPaymentsPage } from './nima-payments';

@NgModule({
  declarations: [
    NimaPaymentsPage,
  ],
  imports: [
    IonicPageModule.forChild(NimaPaymentsPage),
  ],
})
export class NimaPaymentsPageModule {}
