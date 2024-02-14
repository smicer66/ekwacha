import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OneBankPage } from './one-bank';

@NgModule({
  declarations: [
    OneBankPage,
  ],
  imports: [
    IonicPageModule.forChild(OneBankPage),
  ],
})
export class OneBankPageModule {}
