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

import { ListGroupsPage } from '../list-groups/list-groups';

import { ViewLoanPage } from '../view-loan/view-loan';

/**
 * Generated class for the ApplyLoanPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

interface GroupLoanTermInterface{
	interestRate: any;
	maxPrincipal: any;
	minPrincipal: any;
	minTerm: any;
	maxTerm: any;
	minContribution: any;
	penalty: any;
	interestType: any;
	repaymentStrategy: any;
	repaymentTenorType: any;
	status: any;
	groupLoanTerm: any;
	message: any;
	schedule: any;
}
 
@IonicPage()
@Component({
  selector: 'page-apply-loan',
  templateUrl: 'apply-loan.html',
})
export class ApplyLoanPage {

	loanTermFormData = { loanAmount: '', term: '', pin1: '', pin2: '', pin3: '', pin4: '' };
	
	applyLoanForm : FormGroup;
	loanAmount: AbstractControl;
	term: AbstractControl;
	pin1: AbstractControl;
	pin2: AbstractControl;
	pin3: AbstractControl;
	pin4: AbstractControl;
	
		
	loanTerms: any;
	groupLoanTerm: any;
	displayAmount: any = false;
	token: any;
	loading: any;
	repaymentSchedule: any = [];
	termList: any = [];
	
	constructor(public platform: Platform, public actionSheetCtrl: ActionSheetController, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public storage: Storage, public http: HttpClient, public toastCtrl: ToastController, public afAuth: AngularFireAuth, public fb: FormBuilder, public navCtrl: NavController, public navParams: NavParams) {
		this.loanTerms = navParams.get('loanTerm');
		console.log(this.loanTerms);
		for(var r1=1; r1<(this.loanTerms.maximumLoanTenor + 1); r1++)
		{
			this.termList.push(r1);
		}
		console.log(this.termList);
		
		this.applyLoanForm = this.fb.group({
			'loanAmount' : [null, Validators.compose([Validators.required])],
			'term': [null, Validators.compose([Validators.required])],
			'pin1': [null, Validators.compose([Validators.required])],
			'pin2': [null, Validators.compose([Validators.required])],
			'pin3': [null, Validators.compose([Validators.required])],
			'pin4': [null, Validators.compose([Validators.required])]
		});

        this.loanAmount = this.applyLoanForm.controls['loanAmount'];
        this.term = this.applyLoanForm.controls['term'];
        this.pin1 = this.applyLoanForm.controls['pin1'];
        this.pin2 = this.applyLoanForm.controls['pin2'];
        this.pin3 = this.applyLoanForm.controls['pin3'];
        this.pin4 = this.applyLoanForm.controls['pin4'];
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad ApplyLoanPage');
		this.storage.get('zambia_bank_customer_token').then((val) => {
			this.token = val;
			let header = new HttpHeaders();
			header = header.set('Content-Type', 'application/x-www-form-urlencoded');
			header = header.set('Accept-Language', 'en-US,en;q=0.5');
			header = header.set('auth_token', this.token);
			
			
			const httpOptions = {headers: header};
			
			var parameter = "";
			let url = "";
			
			url = "http://localhost:8080/EKwachaWebService/NCE/services/GroupServices/getLoanTermById";
			var form_params = "loanTermId=" + this.loanTerms.loanTermId;
			parameter = form_params;	
			console.log(parameter);
				
			
			
			this.loading = this.loadingCtrl.create({
				content: 'Loading View. Please wait...'
			});
			this.loading.present();
			this.http.post<GroupLoanTermInterface>(url, parameter, httpOptions).subscribe(
				res1 => {
					console.log(res1);
					this.loading.dismiss();
					if(res1.status==0)
					{
						this.groupLoanTerm = JSON.parse(res1.groupLoanTerm);
					}
					else
					{
						this.presentToast({message: res1.message});
					}
				},
				err => {					
					this.loading.dismiss();
					console.log('Error occured');
					this.presentToast({message: 'Oops! Seems we experienced a connectivity issue while trying to pay your utility'});
					this.navCtrl.setRoot(ListGroupsPage);
				}
			);
		});
	}
	
	
	calculateRepaymentInterest(loanTerms)
	{
		this.displayAmount = false;
		this.storage.get('zambia_bank_customer_token').then((val) => {
			this.token = val;
			let header = new HttpHeaders();
			header = header.set('Content-Type', 'application/x-www-form-urlencoded');
			header = header.set('Accept-Language', 'en-US,en;q=0.5');
			header = header.set('auth_token', this.token);
			
			
			const httpOptions = {headers: header};
			
			var parameter = "";
			let url = "";
			
			url = "http://localhost:8080/EKwachaWebService/NCE/services/GroupServices/generateLoanRepaymentDetails";
			var form_params = "loanTermId=" + this.loanTerms.loanTermId;
			form_params = form_params + "&principal=" + this.loanTermFormData.loanAmount;
			form_params = form_params + "&term=" + this.loanTermFormData.term;
			parameter = form_params;	
			console.log(parameter);
				
			
			
			this.loading = this.loadingCtrl.create({
				content: 'Loading View. Please wait...'
			});
			this.loading.present();
			this.http.post<GroupLoanTermInterface>(url, parameter, httpOptions).subscribe(
				res1 => {
					console.log(res1);
					this.loading.dismiss();
					if(res1.status==0)
					{
						this.repaymentSchedule = JSON.parse(res1.schedule);
						this.displayAmount = true;
						console.log(this.repaymentSchedule);
					}
					else
					{
						this.presentToast({message: res1.message});
					}
				},
				err => {					
					this.loading.dismiss();
					console.log('Error occured');
					this.presentToast({message: 'Oops! Seems we experienced a connectivity issue while trying to pay your utility'});
					this.navCtrl.setRoot(ListGroupsPage);
				}
			);
		});
	}
	
	
	applyForLoan(loanTerm)
	{
		console.log(loanTerm);
		this.storage.get('zambia_bank_customer_token').then((val) => {
			this.token = val;
			let header = new HttpHeaders();
			header = header.set('Content-Type', 'application/x-www-form-urlencoded');
			header = header.set('Accept-Language', 'en-US,en;q=0.5');
			header = header.set('auth_token', this.token);
			
			
			const httpOptions = {headers: header};
			
			var parameter = "";
			let url = "";
			
			url = "http://localhost:8080/EKwachaWebService/NCE/services/GroupServices/applyForGroupLoan";
			var form_params = "loanTermId=" + this.loanTerms.loanTermId;
			form_params = form_params + "&principal=" + this.loanTermFormData.loanAmount;
			form_params = form_params + "&term=" + this.loanTermFormData.term;
			parameter = form_params;	
			console.log(parameter);
				
			
			
			this.loading = this.loadingCtrl.create({
				content: 'Loading View. Please wait...'
			});
			this.loading.present();
			this.http.post<GroupLoanTermInterface>(url, parameter, httpOptions).subscribe(
				res1 => {
					console.log(res1);
					this.loading.dismiss();
					if(res1.status==0)
					{
						this.repaymentSchedule = JSON.parse(res1.schedule);
						console.log(this.repaymentSchedule);
						//this.navCtrl.setRoot(ViewLoanPage, {schedule: this.repaymentSchedule});
						//this.navCtrl.setRoot(LoanRepaymentSchedulePage, {loan: loan});
						this.navCtrl.setRoot(ListGroupsPage);
					}
					else
					{
						this.presentToast({message: res1.message});
					}
				},
				err => {					
					this.loading.dismiss();
					console.log('Error occured');
					this.presentToast({message: 'Oops! Seems we experienced a connectivity issue while trying to pay your utility'});
					this.navCtrl.setRoot(ListGroupsPage);
				}
			);
		});
	}
	
	presentToast(err) {
		const toast = this.toastCtrl.create({
			message: err.message,
			duration: 3000,
			position: 'bottom'
		});

		toast.present();
	}
	
	
	formatNumber(number, places)
	{
		var x = Number(parseFloat(number).toFixed(places)).toLocaleString('en', {minimumFractionDigits: places});
		//console.log(x);
		//console.log(Number(parseFloat(number).toFixed(2)).toLocaleString('en', {minimumFractionDigits: 2}));
		//console.log(Number(parseFloat("0").toFixed(2)).toLocaleString('en', {minimumFractionDigits: 2}));
		//console.log(Number(parseFloat("4").toFixed(2)).toLocaleString('en', {minimumFractionDigits: 2}));
		return x;
	}

}
