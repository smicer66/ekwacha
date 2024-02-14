import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ActionSheetController, AlertController, Platform, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Storage } from "@ionic/storage";
import 'rxjs/add/operator/take';
import { HttpClient, HttpHeaders } from '@angular/common/http';

/*import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';*/

import { AngularFireAuth } from 'angularfire2/auth';

import { LoginPage } from '../login/login';
import { BillPaymentPage } from '../bill-payment/bill-payment';
//import { LoadingProvider } from '../../providers/loading/loading';

/**
 * Generated class for the PayUtilitiesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

interface UtilityListRespInt{
	status: any;
	list: any;
	response_msg: any;
	sourcelist: any;
	message: any;
	currentPackageName: any;
	amountOwed: any;
	accountName: any;
}

@IonicPage()
@Component({
  selector: 'page-pay-utilities',
  templateUrl: 'pay-utilities.html',
})
export class PayUtilitiesPage {

	payUtilityData = { bill_provider: '', provider_id_number: '', amount: '', pin1: '', pin2: '', pin3: '', pin4: '' };
	payUtilityDataForm : FormGroup;
	bill_provider: AbstractControl;
	provider_id_number: AbstractControl;
	amount: AbstractControl;
	pin1: AbstractControl;
	pin2: AbstractControl;
	pin3: AbstractControl;
	pin4: AbstractControl;
	
	utilityproviderlist: any = [];
	accountlist: any = [];
	token: any;
	loading: any;
	selectedUtilityProvider: any;
	isVerified: any = false;
	customerName: any = undefined;
	billerNumber: any = undefined;
	amountOwed: any = undefined;
	isPostPaid: any = undefined;
	
	//, public camera: Camera, public file: File, public filePath: FilePath,public loadingProvider: LoadingProvider
	constructor(public platform: Platform, public actionSheetCtrl: ActionSheetController, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public storage: Storage, public http: HttpClient, public toastCtrl: ToastController, public afAuth: AngularFireAuth, public fb: FormBuilder, public navCtrl: NavController, public navParams: NavParams) {
		this.payUtilityDataForm = this.fb.group({
			'bill_provider' : [null, Validators.compose([Validators.required])],
			'provider_id_number': [null, Validators.compose([Validators.required])],
			'amount': [null, Validators.compose([Validators.required])],
			'pin1': [null, Validators.compose([Validators.required])],
			'pin2': [null, Validators.compose([Validators.required])],
			'pin3': [null, Validators.compose([Validators.required])],
			'pin4': [null, Validators.compose([Validators.required])]
		});

        this.bill_provider = this.payUtilityDataForm.controls['bill_provider'];
        this.provider_id_number = this.payUtilityDataForm.controls['provider_id_number'];
        this.amount = this.payUtilityDataForm.controls['amount'];
        this.pin1 = this.payUtilityDataForm.controls['pin1'];
        this.pin2 = this.payUtilityDataForm.controls['pin2'];
        this.pin3 = this.payUtilityDataForm.controls['pin3'];
        this.pin4 = this.payUtilityDataForm.controls['pin4'];
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad BuypayUtilityDataPage');
		this.storage.get('zambia_utility_provider_list').then((val) => {
			console.log(val);
			this.utilityproviderlist = JSON.parse(val);
			console.log(this.utilityproviderlist);
		});
	}
	
	
	
	getUtilityProviderByProviderId(selectedValue: any)
	{
		console.log(selectedValue);
		this.storage.get('zambia_utility_provider_list').then((val) => {
			console.log(val);
			var storedUtilityProvider = JSON.parse(val);
			for(var i=0; i<storedUtilityProvider.length; i++)
			{
				if(storedUtilityProvider[i].id==selectedValue)
				{
					this.selectedUtilityProvider = storedUtilityProvider[i];
				}
			}
		});
	}
	
	
	
	doPayUtility(payUtilityData)
	{
		this.storage.get('zambia_bank_customer_token').then((val) => {
			this.token = val;
			let header = new HttpHeaders();
			header = header.set('Content-Type', 'application/x-www-form-urlencoded');
			header = header.set('Accept-Language', 'en-US,en;q=0.5');
			header = header.set('auth_token', this.token);
			
			
			const httpOptions = {headers: header};
			var parameter = JSON.stringify({bill_provider:this.payUtilityData.bill_provider, provider_id_number:this.payUtilityData.provider_id_number, 
				amount:this.payUtilityData.amount, pin:(this.payUtilityData.pin1 + "" + this.payUtilityData.pin2 + "" + this.payUtilityData.pin3 + "" + this.payUtilityData.pin4) });
			console.log(parameter);
			
			var parameter = "";
			let url = "";
			var orderRef = Math.random().toString(36).substring(2, 15).toUpperCase() + Math.random().toString(36).substring(2, 15).toUpperCase();
			url = "http://localhost:8080/EKwachaWebService/NCE/services/BillPaymentServices/utilityPayment";
			var form_params = "";
			form_params = form_params + "&utilityProviderId=" + encodeURI(this.payUtilityData.bill_provider);
			form_params = form_params + "&pin=" + encodeURI(this.payUtilityData.pin1 + "" + this.payUtilityData.pin2 + "" + this.payUtilityData.pin3 + "" + this.payUtilityData.pin4);
			form_params = form_params + "&deviceNumber=" + encodeURI(this.payUtilityData.provider_id_number);
			form_params = form_params + "&amount=" + encodeURI(this.payUtilityData.amount);
			form_params = form_params + "&orderRef=" + encodeURI(orderRef);
			parameter = form_params;	
			console.log(parameter);
				
			
			
			this.loading = this.loadingCtrl.create({
				content: 'Loading View. Please wait...'
			});
			this.loading.present();
			this.http.post<UtilityListRespInt>(url, parameter, httpOptions).subscribe(
				res1 => {
					console.log(res1);
					this.loading.dismiss();
					if(res1.status==0)
					{
						this.navCtrl.setRoot(BillPaymentPage, {message: res1.message});
					}
					else
					{
						this.presentToast({message: res1.message});
					}
				},
				err => {					
					this.loading.dismiss();
					console.log('Error occured');
					this.presentToast({message: 'Oops! Seems we experienced a connectivity issue while trying to pay your utility'});
					this.navCtrl.setRoot(BillPaymentPage);
				}
			);
		});
	}
	
	
	
	verifyUtilityProvider(provider_id_number: any){
		this.storage.get('zambia_bank_customer_token').then((val) => {
			this.token = val;
			let header = new HttpHeaders();
			header = header.set('Content-Type', 'application/x-www-form-urlencoded');
			header = header.set('Accept-Language', 'en-US,en;q=0.5');
			header = header.set('auth_token', this.token);
			
			
			const httpOptions = {headers: header};
			var parameter = "";
			let url = "";
			url = "http://localhost:8080/EKwachaWebService/NCE/services/BillPaymentServices/verifyUtilityBillerId";
			var form_params = "";
			form_params = form_params + "&billerNumber=" + encodeURI(this.payUtilityData.provider_id_number);
			form_params = form_params + "&utilityProviderId=" + encodeURI(this.payUtilityData.bill_provider);
			parameter = form_params;	
			console.log(parameter);
				
			
			
			this.loading = this.loadingCtrl.create({
				content: 'Loading View. Please wait...'
			});
			this.loading.present();
			this.http.post<UtilityListRespInt>(url, parameter, httpOptions).subscribe(
				res1 => {
					console.log(res1);
					this.loading.dismiss();
					if(res1.status==0)
					{
						//var verifyResponse = JSON.parse(res1.verifyResponse);
						this.customerName= res1.accountName;
						this.billerNumber=  res1.currentPackageName;
						this.amountOwed = res1.amountOwed!=undefined && res1.amountOwed!=null ? res1.amountOwed : '';
						this.payUtilityData.amount = res1.amountOwed!=undefined && res1.amountOwed!=null ? res1.amountOwed : '';
						this.isPostPaid = res1.amountOwed!=undefined && res1.amountOwed!=null ? true : false;
						this.isVerified = true;
						this.presentToast({message: 'Box/Decoder number verified! Proceed to pay'});
					}
					else
					{
						this.customerName= undefined;
						this.billerNumber=  undefined;
						this.amountOwed = undefined;
						this.isPostPaid = undefined;
						this.payUtilityData.amount = '';
						this.isVerified = false;
						this.presentToast({message: res1.message});
					}
				},
				err => {
					this.customerName= undefined;
					this.billerNumber=  undefined;
					this.amountOwed = undefined;
					this.isPostPaid = undefined;
					this.payUtilityData.amount = '';
					this.isVerified = false;
					
					this.loading.dismiss();
					console.log('Error occured');
					this.presentToast({message: 'Oops! Seems we experienced a connectivity issue while trying to verifying the bank account'});
					this.navCtrl.setRoot(LoginPage);
				}
			);
		});
	}
	
	logout()
	{
		let loading = this.loadingCtrl.create({
			content: 'Please wait...'
		});
		loading.present();
		this.storage.remove('zambia_bank_customer_token');
		this.storage.remove('zambia_bank_loggedInUser');
		this.token = null;
		loading.dismiss();
		this.navCtrl.setRoot(LoginPage);
		
	}

	
	presentToast(err) {
		const toast = this.toastCtrl.create({
			message: err.message,
			duration: 3000,
			position: 'bottom'
		});

		toast.present();
	}
}
