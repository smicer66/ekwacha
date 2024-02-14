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
 * Generated class for the BuyInternetDataPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

interface TelcoListRespInt{
	status: any;
	list: any;
	response_msg: any;
	sourcelist: any;
	message: any;
}

@IonicPage()
@Component({
  selector: 'page-buy-internet-data',
  templateUrl: 'buy-internet-data.html',
})
export class BuyInternetDataPage {

  internetData = { internet_provider: '', subscription_data: '', mobile_number: '', pin1: '', pin2: '', pin3: '', pin4: ''};
	internetDataForm : FormGroup;
	internet_provider: AbstractControl;
	subscription_data: AbstractControl;
	mobile_number: AbstractControl;
	pin1: AbstractControl;
	pin2: AbstractControl;
	pin3: AbstractControl;
	pin4: AbstractControl;
	
	telcolist: any;
	accountlist: any;
	token: any;
	subscription_typelist: any = [];
	allPackageslist: any = [];
	
	loading: any;
	
	//, public camera: Camera, public file: File, public filePath: FilePath, public loadingProvider: LoadingProvider
	constructor(public platform: Platform, public actionSheetCtrl: ActionSheetController, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public storage: Storage, public http: HttpClient, public toastCtrl: ToastController, public afAuth: AngularFireAuth, public fb: FormBuilder, public navCtrl: NavController, public navParams: NavParams) {
		this.internetDataForm = this.fb.group({
			'internet_provider' : [null, Validators.compose([Validators.required])],
			'subscription_data': [null, Validators.compose([Validators.required])],
			'mobile_number': [null, Validators.compose([Validators.required])],
			'pin1': [null, Validators.compose([Validators.required])],
			'pin2': [null, Validators.compose([Validators.required])],
			'pin3': [null, Validators.compose([Validators.required])],
			'pin4': [null, Validators.compose([Validators.required])]
		});

		
		this.internet_provider = this.internetDataForm.controls['internet_provider'];
        this.subscription_data = this.internetDataForm.controls['subscription_data'];
        this.mobile_number = this.internetDataForm.controls['mobile_number'];
        this.pin1 = this.internetDataForm.controls['pin1'];
        this.pin2 = this.internetDataForm.controls['pin2'];
        this.pin3 = this.internetDataForm.controls['pin3'];
        this.pin4 = this.internetDataForm.controls['pin4'];
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad BuyInternetDataPage');
		
		this.storage.get('zambia_internet_provider_list').then((val) => {
			console.log(val);
			this.telcolist = JSON.parse(val);
			this.storage.get('zambia_internet_package_list').then((val) => {
				console.log(val);
				this.allPackageslist = JSON.parse(val);
				console.log(this.allPackageslist);
				console.log(this.subscription_typelist);
			});
		});
	}

	onNetworkChange(selectedValue: any){
		
		console.log(this.allPackageslist);
		console.log(this.subscription_typelist);
		var newSubList = [];
		for(var key of Object.keys(this.allPackageslist[this.internetData.internet_provider]))
		{
			var obj = {name: '', amount: '', id: ''};
			obj['name'] = key.split(' - ')[0];
			obj['id'] = key.split(' - ')[1];
			obj['amount'] = this.allPackageslist[this.internetData.internet_provider][key];
			newSubList.push(obj);
		}
		this.subscription_typelist = newSubList;
		console.log(this.subscription_typelist);
		
	}
	
	
	onSourceChange(selectedValue: any)
	{
		console.log('Selected', selectedValue);
		
		let url = "http://bankmobileapp.syncstatenigeria.com/api/v1/get-telco-subscription-types/" + selectedValue;
		this.http.get<TelcoListRespInt>(url).subscribe(
			res => {
				let status: any = null;
				status = res.status;
				console.log(res);
				console.log(status);
				if(res.status==1)
				{
					this.subscription_typelist = res.list;
				}
				else
				{
					let alert = this.alertCtrl.create({
						title: 'Internet Data Subscription',
						message: "No data subscription packages available for this telco",
						buttons: ['OK']
					});
					alert.present();
				}
			},
			err => {
			  console.log('Error occured');
			}
		);
	}
	
	
	
	doBuyInternetData(internetData)
	{
		this.storage.get('zambia_bank_customer_token').then((val) => {
			this.token = val;
			let header = new HttpHeaders();
			header = header.set('Content-Type', 'application/x-www-form-urlencoded');
			header = header.set('Accept-Language', 'en-US,en;q=0.5');
			header = header.set('auth_token', this.token);
			
			var orderRef = Math.random().toString(36).substring(2, 15).toUpperCase() + Math.random().toString(36).substring(2, 15).toUpperCase();
			const httpOptions = {headers: header};
			var form_params = "";
			var internetProviderId = "";
			for(var k2=0; k2<this.subscription_typelist.length; k2++)
			{
				if(this.subscription_typelist[k2].name == this.internetData.internet_provider)
				{
					internetProviderId = this.subscription_typelist[k2].id;
				}
			}
			form_params = form_params + "&internetProviderId=" + encodeURI(internetProviderId);
			form_params = form_params + "&internetPackageId=" + encodeURI(this.internetData.subscription_data);
			form_params = form_params + "&deviceNumber=" + encodeURI(this.internetData.mobile_number);
			form_params = form_params + "&pin=" + encodeURI(this.internetData.pin1 + "" + this.internetData.pin2 + "" + this.internetData.pin3 + "" + this.internetData.pin4);
			form_params = form_params + "&orderRef=" + encodeURI(orderRef);
			var parameter = form_params;	
			console.log(parameter);
			let url = "http://localhost:8080/EKwachaWebService/NCE/services/BillPaymentServices/internetDataPayment";
			this.loading = this.loadingCtrl.create({
				content: 'Initiating Payment. Please wait...'
			});
			this.loading.present();
			this.http.post<TelcoListRespInt>(url, parameter, httpOptions).subscribe(
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
