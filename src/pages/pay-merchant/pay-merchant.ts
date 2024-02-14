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

import { BillPaymentPage } from '../bill-payment/bill-payment';
import { LoginPage } from '../login/login';
//import { LoadingProvider } from '../../providers/loading/loading';


interface PayMerchantRespInt{
	status: any;
	response_msg: any;
	message: any;
	verifyResponse: any;
}

/**
 * Generated class for the PayMerchantPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pay-merchant',
  templateUrl: 'pay-merchant.html',
})
export class PayMerchantPage {
	
	payMerchantData = { merchant_code: '', transaction_code: '', pin1: '', pin2: '', pin3: '', pin4: '', isVerified: false, amount: '' };
	payMerchantForm : FormGroup;
	merchant_code: AbstractControl;
	transaction_code: AbstractControl;
	pin1: AbstractControl;
	pin2: AbstractControl;
	pin3: AbstractControl;
	pin4: AbstractControl;
	amount: AbstractControl;
	accountlist: any;
	
	token: any;
	loading: any;
	merchantName: any = '';
	merchantMobile: any = '';
	merchantAddress: any = '';
	merchantTransactionId: any = '';
	
	
	//, public camera: Camera, public file: File, public filePath: FilePath,public loadingProvider: LoadingProvider
	constructor(public platform: Platform, public storage: Storage, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public http: HttpClient, public actionSheetCtrl: ActionSheetController, public toastCtrl: ToastController, public afAuth: AngularFireAuth, public fb: FormBuilder, public navCtrl: NavController, public navParams: NavParams) {
		this.payMerchantForm = this.fb.group({
			'merchant_code' : [null, Validators.compose([Validators.required])],
			'transaction_code': [null, Validators.compose([])],
			'amount': [null, Validators.compose([Validators.required])],
			'pin1': [null, Validators.compose([Validators.required])],
			'pin2': [null, Validators.compose([Validators.required])],
			'pin3': [null, Validators.compose([Validators.required])],
			'pin4': [null, Validators.compose([Validators.required])]
		});

        this.merchant_code = this.payMerchantForm.controls['merchant_code'];
        this.transaction_code = this.payMerchantForm.controls['transaction_code'];
        this.pin1 = this.payMerchantForm.controls['pin1'];
		this.pin2 = this.payMerchantForm.controls['pin2'];
		this.pin3 = this.payMerchantForm.controls['pin3'];
		this.pin4 = this.payMerchantForm.controls['pin4'];
        this.amount = this.payMerchantForm.controls['amount'];
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad PayMerchantPage');
		this.storage.get('zambia_bank_customer_accounts').then((val) => {
			this.accountlist = JSON.parse(val);
		});
	}

	
	verifyMerchant(merchantCode)
	{
		this.storage.get('zambia_bank_customer_token').then((val) => {
			this.token = val;
			let header = new HttpHeaders();
			header = header.set('Content-Type', 'application/x-www-form-urlencoded');
			header = header.set('Accept-Language', 'en-US,en;q=0.5');
			header = header.set('auth_token', this.token);
			
			
			const httpOptions = {headers: header};
			var parameter = "";
			let url = "";
			url = "http://localhost:8080/EKwachaWebService/NCE/services/BillPaymentServices/verifyMerchantCode";
			var form_params = "";
			form_params = form_params + "&merchantCode=" + encodeURI(this.payMerchantData.merchant_code);
			parameter = form_params;	
			console.log(parameter);
				
			
			
			this.loading = this.loadingCtrl.create({
				content: 'Loading View. Please wait...'
			});
			this.loading.present();
			this.http.post<PayMerchantRespInt>(url, parameter, httpOptions).subscribe(
				res1 => {
					console.log(res1);
					this.loading.dismiss();
					if(res1.status==0)
					{
						var verifyResponse = JSON.parse(res1.verifyResponse);
						this.payMerchantData.isVerified = true;
						
						this.merchantName = verifyResponse.merchantName;
						this.merchantMobile = verifyResponse.merchantMobile;
						this.merchantAddress = verifyResponse.merchantAddress;
						this.merchantTransactionId = verifyResponse.merchantTransactionId;
						this.presentToast({message: 'Merchant Verified! Proceed to pay'});
					}
					else
					{
						this.payMerchantData.isVerified = false;
						this.merchantName = '';
						this.merchantMobile = '';
						this.merchantAddress = '';
						this.merchantTransactionId = ''
						this.presentToast({message: res1.message});
					}
				},
				err => {
					this.payMerchantData.isVerified = false;
					this.merchantName = '';
					this.merchantMobile = '';
					this.merchantAddress = '';
					this.merchantTransactionId = ''
					this.loading.dismiss();
					console.log('Error occured');
					this.presentToast({message: 'Oops! Seems we experienced a connectivity issue while trying to verifying the bank account'});
					this.navCtrl.setRoot(LoginPage);
				}
			);
		});
		
	}
	
	initiateMerchantPayment(payMerchantData)
	{
		this.storage.get('zambia_bank_customer_token').then((val) => {
			this.token = val;
			let header = new HttpHeaders();
			header = header.set('Content-Type', 'application/x-www-form-urlencoded');
			header = header.set('Accept-Language', 'en-US,en;q=0.5');
			header = header.set('auth_token', this.token);
			
			var orderRef = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15).toUpperCase();
			const httpOptions = {headers: header};
			var form_params = "";
			form_params = form_params + "&merchantOrderNo=" + encodeURI(this.payMerchantData.transaction_code);
			form_params = form_params + "&merchantCode=" + encodeURI(this.payMerchantData.merchant_code);
			form_params = form_params + "&amount=" + encodeURI(this.payMerchantData.amount);
			form_params = form_params + "&pin=" + encodeURI(this.payMerchantData.pin1 + "" + this.payMerchantData.pin2 + "" + this.payMerchantData.pin3 + "" + this.payMerchantData.pin4);
			form_params = form_params + "&orderRef=" + encodeURI(orderRef);
			var parameter = form_params;	
			console.log(parameter);
			let url = "http://localhost:8080/EKwachaWebService/NCE/services/BillPaymentServices/merchantPayment";
			this.loading = this.loadingCtrl.create({
				content: 'Initiating Payment. Please wait...'
			});
			this.loading.present();
			this.http.post<PayMerchantRespInt>(url, parameter, httpOptions).subscribe(
				res => {
					this.loading.dismiss();
					let status: any = null;
					status = res.status;
					console.log(res);
					console.log(status);
					if(res.status==0)
					{
						this.navCtrl.setRoot(BillPaymentPage, {message: res.message});
					}
					else
					{
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

