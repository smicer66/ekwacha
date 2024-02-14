import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ActionSheetController, AlertController, Platform, LoadingController } from 'ionic-angular';
import { Storage } from "@ionic/storage";
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import 'rxjs/add/operator/take';
import { HttpClient, HttpHeaders } from '@angular/common/http';

/*import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';*/

import { AngularFireAuth } from 'angularfire2/auth';
import { BillPaymentPage } from '../bill-payment/bill-payment';
import { LoginPage } from '../login/login';
import { TabsPage } from '../tabs/tabs';
//import { LoadingProvider } from '../../providers/loading/loading';

/**
 * Generated class for the MobileTopUpPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-mobile-top-up',
  templateUrl: 'mobile-top-up.html',
})
export class MobileTopUpPage {

	mobileTopUpData = { network_provider: '', pin_pinless: '', pinamount: '' , pinlessamount: '' , receipient: '', pin1: '', pin2: '', pin3: '', pin4: ''};
	mobileTopUpForm : FormGroup;
	network_provider: AbstractControl;
	pin_pinless: AbstractControl;
	pinamount: AbstractControl;
	pinlessamount: AbstractControl;
	receipient: AbstractControl;
	pin1: AbstractControl;
	pin2: AbstractControl;
	pin3: AbstractControl;
	pin4: AbstractControl;
	
	token: any;
	accountlist: any;
	telcolist: any;
	displayAmount: any = false;
	
	telcodenominations: any = [];
	loading: any;
	
	//, public camera: Camera, public file: File, public filePath: FilePath,public loadingProvider: LoadingProvider
	constructor(public platform: Platform, public storage: Storage, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public http: HttpClient, public actionSheetCtrl: ActionSheetController, public toastCtrl: ToastController, public afAuth: AngularFireAuth, public fb: FormBuilder, public navCtrl: NavController, public navParams: NavParams) {
		this.mobileTopUpForm = this.fb.group({
			'network_provider' : [null, Validators.compose([Validators.required])],
			'pin_pinless': [null, Validators.compose([Validators.required])],
			'receipient': [null, Validators.compose([Validators.required])],
			'pinamount': [null, Validators.compose([Validators.required])],
			'pinlessamount': [null, Validators.compose([Validators.required])],
			'pin1': [null, Validators.compose([Validators.required])],
			'pin2': [null, Validators.compose([Validators.required])],
			'pin3': [null, Validators.compose([Validators.required])],
			'pin4': [null, Validators.compose([Validators.required])]
		});

        this.network_provider = this.mobileTopUpForm.controls['network_provider'];
        this.pin_pinless = this.mobileTopUpForm.controls['pin_pinless'];
        this.receipient = this.mobileTopUpForm.controls['receipient'];
        this.pinamount = this.mobileTopUpForm.controls['pinamount'];
        this.pinlessamount = this.mobileTopUpForm.controls['pinlessamount'];
		//this.narration = this.mobileTopUpForm.controls['narration'];
        this.pin1 = this.mobileTopUpForm.controls['pin1'];
        this.pin2 = this.mobileTopUpForm.controls['pin2'];
        this.pin3 = this.mobileTopUpForm.controls['pin3'];
        this.pin4 = this.mobileTopUpForm.controls['pin4'];
		this.telcodenominations = [];
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad MobileTopUpPage');
		this.storage.get('zambia_bank_customer_accounts').then((val) => {
			this.accountlist = JSON.parse(val);
			this.storage.get('zambia_telco_list').then((val) => {
				this.telcolist = JSON.parse(val);
			});
		});
	}
	
	onNetworkChange(selectedValue: any) {
	
		if(this.mobileTopUpData.network_provider && this.mobileTopUpData.pin_pinless=='pin')
		{
			console.log('Selected', selectedValue);
			for(const k of Object.keys(this.telcolist))
			{
				var ob = this.telcolist[k];
				if(ob.id == this.mobileTopUpData.network_provider)
				{
					this.telcodenominations = ob.airtimeUnits.split("|||");
				}
			}
			this.displayAmount = true;
		}
		else
		{
			this.telcodenominations = [];
			this.displayAmount = false;
			if(this.mobileTopUpData.network_provider && this.mobileTopUpData.pin_pinless=='pinless')
			{
				this.displayAmount = true;
			}
		}
	}
	
	
	
	doPurchaseMobileTopUp(mobileTopUpData)
	{
		console.log(mobileTopUpData);
		
		this.storage.get('zambia_bank_customer_token').then((val) => {
			this.token = val;
			console.log(this.token);
			let header = new HttpHeaders();
			header = header.set('Content-Type', 'application/x-www-form-urlencoded');
			header = header.set('Accept-Language', 'en-US,en;q=0.5');
			header = header.set('auth_token', this.token);
			
			var orderRef = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15).toUpperCase();
			const httpOptions = {headers: header};
			var form_params = "";
			form_params = form_params + "&telcoId=" + encodeURI(this.mobileTopUpData.network_provider);
			form_params = form_params + "&receipientMobile=" + encodeURI(this.mobileTopUpData.receipient);
			form_params = form_params + "&amount=" + encodeURI(this.mobileTopUpData.pin_pinless=='pin' ? this.mobileTopUpData.pinamount : this.mobileTopUpData.pinlessamount);
			form_params = form_params + "&pinlessOption=" + encodeURI(this.mobileTopUpData.pin_pinless=='pin' ? 'false' : 'true');
			form_params = form_params + "&pin=" + encodeURI(this.mobileTopUpData.pin1 + "" + this.mobileTopUpData.pin2 + "" + this.mobileTopUpData.pin3 + "" + this.mobileTopUpData.pin4);
			form_params = form_params + "&orderRef=" + encodeURI(orderRef);
			console.log(form_params);
			var parameter = form_params;
			
			let url = "http://localhost:8080/EKwachaWebService/NCE/services/AirtimeTopUpServices/topUpAirtime";
			this.loading = this.loadingCtrl.create({
				content: 'Please wait...'
			});
			this.loading.present();
			this.http.post<MobileTopUpRespInt>(url, parameter, httpOptions).subscribe(
				res => {
					this.loading.dismiss();
					let status: any = null;
					status = res.status;
					console.log(res);
					console.log(status);
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


interface MobileTopUpDenomRespInt{
	status: any;
	list: any;
}

interface MobileTopUpRespInt{
	status: any;
	top_up_unit:any;
	response_msg: any;
	message: any;
}