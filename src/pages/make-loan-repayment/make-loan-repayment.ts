import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { IonicPage, NavController, NavParams, ToastController, ActionSheetController, Platform, AlertController, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import 'rxjs/add/operator/take';
import { HttpClient, HttpHeaders } from '@angular/common/http';

/*import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';*/

import { AngularFireAuth } from 'angularfire2/auth';
import { ListGroupsPage } from '../list-groups/list-groups';
import { ApplyLoanPage } from '../apply-loan/apply-loan';
import { LoanRepaymentSchedulePage } from '../loan-repayment-schedule/loan-repayment-schedule';

/**
 * Generated class for the MakeLoanRepaymentPage page.
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
}


@IonicPage()
@Component({
  selector: 'page-make-loan-repayment',
  templateUrl: 'make-loan-repayment.html',
})
export class MakeLoanRepaymentPage {
	makeLoanRepaymentData = { amount: '', pin1: '', pin2: '', pin3: '', pin4: ''};
	makeLoanRepaymentForm : FormGroup;
	amount: AbstractControl;
	pin1: AbstractControl;
	pin2: AbstractControl;
	pin3: AbstractControl;
	pin4: AbstractControl;
	
	token: any;
	repaymentNumber: any;
	outstandingBalance: any;
	amountToPay: any;
	dueDate: any;
	loading: any;
	expectedPayment: any;
	loan: any;
	
	constructor(public platform: Platform, public alertCtrl: AlertController, public storage: Storage, public loadingCtrl: LoadingController, public http: HttpClient, public actionSheetCtrl: ActionSheetController, public toastCtrl: ToastController, public afAuth: AngularFireAuth, public fb: FormBuilder, public navCtrl: NavController, public navParams: NavParams){
		this.expectedPayment = navParams.get('expectedPayment');
		console.log(this.expectedPayment);
		this.loan = navParams.get('loan');
		console.log(this.loan);
		this.makeLoanRepaymentForm = this.fb.group({
			'amount': [null, Validators.compose([Validators.required])],
			'pin1': [null, Validators.compose([Validators.required])],
			'pin2': [null, Validators.compose([Validators.required])],
			'pin3': [null, Validators.compose([Validators.required])],
			'pin4': [null, Validators.compose([Validators.required])]
		});

        this.amount = this.makeLoanRepaymentForm.controls['amount'];
        this.pin1 = this.makeLoanRepaymentForm.controls['pin1'];
        this.pin2 = this.makeLoanRepaymentForm.controls['pin2'];
        this.pin3 = this.makeLoanRepaymentForm.controls['pin3'];
        this.pin4 = this.makeLoanRepaymentForm.controls['pin4'];
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad MakeLoanRepaymentPage');
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
			var form_params = "loanId=" + this.expectedPayment.loanId;
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
						var scheduledPayments = JSON.parse(res1.schedule);
						console.log(scheduledPayments);
						var totalToPay: any = 0.00;
						var totalOutstanding: any = 0.00;
						var dueDate: any = "";
						var repaymentNumbers: any = "";
						for(var i1=0; i1<scheduledPayments.length; i1++)
						{
							var scheduledPayment = scheduledPayments[i1];
							console.log(scheduledPayment);
							if(scheduledPayment.isPaid==0)
							{
								totalOutstanding = totalOutstanding + scheduledPayment.principal + scheduledPayment.interest + scheduledPayment.penalty;
								console.log(totalOutstanding);
							}
							if(scheduledPayment.isLate && scheduledPayment.isLate==true && scheduledPayment.isPaid==0)
							{
								dueDate = scheduledPayment.expectedPaymentDate;
								console.log(dueDate);
								totalToPay = totalToPay + scheduledPayment.principal + scheduledPayment.interest + scheduledPayment.penalty;
								console.log(totalToPay);
								repaymentNumbers = repaymentNumbers + "" + scheduledPayment.installmentNumber + ", ";
								console.log(repaymentNumbers);
							}
						}
						
						if(totalToPay==0)
						{
							var i5 = 0;
							for(var i1=0; i1<scheduledPayments.length; i1++)
							{
								var scheduledPayment = scheduledPayments[i1];
								console.log(scheduledPayment);
								if(scheduledPayment.isPaid==0)
								{
									totalOutstanding = totalOutstanding + scheduledPayment.principal + scheduledPayment.interest + scheduledPayment.penalty;
									console.log(totalOutstanding);
								}
								if(scheduledPayment.isPaid==0 && i5==0)
								{
									i5 = 1;
									dueDate = scheduledPayment.expectedPaymentDate;
									console.log(dueDate);
									totalToPay = totalToPay + scheduledPayment.principal + scheduledPayment.interest + scheduledPayment.penalty;
									console.log(totalToPay);
									repaymentNumbers = repaymentNumbers + "" + scheduledPayment.installmentNumber + ", ";
									console.log(repaymentNumbers);
								}
							}
						}
						this.repaymentNumber = repaymentNumbers.length>2 ? repaymentNumbers.substring(0, repaymentNumbers.length-2) : repaymentNumbers;
						console.log(this.repaymentNumber);
						this.outstandingBalance = totalOutstanding;
						console.log(this.outstandingBalance);
						this.amountToPay = totalToPay;
						console.log(this.amountToPay);
						this.dueDate = dueDate;
						console.log(this.dueDate);
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
	
	
	makeRepayment(expectedPayment)
	{
		console.log(expectedPayment);
		this.storage.get('zambia_bank_customer_token').then((val) => {
			this.token = val;
			let header = new HttpHeaders();
			header = header.set('Content-Type', 'application/x-www-form-urlencoded');
			header = header.set('Accept-Language', 'en-US,en;q=0.5');
			header = header.set('auth_token', this.token);
			
			
			const httpOptions = {headers: header};
			
			var parameter = "";
			let url = "";
			
			
			url = "http://localhost:8080/EKwachaWebService/NCE/services/GroupServices/repayGroupLoan";
			var form_params = "groupLoanExpectedRepaymentId=" + this.expectedPayment.repaymentExpectedId;
			form_params = form_params + "&amount=" + this.makeLoanRepaymentData.amount;
			form_params = form_params + "&pin=" + this.makeLoanRepaymentData.pin1 + "" + this.makeLoanRepaymentData.pin2 + "" + 
				this.makeLoanRepaymentData.pin3 + "" + this.makeLoanRepaymentData.pin4;
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
						this.navCtrl.setRoot(LoanRepaymentSchedulePage, {loan: this.loan, message: res1.message});
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

}
