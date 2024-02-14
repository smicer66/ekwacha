import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ActionSheetController, Platform, AlertController, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import 'rxjs/add/operator/take';
import { HttpClient, HttpHeaders } from '@angular/common/http';

/*import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';*/

import { AngularFireAuth } from 'angularfire2/auth';
import { RegisterPage } from '../register/register';
import { RegisterStepThreePage } from '../register-step-three/register-step-three';
//import { LoadingProvider } from '../../providers/loading/loading';

/**
 * Generated class for the RegisterStepTwoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

interface ClientServiceData{
	status: any;
	provinceList: any;
	districtList: any;
}

@IonicPage()
@Component({
  selector: 'page-register-step-two',
  templateUrl: 'register-step-two.html',
})
export class RegisterStepTwoPage {
	
	registerStepTwoData = { homeAddress: '', city: '', province: '', district: '' };
	//account_number_val: any = '';
	//reg_code: any = '';
	registerStepTwoPageForm : FormGroup;
	homeAddress: AbstractControl;
	city: AbstractControl;
	province: AbstractControl;
	district: AbstractControl;
	loading: any;
	provinceList: any = [];
	districtList: any = [];
	firstName: any;
	otherName: any;
	lastName: any;

	
	//, public camera: Camera, public file: File, public filePath: FilePath,public loadingProvider: LoadingProvider
	constructor(public platform: Platform, public http: HttpClient, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public actionSheetCtrl: ActionSheetController, public toastCtrl: ToastController, public afAuth: AngularFireAuth, public fb: FormBuilder, public navCtrl: NavController, public navParams: NavParams){
		this.registerStepTwoPageForm = this.fb.group({
			'homeAddress' : [null, Validators.compose([Validators.required])],
			'city': [null, Validators.compose([Validators.required])],
			'province': ['Select Your Province', Validators.compose([Validators.required])],
			'district': [null, Validators.compose([Validators.required])]
		});

        this.homeAddress = this.registerStepTwoPageForm.controls['homeAddress'];
        this.city = this.registerStepTwoPageForm.controls['city'];
        this.province = this.registerStepTwoPageForm.controls['province'];
        this.district = this.registerStepTwoPageForm.controls['district'];
		//this.account_number_val = navParams.get('account_number_');
		//this.reg_code = navParams.get('reg_code_');
		console.log(navParams);
		//console.log("this.account_number_val" + this.account_number_val);
		//this.account_number.setValue(this.account_number_val);
		//this.authentication_code.setValue(this.reg_code);
		this.firstName = navParams.get('firstName');
		this.otherName = navParams.get('otherName');
		this.lastName = navParams.get('lastName');
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad RegisterStepTwoPage');
	
		let header = new HttpHeaders();
		header = header.set('Content-Type', 'application/json; charset=utf-8');
		header = header.set('Accept', 'application/json');
		
		//const httpOptions = {headers: header};
		//var parameter = JSON.stringify({});
		this.loading = this.loadingCtrl.create({
			content: 'Loading View. Please wait...'
		});
		this.loading.present();
		
		let url = "http://localhost:8080/EKwachaWebService/NCE/services/ClientServices/getProvinceList?countryCode=260";
		this.http.get<ClientServiceData>(url).subscribe(
			res => {
				this.loading.dismiss();
				let status: any = null;
				console.log(res);
				status = res.status;
				console.log(status);
				if(res.status==0)
				{
					this.provinceList = JSON.parse(res.provinceList);
				}
			},
			err => {
				this.loading.dismiss();
			  console.log('Error occured');
			}
		);
	}
	
	
	onSourceChange(selectedValue: any) {
		console.log('Selected', selectedValue);
		let header = new HttpHeaders();
		header = header.set('Content-Type', 'application/json; charset=utf-8');
		header = header.set('Accept', 'application/json');
		
		//const httpOptions = {headers: header};
		//var parameter = JSON.stringify({});
		this.loading = this.loadingCtrl.create({
			content: 'Loading View. Please wait...'
		});
		this.loading.present();
		
		var prov = selectedValue.split('###');
		let url = "http://localhost:8080/EKwachaWebService/NCE/services/ClientServices/getDistrictsByProvince?provinceId=" + prov[0];
		this.http.get<ClientServiceData>(url).subscribe(
			res => {
				this.loading.dismiss();
				let status: any = null;
				console.log(res);
				status = res.status;
				console.log(status);
				if(res.status==0)
				{
					this.districtList = JSON.parse(res.districtList);
				}
			},
			err => {
				this.loading.dismiss();
			  console.log('Error occured');
			}
		);
		
		
	}
  
	doRegisterStepTwo(registerStepTwoData){
		console.log(registerStepTwoData);
		if(registerStepTwoData.homeAddress.trim().length==0 || registerStepTwoData.city.trim().length==0 || registerStepTwoData.district.trim().length==0 || registerStepTwoData.province.trim().length==0){
		  
			this.presentToast({message: 'Hey, your first name and last name must be provided!'});
			
		}else {
			//this.presentToast({message: 'You are fine to go'});
			this.navCtrl.setRoot(RegisterStepThreePage, {firstName: this.firstName, otherName: this.otherName, lastName: this.lastName, homeAddress: registerStepTwoData.homeAddress.trim(), 
				city: registerStepTwoData.city.trim(), district: registerStepTwoData.district.trim(), province: registerStepTwoData.province.trim()});
		}
	}
	
	doCancelRegisterStepTwo()
	{
	
	
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
		this.navCtrl.setRoot(RegisterPage);
	}
}
