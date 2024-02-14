import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController, NavParams, LoadingController } from 'ionic-angular';
import { Storage } from "@ionic/storage";
import { FundsTransferWithinBankPage } from '../funds-transfer-within-bank/funds-transfer-within-bank';
import { FundsTransferSubsidiaryPage } from '../funds-transfer-subsidiary/funds-transfer-subsidiary';
import { FundsTransferOtherBanksPage } from '../funds-transfer-other-banks/funds-transfer-other-banks';
import { FundsTransferInternationalPage } from '../funds-transfer-international/funds-transfer-international';
import { MobileMoneyTransferPage } from '../mobile-money-transfer/mobile-money-transfer';
import { LoginPage } from '../login/login';




/**
 * Generated class for the FundsTransferPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-funds-transfer',
  templateUrl: 'funds-transfer.html',
})
export class FundsTransferPage {

	message: any;
	
	constructor(public storage: Storage, public loadingCtrl: LoadingController, public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController) {
		this.message = navParams.get('message');
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad FundsTransferPage');
		if(this.message!=null)
		{
			this.presentToast({message: this.message});
		}
	}
  
	transferWithinBank() {
		//let params = {};
		this.navCtrl.push(FundsTransferWithinBankPage);
	}

	transferToOtherBank() {
		//let params = {};
		this.navCtrl.push(FundsTransferOtherBanksPage);
	}

	mobileMoneyTransfer() {
		this.navCtrl.push(MobileMoneyTransferPage);
	}
	
	intlTransfer() {
		//let params = {};
		this.navCtrl.push(FundsTransferInternationalPage);
	}
  
	transferToSubsidiary() {
		//let params = {};
		this.navCtrl.push(FundsTransferSubsidiaryPage);
	}

	
	
	
	presentToast(err) {
		const toast = this.toastCtrl.create({
			message: err.message,
			duration: 3000,
			position: 'bottom'
		});

		toast.present();
	}
	

	logout()
	{
		let loading = this.loadingCtrl.create({
			content: 'Please wait...'
		});
		loading.present();
		this.storage.remove('zambia_bank_customer_token');
		this.storage.remove('zambia_bank_loggedInUser');
		loading.dismiss();
		this.navCtrl.setRoot(LoginPage);
		
	}
	
}
