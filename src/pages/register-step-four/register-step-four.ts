import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ActionSheetController, Platform, AlertController, LoadingController, ModalController, ViewController  } from 'ionic-angular';
import { Storage } from "@ionic/storage";
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import 'rxjs/add/operator/take';
import { HttpClient, HttpHeaders } from '@angular/common/http';

/*import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';*/
import { ForgetPage } from '../forget/forget';
import { LoginPage } from '../login/login';
import { AngularFireAuth } from 'angularfire2/auth';
//import { LoadingProvider } from '../../providers/loading/loading';
import { NewCountryMobilePage } from '../new-country-mobile/new-country-mobile';
import { RegisterStepThreePage } from '../register-step-three/register-step-three';

/**
 * Generated class for the RegisterStepFourPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register-step-four',
  templateUrl: 'register-step-four.html',
})
export class RegisterStepFourPage {

	registerStepFourData = { otp1: '', otp2: '', otp3: '', otp4: '' };
	//authentication_code_val: any = '';
	RegisterStepFourPageForm : FormGroup;
	otp1: AbstractControl;
	otp2: AbstractControl;
	otp3: AbstractControl;
	otp4: AbstractControl;
	loading: any;
	modalDismissData: any;
	firstName: any;
	otherName: any;
	lastName: any;
	homeAddress: any;
	city: any;
	province: any;
	district: any;
	message: any;
	mobileNumber: any;
	emailAddress: any;

	
	//, public camera: Camera, public file: File, public filePath: FilePath,public loadingProvider: LoadingProvider
	constructor(public viewCtrl: ViewController, public modalCtrl: ModalController, public platform: Platform, public loadingCtrl: LoadingController, public http: HttpClient, public storage: Storage, public alertCtrl: AlertController, public actionSheetCtrl: ActionSheetController, public toastCtrl: ToastController, public afAuth: AngularFireAuth, public fb: FormBuilder, public navCtrl: NavController, public navParams: NavParams) {
		this.RegisterStepFourPageForm = this.fb.group({
			'otp1' : [null, Validators.compose([Validators.required])],
			'otp2': [null, Validators.compose([Validators.required])],
			'otp3': [null, Validators.compose([Validators.required])],
			'otp4': [null, Validators.compose([Validators.required])]
		});
		/**/
		//this.authentication_code_val = navParams.get('authentication_code_');
		this.otp1 = this.RegisterStepFourPageForm.controls['otp1'];
        this.otp2 = this.RegisterStepFourPageForm.controls['otp2'];
		this.otp3 = this.RegisterStepFourPageForm.controls['otp3'];
        this.otp4 = this.RegisterStepFourPageForm.controls['otp4'];
		this.message = navParams.get('message');
		this.emailAddress = navParams.get('emailAddress');
		this.mobileNumber = navParams.get('mobileNumber');
		this.firstName = navParams.get('firstName');
		this.otherName = navParams.get('otherName');
		this.lastName = navParams.get('lastName');
		this.homeAddress = navParams.get('homeAddress');
		this.city = navParams.get('city');
		this.province = navParams.get('province');
		this.district = navParams.get('district');
		
		console.log('this.message --- ' + this.message);
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad RegisterStepFourPage');
		this.presentToast({message: this.message});
	}
  
	doRegisterStepFour(registerStepFourData){
		console.log(registerStepFourData);
		var parameter = "";
		console.log(parameter);
		let header = new HttpHeaders();
		header = header.set('Content-Type', 'application/x-www-form-urlencoded');
		header = header.set('Accept-Language', 'en-US,en;q=0.5');
		
		const httpOptions = {headers: header};
		var form_params = "";
			
		console.log(this.mobileNumber.trim().substring(1));
		form_params = form_params + "&username=" + encodeURI(this.mobileNumber.trim().substring(1));
		form_params = form_params + "&firstName=" + encodeURI(this.firstName.trim());
		form_params = form_params + "&lastName=" + encodeURI(this.lastName.trim());
		if(this.otherName!=null && this.otherName.length>0)
		{
			form_params = form_params + "&otherName=" + encodeURI(this.otherName.trim());
		}
		
		form_params = form_params + "&homeAddress=" + encodeURI(this.homeAddress.trim());
		form_params = form_params + "&city=" + encodeURI(this.city.trim());
		form_params = form_params + "&provinceId=" + encodeURI(this.province.trim().split('###')[0]);
		form_params = form_params + "&districtId=" + encodeURI(this.district.trim().split('###')[0]);
		form_params = form_params + "&email=" + encodeURI(this.emailAddress.trim());
		form_params = form_params + "&mobileNumber=" + encodeURI(this.mobileNumber.trim().substring(1));
		form_params = form_params + "&otp=" + encodeURI(this.registerStepFourData.otp1.trim()+""+this.registerStepFourData.otp2.trim()+""+this.registerStepFourData.otp3.trim()+""+this.registerStepFourData.otp4.trim());
		this.loading = this.loadingCtrl.create({
			content: 'Please wait...'
		});
		this.loading.present();
		
		parameter = form_params;
		let url = "http://localhost:8080/EKwachaWebService/NCE/services/AuthenticationServices/signUpUser";
		this.http.post<UserCreateReponse>(url, parameter, httpOptions).subscribe(
			res => {
				this.loading.dismiss();
				let status: any = null;
				status = res.status;
				console.log(res);
				console.log(status);
				if(status==0)
				{
					//let accounts = [];
					//accounts.push(res.customerNumber);
					//this.storage.set('zambia_bank_customer_accounts', JSON.stringify(accounts));
					this.navCtrl.setRoot(LoginPage, {message: res.message});
					
					
					
				}
				else
				{
					console.log(-1);
					this.presentToast({message: res.message});
				}
			},
			err => {
				this.loading.dismiss();
				this.presentToast({message: 'Oops! We experienced an issue setting you up. Retry again'});
			}
		);
	}
	
	
	openMobileNumberModal()
	{
		console.log(222);
		const profileModal = this.modalCtrl.create(NewCountryMobilePage, {  });
		profileModal.onDidDismiss(data => {
			console.log(data);
			this.modalDismissData = JSON.stringify(data);
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
	
	
	
	forgetpassword(){
		this.navCtrl.setRoot(ForgetPage);
	}
	
	
	dismiss()
	{
		this.navCtrl.setRoot(RegisterStepThreePage, {firstName: this.firstName, otherName: this.otherName, lastName: this.lastName, homeAddress: this.homeAddress, 
				city: this.city, district: this.district, province: this.province});
	}

}



interface UserCreateReponse{
	status: any;
	message: any;
	customerNumber: any;
}