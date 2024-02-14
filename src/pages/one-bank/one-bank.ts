import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ActionSheetController, Platform, AlertController, LoadingController, ModalController } from 'ionic-angular';
import { Storage } from "@ionic/storage";
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import 'rxjs/add/operator/take';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AngularFireAuth } from 'angularfire2/auth';
//import { LoadingProvider } from '../../providers/loading/loading';
import { AnalysisPage } from '../analysis/analysis';
import { AddBankAccountPage } from '../add-bank-account/add-bank-account';
import { LoginPage } from '../login/login';

/**
 * Generated class for the OneBankPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-one-bank',
  templateUrl: 'one-bank.html',
})
export class OneBankPage {

	currentAccountList: any = {};
	user: any;
	message: any;
	
	
	constructor(public modalCtrl: ModalController, public platform: Platform, public loadingCtrl: LoadingController, public http: HttpClient, public storage: Storage, public alertCtrl: AlertController, public actionSheetCtrl: ActionSheetController, public toastCtrl: ToastController, public afAuth: AngularFireAuth, public fb: FormBuilder, public navCtrl: NavController, public navParams: NavParams) {
		this.message = navParams.get('message');
		console.log(this.message);
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad OneBankPage');
		if(this.message!=null)
		{
			this.presentToast({message: this.message});
		}
		this.storage.get('zambia_bank_loggedInUser').then((userStr) => {
			console.log(userStr);
			if(userStr!=null)
			{
				this.user = JSON.parse(userStr);
				var key = 'accts' + this.user.id;
				
				this.storage.get('zambia_bank_customer_accounts').then((val) => {
					console.log(val);
					this.currentAccountList  = {};
					if(val!=null)
					{
						var accounts = JSON.parse(val);
						console.log(accounts);
						this.currentAccountList = accounts[key]!=undefined && accounts[key]!=null ? accounts[key] : {};
						
						if(this.currentAccountList.length > 0)
						{
							this.navCtrl.setRoot(AnalysisPage);
						}
					}
				});
			}
			else
			{
				this.navCtrl.setRoot(LoginPage);
			}
		});
		//this.storage.get('zambia_bank_customer_accounts').then((userStr) => {
		
	}
	
	addBankAccount()
	{
		console.log('--------------');
		this.navCtrl.setRoot(AddBankAccountPage, {fromWhere: 0});
	}

	presentToast(err) {
		const toast = this.toastCtrl.create(
		{
			message: err.message,
			duration: 3000,
			position: 'bottom'
		});

		toast.present();
	}
}
