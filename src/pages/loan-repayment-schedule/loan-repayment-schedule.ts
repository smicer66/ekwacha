import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { IonicPage, NavController, NavParams, ToastController, ActionSheetController, Platform, AlertController, LoadingController } from 'ionic-angular';
import { FormBuilder} from '@angular/forms';
import 'rxjs/add/operator/take';
import { HttpClient, HttpHeaders } from '@angular/common/http';

/*import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';*/

import { AngularFireAuth } from 'angularfire2/auth';
import { ListGroupsPage } from '../list-groups/list-groups';
//import { ApplyLoanPage } from '../apply-loan/apply-loan';
import { LoginPage } from '../login/login';
import { MakeLoanRepaymentPage } from '../make-loan-repayment/make-loan-repayment';

/**
 * Generated class for the LoanRepaymentSchedulePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

interface LoanDetailsInterface{
	status: any;
	message: any;
	groupName: any;
	principal: any;
	interest: any;
	period: any;
	penalty: any;
	schedule: any;
	loanNo: any;
}

interface LoanRepaymentsInterface{
	status: any;
	message: any;
	repaymentLoanNo: any;
	repaymentGroupName: any;
	repaymentLoanPrincipal: any;
	repaymentLoanInterest: any;
	repaymentLoanPeriod: any;
	repaymentLoanPenalty: any;
	repayments: any;
}

@IonicPage()
@Component({
  selector: 'page-loan-repayment-schedule',
  templateUrl: 'loan-repayment-schedule.html',
})
export class LoanRepaymentSchedulePage {

	loan: any;
	expectedRepayments: any = [];
	pet: any;
	message: any;
	token: any;
	loading: any;
	groupName: any;
	principal: any;
	interest: any;
	period: any;
	penalty: any;
	repaymentLoanNo: any;
	repaymentGroupName: any;
	repaymentLoanPrincipal: any;
	repaymentLoanInterest: any;
	repaymentLoanPeriod: any;
	repaymentLoanPenalty: any;
	repayments: any;
	loanNo: any;
	
	constructor(public platform: Platform, public alertCtrl: AlertController, public storage: Storage, public loadingCtrl: LoadingController, public http: HttpClient, public actionSheetCtrl: ActionSheetController, public toastCtrl: ToastController, public afAuth: AngularFireAuth, public fb: FormBuilder, public navCtrl: NavController, public navParams: NavParams){
		this.loan = navParams.get('loan');
		console.log(this.loan);
		this.message = navParams.get('message');
		console.log(this.message);
		this.pet = 'repaymentSchedule';
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad LoanRepaymentSchedulePage');
		if(this.message!=undefined && this.message!=null)
		{
			this.presentToast({message: this.message});
		}
		this.onRepaymentScheduleSwitch();
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
		this.navCtrl.setRoot(LoginPage);
		
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

	
	presentToast(err) {
		const toast = this.toastCtrl.create({
			message: err.message,
			duration: 3000,
			position: 'bottom'
		});

		toast.present();
	}
	
	makePayment(expectedPayment)
	{
		console.log(expectedPayment);
		this.navCtrl.setRoot(MakeLoanRepaymentPage, {expectedPayment: expectedPayment, loan: this.loan});
		
	}
	
	onSegmentSwitch()
	{
		console.log(this.pet);
		if(this.pet=='repaymentSchedule')
		{
			this.onRepaymentScheduleSwitch();
		}
		else if(this.pet=='repaymentsMade')
		{
			this.onYourPaymentsSwitch();
		}
	}
	
	
	onRepaymentScheduleSwitch()
	{
		this.storage.get('zambia_bank_customer_token').then((val) => {
			this.token = val;
			let header = new HttpHeaders();
			header = header.set('Content-Type', 'application/x-www-form-urlencoded');
			header = header.set('Accept-Language', 'en-US,en;q=0.5');
			header = header.set('auth_token', this.token);
			
			
			const httpOptions = {headers: header};
			
			var parameter = "";
			let url = "";
			
			url = "http://localhost:8080/EKwachaWebService/NCE/services/GroupServices/getLoanDetails";
			var form_params = "loanId=" + this.loan.loanId;
			parameter = form_params;	
			console.log(parameter);
				
			
			
			this.loading = this.loadingCtrl.create({
				content: 'Loading View. Please wait...'
			});
			this.loading.present();
			this.http.post<LoanDetailsInterface>(url, parameter, httpOptions).subscribe(
				res1 => {
					console.log(res1);
					this.loading.dismiss();
					if(res1.status==0)
					{
						this.groupName = (res1.groupName);
						this.principal = (res1.principal);
						this.interest = (res1.interest);
						this.period = (res1.period);
						this.penalty = (res1.penalty);
						this.loanNo = res1.loanNo;
						this.expectedRepayments = JSON.parse(res1.schedule);
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
	
	
	onYourPaymentsSwitch()
	{
		this.storage.get('zambia_bank_customer_token').then((val) => {
			this.token = val;
			let header = new HttpHeaders();
			header = header.set('Content-Type', 'application/x-www-form-urlencoded');
			header = header.set('Accept-Language', 'en-US,en;q=0.5');
			header = header.set('auth_token', this.token);
			
			
			const httpOptions = {headers: header};
			
			var parameter = "";
			let url = "";
			
			url = "http://localhost:8080/EKwachaWebService/NCE/services/GroupServices/getLoanRepayments";
			var form_params = "loanId=" + this.loan.loanId;
			parameter = form_params;	
			console.log(parameter);
				
			
			
			this.loading = this.loadingCtrl.create({
				content: 'Loading View. Please wait...'
			});
			this.loading.present();
			this.http.post<LoanRepaymentsInterface>(url, parameter, httpOptions).subscribe(
				res1 => {
					console.log(res1);
					this.loading.dismiss();
					if(res1.status==0)
					{
						this.repaymentLoanNo = res1.repaymentLoanNo;
						this.repaymentGroupName = (res1.repaymentGroupName);
						this.repaymentLoanPrincipal = (res1.repaymentLoanPrincipal);
						this.repaymentLoanInterest = (res1.repaymentLoanInterest);
						this.repaymentLoanPeriod = (res1.repaymentLoanPeriod);
						this.repaymentLoanPenalty = (res1.repaymentLoanPenalty);
						this.repayments = JSON.parse(res1.repayments);
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
	
}
