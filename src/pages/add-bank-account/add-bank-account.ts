import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ActionSheetController, Platform, AlertController, LoadingController, ViewController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import 'rxjs/add/operator/take';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from "@ionic/storage";

/*import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';*/

import { AngularFireAuth } from 'angularfire2/auth';
import { VerifyBankAccountPage } from '../verify-bank-account/verify-bank-account';
import { OneBankPage } from '../one-bank/one-bank';
import { AnalysisPage } from '../analysis/analysis';
import { ManageAccountsPage } from '../manage-accounts/manage-accounts';

/**
 * Generated class for the AddBankAccountPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-bank-account',
  templateUrl: 'add-bank-account.html',
})
export class AddBankAccountPage {

	addBankAccountData = { bank: '', accountName: '', accountNumber: '' };
	//account_number_val: any = '';
	//reg_code: any = '';
	addBankAccountPageForm : FormGroup;
	bank: AbstractControl;
	accountName: AbstractControl;
	accountNumber: AbstractControl;
	loading: any;
	bankList: any;
	token: any;
	fromWhere: any;

	
	//, public camera: Camera, public file: File, public filePath: FilePath,public loadingProvider: LoadingProvider
	constructor(public viewCtrl: ViewController, public platform: Platform, public http: HttpClient, public storage: Storage, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public actionSheetCtrl: ActionSheetController, public toastCtrl: ToastController, public afAuth: AngularFireAuth, public fb: FormBuilder, public navCtrl: NavController, public navParams: NavParams){
		this.addBankAccountPageForm = this.fb.group({
			'bank' : [null, Validators.compose([Validators.required])],
			'accountName': [null, Validators.compose([Validators.required])],
			'accountNumber': [null, Validators.compose([Validators.required])]
		});

        this.bank = this.addBankAccountPageForm.controls['bank'];
        this.accountName = this.addBankAccountPageForm.controls['accountName'];
        this.accountNumber = this.addBankAccountPageForm.controls['accountNumber'];
		this.fromWhere = navParams.get('fromWhere');
		console.log(navParams);
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad AddBankAccountPage');
		this.storage.get('zambia_bank_list').then((val) => {
			this.bankList = JSON.parse(val);
			console.log(this.bankList);
		});
	}
  
	doAddBankAccount(addBankAccountData){
		console.log(addBankAccountData);
		var parameter = "";
		console.log(parameter);
		let header = new HttpHeaders();
		header = header.set('Content-Type', 'application/x-www-form-urlencoded');
		header = header.set('Accept-Language', 'en-US,en;q=0.5');
		this.storage.get('zambia_bank_customer_token').then((val2) => {
			this.token = val2;
			header = header.set('auth_token', this.token);
			
			const httpOptions = {headers: header};
			var form_params = "";
				
			console.log(this.addBankAccountData.bank.trim().substring(1));
			form_params = form_params + "&bankId=" + encodeURI(this.addBankAccountData.bank.trim());
			form_params = form_params + "&accountNumber=" + encodeURI(this.addBankAccountData.accountNumber.trim());
			form_params = form_params + "&accountName=" + encodeURI(this.addBankAccountData.accountName.trim());
			
			this.loading = this.loadingCtrl.create({
				content: 'Please wait...'
			});
			this.loading.present();
			
			parameter = form_params;
			let url = "http://localhost:8080/EKwachaWebService/NCE/services/CustomerServices/addBankAccount";
			this.http.post<NewBankAccountReponse>(url, parameter, httpOptions).subscribe(
				res => {
					this.loading.dismiss();
					let status: any = null;
					status = res.status;
					console.log(res);
					console.log(status);
					if(status==0)
					{
						let accounts = [];
						this.navCtrl.setRoot(VerifyBankAccountPage, {message: res.message, customerBankAccountId: res.customerBankAccountId});
					}
					else
					{
						console.log(-1);
						this.presentToast({message: res.message});
					}
				},
				err => {
					this.loading.dismiss();
					console.log('Error occured');
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
		if(this.fromWhere==0)
		{
			this.navCtrl.setRoot(OneBankPage);
		}
		else if(this.fromWhere==1)
		{
			this.navCtrl.setRoot(ManageAccountsPage);
		}
		else
		{
			this.navCtrl.setRoot(AnalysisPage);
		}
	}
}

interface NewBankAccountReponse{
	status: any;
	message: any;
	customerBankUniqueId: any;
	customerBankAccountId: any;
}


