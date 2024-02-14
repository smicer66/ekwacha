import { Component, ViewChild } from '@angular/core';
import { IonicPage, Nav, NavController, NavParams, ToastController, ActionSheetController, AlertController, LoadingController } from 'ionic-angular';
import { FormBuilder } from '@angular/forms';
import { Storage } from "@ionic/storage";
import 'rxjs/add/operator/take';
import { HttpClient } from '@angular/common/http';

/*import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';*/

import { AngularFireAuth } from 'angularfire2/auth';
//import { LoadingProvider } from '../../providers/loading/loading';
import { OpenNewAccountPage } from '../open-new-account/open-new-account';
import { LoginPage } from '../login/login';
import { AddBankAccountPage } from '../add-bank-account/add-bank-account';
import { ManageAccountsPage } from '../manage-accounts/manage-accounts';

/**
 * Generated class for the AccountsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-accounts',
  templateUrl: 'accounts.html',
})
export class AccountsPage {
	@ViewChild(Nav) nav: Nav;

	constructor(public storage: Storage, public alertCtrl: AlertController, public loadingCtrl: LoadingController, public http: HttpClient, public actionSheetCtrl: ActionSheetController, public toastCtrl: ToastController, public afAuth: AngularFireAuth, public fb: FormBuilder, public navCtrl: NavController, public navParams: NavParams) {
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad AccountsPage');
	}
  
	openNewAccount(){
		//let params = {};
		this.navCtrl.push(AddBankAccountPage);
	}
	
	
	manageBankAccounts()
	{
		this.navCtrl.push(ManageAccountsPage);
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
