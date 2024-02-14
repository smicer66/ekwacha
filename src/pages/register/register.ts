import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ActionSheetController, Platform, AlertController, LoadingController, ViewController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import 'rxjs/add/operator/take';
import { HttpClient, HttpHeaders } from '@angular/common/http';

/*import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';*/

import { AngularFireAuth } from 'angularfire2/auth';

import { LoginPage } from '../login/login';
import { RegisterStepTwoPage } from '../register-step-two/register-step-two';
//import { LoadingProvider } from '../../providers/loading/loading';

declare var cordova: any;

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})


export class RegisterPage {

	regData = { firstName: '' , otherName: '', lastName: ''};
	authForm : FormGroup;
	firstName: AbstractControl;
	lastName: AbstractControl;
	otherName: AbstractControl;
	loading: any;
	
	
	//, public camera: Camera, public file: File, public filePath: FilePath,public loadingProvider: LoadingProvider
	constructor(public viewCtrl: ViewController, public platform: Platform, public alertCtrl: AlertController, public loadingCtrl: LoadingController, public http: HttpClient, public actionSheetCtrl: ActionSheetController, public toastCtrl: ToastController, public afAuth: AngularFireAuth, public fb: FormBuilder, public navCtrl: NavController, public navParams: NavParams){
		this.authForm = this.fb.group({
			'firstName' : [null, Validators.compose([Validators.required])],
			'lastName' : [null, Validators.compose([Validators.required])],
			'otherName' : [null],
		});
		console.log('1');
        this.firstName = this.authForm.controls['firstName'];
		this.lastName = this.authForm.controls['lastName'];
		this.otherName = this.authForm.controls['otherName'];
		console.log('2');
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad RegisterPage');
	}

	doRegisterStepOne(regData){
		//this.navCtrl.setRoot(RegisterStepTwoPage, {});
		if(regData.firstName.trim().length==0 || regData.lastName.trim().length==0){
		  
			this.presentToast({message: 'Hey, your first name and last name must be provided!'});
			
		}else {
			//this.presentToast({message: 'You are fine to go'});
			this.navCtrl.setRoot(RegisterStepTwoPage, {firstName: regData.firstName, otherName: regData.otherName, lastName: regData.lastName});
		}
		//
		console.log(regData);
		/*var headers = new Headers();
		headers.append("Accept", 'application/json');
		headers.append('Content-Type', 'application/json' );
		let options = new RequestOptions({ headers: headers });*/
		/*var parameter = JSON.stringify({account_number:regData.account_number});
		console.log(parameter);
		let header = new HttpHeaders();
		header = header.set('Content-Type', 'application/json; charset=utf-8');
		header = header.set('Accept', 'application/json');
		
		const httpOptions = {headers: header};
		
		this.loading = this.loadingCtrl.create({
			content: 'Loading View. Please wait...'
		});
		this.loading.present();
		this.http.post<AccountVerify>("http://bankmobileapp.syncstatenigeria.com/api/v1/auth/register-step-one", parameter, httpOptions).subscribe(
			res => {
				this.loading.dismiss();
				let status: any = null;
				status = res.status;
				if(status==1)
				{
					let account_number = res.account_number;
					console.log(account_number);
					this.navCtrl.setRoot(RegisterStepTwoPage, {account_number_: account_number, reg_code_: res.reg_code});
				}
				else
				{
					let alert = this.alertCtrl.create({
						title: 'Account Verification',
						subTitle: res.response_msg,
						buttons: ['Dismiss']
					});
					alert.present();
				}
			},
			err => {
				this.loading.dismiss();
				console.log('Error occured');
			}
		);*/
		
	}

	moveToLogin(){
		this.navCtrl.setRoot(LoginPage);
	}
	
	managePassword() {
    
	}
 
	managecnfPassword() {
    
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
		console.log('back pressed');
		this.navCtrl.setRoot(LoginPage);
	}
}

interface AccountVerify{
	status: string;
	response_msg: string;
	account_number: string;
	reg_code: string;
}
