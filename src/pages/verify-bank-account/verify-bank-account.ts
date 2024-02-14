import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ActionSheetController, Platform, AlertController, LoadingController, ModalController } from 'ionic-angular';
import { Storage } from "@ionic/storage";
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import 'rxjs/add/operator/take';
import { HttpClient, HttpHeaders } from '@angular/common/http';

/*import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';*/

import { LoginPage } from '../login/login';
import { AngularFireAuth } from 'angularfire2/auth';
//import { LoadingProvider } from '../../providers/loading/loading';
import { AnalysisPage } from '../analysis/analysis';
import { AddBankAccountPage } from '../add-bank-account/add-bank-account';

/**
 * Generated class for the VerifyBankAccountPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-verify-bank-account',
  templateUrl: 'verify-bank-account.html',
})
export class VerifyBankAccountPage {

  	verifyBankAccountData = { otp1: '', otp2: '', otp3: '', otp4: '' };
	//authentication_code_val: any = '';
	VerifyBankAccountPageForm : FormGroup;
	otp1: AbstractControl;
	otp2: AbstractControl;
	otp3: AbstractControl;
	otp4: AbstractControl;
	loading: any;
	modalDismissData: any;
	customerBankAccountId: any;
	message: any;
	token: any;

	
	//, public camera: Camera, public file: File, public filePath: FilePath,public loadingProvider: LoadingProvider
	constructor(public modalCtrl: ModalController, public platform: Platform, public loadingCtrl: LoadingController, public http: HttpClient, public storage: Storage, public alertCtrl: AlertController, public actionSheetCtrl: ActionSheetController, public toastCtrl: ToastController, public afAuth: AngularFireAuth, public fb: FormBuilder, public navCtrl: NavController, public navParams: NavParams) {
		this.VerifyBankAccountPageForm = this.fb.group({
			'otp1' : [null, Validators.compose([Validators.required])],
			'otp2': [null, Validators.compose([Validators.required])],
			'otp3': [null, Validators.compose([Validators.required])],
			'otp4': [null, Validators.compose([Validators.required])]
		});
		
		this.otp1 = this.VerifyBankAccountPageForm.controls['otp1'];
        this.otp2 = this.VerifyBankAccountPageForm.controls['otp2'];
		this.otp3 = this.VerifyBankAccountPageForm.controls['otp3'];
        this.otp4 = this.VerifyBankAccountPageForm.controls['otp4'];
		this.customerBankAccountId = navParams.get('customerBankAccountId');
		this.message = navParams.get('message');
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad VerifyBankAccountPage');
		this.presentToast({message: this.message});
	}
  
	doVerifyBankAccount(verifyBankAccountData){
		console.log('-----------1');
		console.log(verifyBankAccountData);
		let header = new HttpHeaders();
		header = header.set('Content-Type', 'application/x-www-form-urlencoded');
		header = header.set('Accept-Language', 'en-US,en;q=0.5');
		this.storage.get('zambia_bank_customer_token').then((val2) => {
			this.token = val2;
			header = header.set('auth_token', this.token);
		
			const httpOptions = {headers: header};
			var form_params = "";
				
			//console.log(this.mobileNumber.trim().substring(1));
			form_params = form_params + "&customerBankAccountId=" + encodeURI(this.customerBankAccountId);
			form_params = form_params + "&otp=" + encodeURI(this.verifyBankAccountData.otp1.trim()+""+this.verifyBankAccountData.otp2.trim()+""+this.verifyBankAccountData.otp3.trim()+""+this.verifyBankAccountData.otp4.trim());
			
			var parameter = form_params;
			this.loading = this.loadingCtrl.create({
				content: 'Please wait...'
			});
			this.loading.present();
			this.http.post<AccountVerify>("http://localhost:8080/EKwachaWebService/NCE/services/CustomerServices/confirmBankAccountAddition", parameter, httpOptions).subscribe(
				res => {
					this.loading.dismiss();
					let status: any = null;
					status = res.status;
					console.log(res);
					console.log(status);
					if(status==0)
					{
						this.storage.get('zambia_bank_customer_accounts').then((val) => {
							console.log(val);
							var currentAccountList = {};
							if(val!=null)
							{
								currentAccountList = JSON.parse(val);
							}
							this.storage.get('zambia_bank_loggedInUser').then((userStr) => {
								var userStrJS = JSON.parse(userStr);
								var userKey = "accts" + userStrJS.id;
								var userAccts = currentAccountList[userKey];
								if(userAccts!=undefined && userAccts!=null)
								{
								
								}
								else
								{
									userAccts = [];
								}
								var newAccount = {customerBankUniqueId: '', customerBankAccountName:'', customerBankAccountId:'', customerBankAccountNumber:'', 
									customerAccountName:'', customerAccountId:'', customerBankId:'', customerBankName:'', accountType:'', customerAccountNumber: '', logoUrl: 'default.png'};
								newAccount.customerBankUniqueId = res.customerBankUniqueId;
								newAccount.customerBankAccountName = res.customerBankAccountName;
								newAccount.customerBankAccountId = res.customerBankAccountId;
								newAccount.customerBankAccountNumber = res.customerBankAccountNumber;
								newAccount.customerAccountNumber = res.customerAccountNumber;
								newAccount.customerAccountName = res.customerAccountName;
								newAccount.customerAccountId = res.customerAccountId;
								newAccount.customerBankId = res.customerBankId;
								newAccount.customerBankName = res.customerBankName;
								newAccount.accountType = res.accountType;
								newAccount.logoUrl = res.logoUrl;
								userAccts.push(newAccount);
								currentAccountList[userKey] = userAccts;
								console.log(currentAccountList);
								this.storage.set('zambia_bank_customer_accounts', JSON.stringify(currentAccountList)).then(rp => {
									console.log(rp);
									this.navCtrl.setRoot(AnalysisPage);
								});
								
							});
						});
						this.presentToast({message: res.message});
					}
					else
					{
						this.presentToast({message: res.message});
					}
				},
				err => {
					this.loading.dismiss();
					this.presentToast({message: 'Oops! We experienced an issue setting you up. Retry again'});
				}
			);
		});
	}
	
	presentToast(err) {
		const toast = this.toastCtrl.create({
			message: err.message,
			duration: 3000,
			position: 'bottom'
		});

		toast.present();
	}

	
	dismiss()
	{
		this.navCtrl.setRoot(AddBankAccountPage);
	}
}



interface AccountVerify{
	status: any;
	message: any;
	customerBankUniqueId: any;
	customerBankAccountName: any;
	customerBankAccountId: any;
	customerBankAccountNumber: any;
	customerAccountNumber: any;
	customerAccountName: any;
	customerAccountId: any;
	customerBankId: any
	customerBankName: any;
	accountType: any;
	logoUrl: any;
}
