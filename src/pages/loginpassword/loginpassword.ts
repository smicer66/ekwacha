import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { IonicPage, NavController, NavParams, ToastController, AlertController, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import 'rxjs/add/operator/take';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { HomePage } from '../home/home';
import { RegisterPage } from '../register/register';
import { ForgetPage } from '../forget/forget';
//import { AnalysisPage } from '../analysis/analysis';
//import { GroundZeroPage } from '../ground-zero/ground-zero';
import { TabsPage } from '../tabs/tabs';
import { AngularFireAuth } from 'angularfire2/auth';
//import firebase from 'firebase';

//import { LoadingProvider } from '../../providers/loading/loading';

//import { Facebook } from '@ionic-native/facebook'

/**
 * Generated class for the LoginpasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-loginpassword',
  templateUrl: 'loginpassword.html',
})
export class LoginpasswordPage {
	userData:any;
	loginData = { password:'' };
	authForm : FormGroup;
	password: AbstractControl;
	passwordtype:string='password';
	passeye:string ='eye';
	loading: any;
	message: any = null;
	username: any;
	
	//,public loadingProvider: LoadingProvider
	constructor(public toastCtrl: ToastController, public loadingCtrl: LoadingController, public http: HttpClient, public alertCtrl: AlertController, public storage: Storage, public fb: FormBuilder, public navCtrl: NavController, public navParams: NavParams, public afAuth: AngularFireAuth) {
		this.authForm = this.fb.group({
			'password': [null, Validators.compose([Validators.required])],
		});
		this.password = this.authForm.controls['password'];
		this.message = navParams.get('message');
		this.username = navParams.get('username');
		console.log('this.message...' + this.message);
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad LoginPage');
		if(this.message!=null)
		{
			this.presentToast({message: this.message});
		}
	}

  
	login(loginData) {
		let header = new HttpHeaders();
		header = header.set('Content-Type', 'application/x-www-form-urlencoded');
		header = header.set('Accept-Language', 'en-US,en;q=0.5');
		
		const httpOptions = {headers: header};
		let password=loginData.password;
		var form_params = "";
		form_params = form_params + "username=" + encodeURI(this.username.trim());
		form_params = form_params + "&encPassword=" + encodeURI(password.trim());
		var parameter = form_params;
		this.loading = this.loadingCtrl.create({
			content: 'Please wait...'
		});
		this.loading.present();
		this.http.post<LoginRespInt>("http://localhost:8080/EKwachaWebService/NCE/services/AuthenticationServices/authenticateUser", parameter, httpOptions).subscribe(
			res => {
				this.loading.dismiss();
				let status: any = null;
				status = res.status;
				console.log(res);
				console.log(status);
				if(res.status==0)
				{
					if(res.token)
					{
						this.storage.set('zambia_bank_customer_token', res.token).then((xx) => {
							this.storage.set('zambia_bank_loggedInUser', (res.user)).then((xx) => {
								this.storage.set('zambia_bank_list', res.bankList).then((xx) => {
									this.storage.set('zambia_telco_list', res.telcoList).then((xx) => {
										this.storage.set('zambia_cable_provider_list', res.cableProviderList).then((xx) => {
											this.storage.set('zambia_cable_tv_package_list', res.cableTvPackageList).then((xx) => {
												this.storage.set('zambia_internet_provider_list', res.internetProviderList).then((xx) => {
													this.storage.set('zambia_internet_package_list', res.internetProviderPackageList).then((xx) => {
														this.storage.set('zambia_utility_provider_list', res.utilityProviderList).then((xx) => {
															this.navCtrl.setRoot(TabsPage);
														});
													});
												});
											});
										});
									});
								});
							});
							
						});
						
					}
					else
					{
						this.presentToast({message: 'Logging In Failed. Ensure you provide your valid password to login'});
					}
				}
				else
				{
					this.presentToast({message: 'Logging In Failed. Ensure you provide your valid password to login'});
				}
			},
			err => {
				this.loading.dismiss();
				console.log('Error occured');
			}
		);
		
	}

	moveToRegister(){
		this.navCtrl.setRoot(RegisterPage);
	}

	
	moveToHome(res){
		console.log('res',res);
		this.navCtrl.setRoot(HomePage,{res:res});
	}

	presentToast(err) {
		const toast = this.toastCtrl.create(
		{
			message: err.message,
			duration: 3000,
			position: 'bottom'
		});

		toast.present();
	}
	
	presentAlert(err) {

	}

	managePassword() {
		if(this.passwordtype == 'password')
		{
			this.passwordtype='text';
			this.passeye='eye-off';
		}else
		{
			this.passwordtype='password';
			this.passeye = 'eye';
		}
	}
	
	
	forgetpassword()
	{
		this.navCtrl.setRoot(ForgetPage);
	}

}


interface LoginRespInt {
	status: any;
	response_msg: string;
	account_number: string;
	reg_code: string;
	token: string;
	user: any;
	modalDismissData: any;
	bankList: any;
	telcoList: any;
	cableProviderList: any;
	cableTvPackageList: any;
	internetProviderList: any;
	internetProviderPackageList: any;
	utilityProviderList: any;
	
}