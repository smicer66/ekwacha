import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ActionSheetController, AlertController, Platform, LoadingController } from 'ionic-angular';
import { Storage } from "@ionic/storage";
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import 'rxjs/add/operator/take';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AngularFireAuth } from 'angularfire2/auth';

import { LoginPage } from '../login/login';
import { TabsPage } from '../tabs/tabs';


interface CableTvListRespInt{
	status: any;
	list: any;
	packagesAvailable: any;
	message: any;
}

interface CableTvPurchaseRespInt{
	status: any;
	response_msg: any;
	message: any;
}

interface AccountVerify{
	status: any;
	response_msg: any;
	message: any;
	verifyResponse: any;
}

/**
 * Generated class for the CableTvPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-cable-tv',
  templateUrl: 'cable-tv.html',
})
export class CableTvPage {

	cableTVData = { registeredTo: '-', currentPackage: '-', subscriptionExpires: '-', cable_provider: '', subscription_type: '', decoder_number: '', pin1: '', pin2: '', pin3: '', pin4: '', isVerified: false };
	cableTVForm : FormGroup;
	cable_provider: AbstractControl;
	subscription_type: AbstractControl;
	decoder_number: AbstractControl;
	pin1: AbstractControl;
	pin2: AbstractControl;
	pin3: AbstractControl;
	pin4: AbstractControl;
	
	token: any;
	cable_tv_providerlist: any;
	subscriptiontypelist: any;
	accountlist: any;
	loading: any;
	allPackageslist: any;
	
	//, public camera: Camera, public file: File, public filePath: FilePath,public loadingProvider: LoadingProvider
	constructor(public platform: Platform, public storage: Storage, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public http: HttpClient, public actionSheetCtrl: ActionSheetController, public toastCtrl: ToastController, public afAuth: AngularFireAuth, public fb: FormBuilder, public navCtrl: NavController, public navParams: NavParams) {
		this.cableTVForm = this.fb.group({
			'cable_provider' : [null, Validators.compose([Validators.required])],
			'subscription_type': [null, Validators.compose([Validators.required])],
			'decoder_number': [null, Validators.compose([Validators.required])],
			'pin1': [null, Validators.compose([Validators.required])],
			'pin2': [null, Validators.compose([Validators.required])],
			'pin3': [null, Validators.compose([Validators.required])],
			'pin4': [null, Validators.compose([Validators.required])]
		});

        this.cable_provider = this.cableTVForm.controls['cable_provider'];
        this.subscription_type = this.cableTVForm.controls['subscription_type'];
        this.decoder_number = this.cableTVForm.controls['decoder_number'];
        this.pin1 = this.cableTVForm.controls['pin1'];
        this.pin2 = this.cableTVForm.controls['pin2'];
        this.pin3 = this.cableTVForm.controls['pin3'];
        this.pin4 = this.cableTVForm.controls['pin4'];
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad CableTvPage');
		
		this.storage.get('zambia_bank_customer_accounts').then((val) => {
			this.accountlist = JSON.parse(val);
			this.storage.get('zambia_cable_provider_list').then((val) => {
				this.cable_tv_providerlist = JSON.parse(val);
				this.storage.get('zambia_cable_tv_package_list').then((val) => {
					this.allPackageslist = JSON.parse(val);
					console.log(this.subscriptiontypelist);
				});
			});
		});
		
		
	}
	
	onNetworkChange(selectedValue: any){
		
		console.log(this.allPackageslist);
		//this.subscriptiontypelist = this.allPackageslist[this.cableTVData.cable_provider];
		console.log(this.subscriptiontypelist);
		var newSubList = [];
		for(var key of Object.keys(this.allPackageslist[this.cableTVData.cable_provider]))
		{
			var obj = {name: '', amount: ''};
			obj['name'] = key;
			obj['amount'] = this.allPackageslist[this.cableTVData.cable_provider][key];
			newSubList.push(obj);
		}
		this.subscriptiontypelist = newSubList;
		console.log(this.subscriptiontypelist);
	
	
		let header = new HttpHeaders();
		header = header.set('Content-Type', 'application/json; charset=utf-8');
		header = header.set('Accept', 'application/json');
		
		//const httpOptions = {headers: header};
		//var parameter = JSON.stringify({});
		let url = "http://localhost:8080/EKwachaWebService/NCE/services/BillPaymentServices/getCableTvPackages?cableTvProviderId=" + this.cableTVData.cable_provider;
		this.http.get<CableTvListRespInt>(url).subscribe(
			res => {
				let status: any = null;
				status = res.status;
				console.log(res);
				console.log(status);
				if(res.status==0)
				{
					this.subscriptiontypelist = res.packagesAvailable;
					
				}
				else
				{
					this.presentToast({message: res.message});
					this.subscriptiontypelist = [];
				}
			},
			err => {
			  console.log('Error occured');
			}
		);
	}
	
	
	verifyCableNo(cableNo: any){
		this.storage.get('zambia_bank_customer_token').then((val) => {
			this.token = val;
			let header = new HttpHeaders();
			header = header.set('Content-Type', 'application/x-www-form-urlencoded');
			header = header.set('Accept-Language', 'en-US,en;q=0.5');
			header = header.set('auth_token', this.token);
			
			
			const httpOptions = {headers: header};
			var parameter = "";
			let url = "";
			url = "http://localhost:8080/EKwachaWebService/NCE/services/BillPaymentServices/verifyCableTvDevice";
			var form_params = "";
			form_params = form_params + "&deviceNumber=" + encodeURI(this.cableTVData.decoder_number);
			form_params = form_params + "&cableTvProviderId=" + encodeURI(this.cableTVData.cable_provider);
			parameter = form_params;	
			console.log(parameter);
				
			
			
			this.loading = this.loadingCtrl.create({
				content: 'Loading View. Please wait...'
			});
			this.loading.present();
			this.http.post<AccountVerify>(url, parameter, httpOptions).subscribe(
				res1 => {
					console.log(res1);
					this.loading.dismiss();
					if(res1.status==0)
					{
						var verifyResponse = JSON.parse(res1.verifyResponse);
						this.cableTVData.registeredTo= verifyResponse.accountName;
						this.cableTVData.currentPackage=  verifyResponse.currentPackageName;
						this.cableTVData.subscriptionExpires = verifyResponse.currectPackageExpires;
						this.cableTVData.isVerified = true;
						this.presentToast({message: 'Box/Decoder number verified! Proceed to pay'});
					}
					else
					{
						this.presentToast({message: res1.message});
					}
				},
				err => {
					this.loading.dismiss();
					console.log('Error occured');
					this.presentToast({message: 'Oops! Seems we experienced a connectivity issue while trying to verifying the bank account'});
					this.navCtrl.setRoot(LoginPage);
				}
			);
		});
	}
	
	
	doPurchaseCableSubscription(cableTVData)
	{
		console.log(cableTVData);
		
		this.storage.get('zambia_bank_customer_token').then((val) => {
			this.token = val;
			console.log(this.token);
			let header = new HttpHeaders();
			header = header.set('Content-Type', 'application/x-www-form-urlencoded');
			header = header.set('Accept-Language', 'en-US,en;q=0.5');
			header = header.set('auth_token', this.token);
			
			var orderRef = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15).toUpperCase();
			const httpOptions = {headers: header};
			var parameter = "";
			let url = "";
			url = "http://localhost:8080/EKwachaWebService/NCE/services/BillPaymentServices/cableTvPayment";
			var form_params = "";
			form_params = form_params + "&deviceNumber=" + encodeURI(this.cableTVData.decoder_number);
			form_params = form_params + "&cableTvProviderId=" + encodeURI(this.cableTVData.cable_provider);
			form_params = form_params + "&cableTvPackageName=" + encodeURI(this.cableTVData.subscription_type);
			form_params = form_params + "&pin=" + encodeURI(this.cableTVData.pin1 + "" + this.cableTVData.pin2 + "" + this.cableTVData.pin3 + "" + this.cableTVData.pin4);
			form_params = form_params + "&orderRef=" + encodeURI(orderRef);
			parameter = form_params;	
			console.log(parameter);
			
			this.loading = this.loadingCtrl.create({
				content: 'Loading View. Please wait...'
			});
			this.loading.present();
			this.http.post<CableTvPurchaseRespInt>(url, parameter, httpOptions).subscribe(
				res => {
					let status: any = null;
					status = res.status;
					console.log(res);
					console.log(status);
					this.loading.dismiss();
					if(res.status==0)
					{
						this.navCtrl.setRoot(TabsPage, {message: res.message});
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
		loading.dismiss();
		this.token = null;
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
