import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { IonicPage, NavController, NavParams, ToastController, AlertController, LoadingController, ModalController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import 'rxjs/add/operator/take';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as CryptoJS from 'crypto-js';

import { HomePage } from '../home/home';
import { RegisterPage } from '../register/register';
import { ForgetPage } from '../forget/forget';
import { DashboardPage } from '../dashboard/dashboard';
import { LoginpasswordPage } from '../loginpassword/loginpassword';
import { NewCountryMobilePage } from '../new-country-mobile/new-country-mobile';
import { AngularFireAuth } from 'angularfire2/auth';
import firebase from 'firebase';

//import { LoadingProvider } from '../../providers/loading/loading';

//import { Facebook } from '@ionic-native/facebook'

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers : []
})
export class LoginPage {

	userData:any;
	loginData = { username:'' };
	authForm : FormGroup;
	username: AbstractControl;
	loading: any;
	message: any;
	countryCode: any = '+260';
	countryFlag: any = 'zm.png';
	modalDismissData: any;
	
	//,public loadingProvider: LoadingProvider
	constructor(public modalCtrl: ModalController, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public http: HttpClient, public alertCtrl: AlertController, public storage: Storage, public fb: FormBuilder, public navCtrl: NavController, public navParams: NavParams, public afAuth: AngularFireAuth) {
		this.authForm = this.fb.group({
			'username' : [null, Validators.compose([Validators.required])],
		});

        this.username = this.authForm.controls['username'];
		this.message = navParams.get('message');
		this.countryFlag = 'zm.png';
		this.countryCode = '+260';
		console.log('this.message...' + this.message);
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad LoginPage');
		//console.log(this.cryptoJS.HmacSHA256("Message"));
		console.log(CryptoJS.PBKDF2('aaabb', "XX").toString());  
		if(this.message!=null)
		{
			this.presentToast({message: this.message});
		}
	}


	userLogin(loginData){
		/*this.loadingProvider.startLoading();
		console.log('loginData',loginData);
  		this.afAuth.auth.signInWithusernameAndPassword(loginData.username, loginData.password)
			.then(result => {
			  console.log('result >>',result);
			  this.loadingProvider.stopLoading();
			  this.moveToHome(result);
			}).catch(err => {
			  this.loadingProvider.stopLoading();
			  console.log('err',err);
			  this.presentToast(err);
        });*/
	}
  
	login(loginData) {
		let header = new HttpHeaders();
		header = header.set('Content-Type', 'application/x-www-form-urlencoded');
		header = header.set('Accept-Language', 'en-US,en;q=0.5');
		
		const httpOptions = {headers: header};
		let username=this.countryCode.substring(1) + "" + loginData.username;
		var form_params = "";
		form_params = form_params + "&username=" + encodeURI(username.trim());
		console.log(form_params);
		var parameter = form_params;
		this.loading = this.loadingCtrl.create({
			content: 'Please wait...'
		});
		this.loading.present();
		this.http.post<VerifyUserRespInt>("http://localhost:8080/EKwachaWebService/NCE/services/AuthenticationServices/verifyUsername", parameter, httpOptions).subscribe(
			res => {
				this.loading.dismiss();
				let status: any = null;
				status = res.status;
				console.log(res);
				console.log(status);
				if(res.status==0)
				{
					this.navCtrl.setRoot(LoginpasswordPage, {message: res.message, username:username});
				}
				else
				{
					this.presentToast({message: res.message});
				}
			},
			err => {
				this.loading.dismiss();
				console.log('Error occured');
				this.presentToast({message: 'Error occured'});
			}
		);
		
	}

	// Move to register page
	moveToRegister(){
		this.navCtrl.setRoot(RegisterPage);
	}

	//Move to Home Page
	moveToHome(res){
		console.log('res',res);
		this.navCtrl.setRoot(HomePage,{res:res});
	}

	presentToast(err) {
		const toast = this.toastCtrl.create({
			message: err.message,
			duration: 3000,
			position: 'bottom'
		});

		toast.present();
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

}


interface VerifyUserRespInt {
	status: any;
	message: any;
	bankList: any;
}