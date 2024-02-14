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
import { NewCountryMobilePage } from '../new-country-mobile/new-country-mobile';
import { RegisterStepFourPage } from '../register-step-four/register-step-four';
import { RegisterStepTwoPage } from '../register-step-two/register-step-two';


/**
 * Generated class for the RegisterStepThreePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register-step-three',
  templateUrl: 'register-step-three.html',
})
export class RegisterStepThreePage {

	registerStepThreeData = { mobileNumber: '', emailAddress: '' };
	//authentication_code_val: any = '';
	registerStepThreePageForm : FormGroup;
	mobileNumber: AbstractControl;
	emailAddress: AbstractControl;
	loading: any;
	modalDismissData: any;
	firstName: any;
	otherName: any;
	lastName: any;
	homeAddress: any;
	city: any;
	province: any;
	district: any;
	countryCode: any = '+260';
	countryFlag: any = 'zm.png';

	
	//, public camera: Camera, public file: File, public filePath: FilePath,public loadingProvider: LoadingProvider
	constructor(public modalCtrl: ModalController, public platform: Platform, public loadingCtrl: LoadingController, public http: HttpClient, public storage: Storage, public alertCtrl: AlertController, public actionSheetCtrl: ActionSheetController, public toastCtrl: ToastController, public afAuth: AngularFireAuth, public fb: FormBuilder, public navCtrl: NavController, public navParams: NavParams) {
		this.registerStepThreePageForm = this.fb.group({
			'mobileNumber' : [null, Validators.compose([Validators.required])],
			'emailAddress': [null, Validators.compose([Validators.required])]
		});
		/**/
		//this.authentication_code_val = navParams.get('authentication_code_');
		this.mobileNumber = this.registerStepThreePageForm.controls['mobileNumber'];
        this.emailAddress = this.registerStepThreePageForm.controls['emailAddress'];
		this.firstName = navParams.get('firstName');
		this.otherName = navParams.get('otherName');
		this.lastName = navParams.get('lastName');
		this.homeAddress = navParams.get('homeAddress');
		this.city = navParams.get('city');
		this.province = navParams.get('province');
		this.district = navParams.get('district');
		this.countryFlag = 'zm.png';
		this.countryCode = '+260';
		console.log(this.countryCode);
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad RegisterStepThreePage');
		console.log(this.countryCode);
		this.countryFlag = 'zm.png';
		this.countryCode = '+260';
	}
  
	doRegisterStepThree(registerStepThreeData){
		console.log(registerStepThreeData);
		if(registerStepThreeData.mobileNumber.trim().length==0 || registerStepThreeData.emailAddress.trim().length==0){
		  
			this.presentToast({message: 'Hey, your mobile number and email address must be provided!'});
			
		}else {
			//this.presentToast({message: 'You are fine to go'});
			let header = new HttpHeaders();
			header = header.set('Content-Type', 'application/x-www-form-urlencoded');
			header = header.set('Accept-Language', 'en-US,en;q=0.5');
			
			const httpOptions = {headers: header};
			//var parameter = JSON.stringify({account_number:regData.account_number});
			var form_params = "";
			form_params = form_params + "&emailAddress=" + encodeURI(this.registerStepThreeData.emailAddress.trim() + "" + this.registerStepThreeData.emailAddress.trim());
			form_params = form_params + "&mobileNumber=" + encodeURI(this.countryCode.substring(1) + "" + this.registerStepThreeData.mobileNumber.trim());
			
			
			this.loading = this.loadingCtrl.create({
				content: 'Loading View. Please wait...'
			});
			this.loading.present();
			var parameter = form_params;
			let url = "http://localhost:8080/EKwachaWebService/NCE/services/AuthenticationServices/verifyUserAvailability";
			this.http.post<AccountVerify>(url, parameter, httpOptions).subscribe(
				res => {
					this.loading.dismiss();
					let status: any = null;
					console.log(res);
					status = res.status;
					console.log(status);
					if(res.status==0)
					{
						//this.presentToast({});
						this.navCtrl.setRoot(RegisterStepFourPage, {firstName: this.firstName, otherName: this.otherName, lastName: this.lastName, 
							homeAddress: this.homeAddress, city: this.city, province: this.province, district: this.district, message: res.message,
							mobileNumber: (this.countryCode + "" + this.registerStepThreeData.mobileNumber.trim()), emailAddress: this.registerStepThreeData.emailAddress});
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
			
		}
		
		
	}
	
	
	openMobileNumberModal()
	{
		console.log(222);
		this.loading = this.loadingCtrl.create({
			content: 'Loading View. Please wait...'
		});
		this.loading.present();
		const profileModal = this.modalCtrl.create(NewCountryMobilePage, {  });
		this.loading.dismiss();
		profileModal.onDidDismiss(data => {
			console.log(data);
			if(data!=null)
			{
				this.modalDismissData = JSON.stringify(data);
				this.countryCode = data.selectedCountry.code;
				this.countryFlag = data.selectedCountry.flag;
			}
		});
		profileModal.present();
	}
	
	
	presentToast(err) {
		const toast = this.toastCtrl.create({
			message: err.message,
			duration: 3000,
			position: 'bottom'
		});

		toast.present();
	}
	
	dismiss(){
		console.log('dismiss clicked');
		this.navCtrl.setRoot(RegisterStepTwoPage, {firstName: this.firstName, otherName: this.otherName, lastName: this.lastName});
	}

}



interface AccountVerify{
	status: any;
	message: string;
}