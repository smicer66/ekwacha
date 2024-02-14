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
 * Generated class for the GroupDashboardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

 
interface GroupDataInterface{
	status: any;
	message: any;
	groupList: any;
	expectedPayments: any;
	groupLoans: any;
	yourLoans: any;
	groupMembers: any;
	activities: any;
	payments: any;
	groupAdmins: any;
}


@IonicPage()
@Component({
  selector: 'page-group-dashboard',
  templateUrl: 'group-dashboard.html',
})
export class GroupDashboardPage {

	groupData = { activityDetails: '' };
	groupForm : FormGroup;
	activityDetails: AbstractControl;
	
	pet: any;
	token: any;
	loading: any;
	all_groups_list: any;
	groups_list: any;
	group: any;
	activities: any = [];
	groupMembers: any = [];
	groupLoans: any = [];
	yourLoans: any = [];
	payments: any = [];
	expectedPayments: any = [];
	groupAdmins: any = [];
	isAdmin: any = false;
	
	
	
	constructor(public platform: Platform, public alertCtrl: AlertController, public storage: Storage, public loadingCtrl: LoadingController, public http: HttpClient, public actionSheetCtrl: ActionSheetController, public toastCtrl: ToastController, public afAuth: AngularFireAuth, public fb: FormBuilder, public navCtrl: NavController, public navParams: NavParams){
		this.group = navParams.get('group');
		this.isAdmin = navParams.get('isAdmin');
		console.log(this.group);
		console.log(this.isAdmin);
		this.groupForm = this.fb.group({
			'activityDetails' : [null, Validators.compose([Validators.required])]
		});
		this.pet = 'timeline';
        this.activityDetails = this.groupForm.controls['activityDetails'];
		
		
		
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad GroupDashboardPage');
		this.storage.get('zambia_bank_customer_token').then((val) => {
			this.token = val;
			let header = new HttpHeaders();
			header = header.set('Content-Type', 'application/x-www-form-urlencoded');
			header = header.set('Accept-Language', 'en-US,en;q=0.5');
			header = header.set('auth_token', this.token);
			
			
			const httpOptions = {headers: header};
			
			var parameter = "";
			let url = "";
			
			url = "http://localhost:8080/EKwachaWebService/NCE/services/GroupServices/getGroupData";
			var form_params = "groupId=" + this.group.groupId;
			parameter = form_params;	
			console.log(parameter);
				
			
			
			this.loading = this.loadingCtrl.create({
				content: 'Loading View. Please wait...'
			});
			this.loading.present();
			this.http.post<GroupDataInterface>(url, parameter, httpOptions).subscribe(
				res1 => {
					console.log(res1);
					this.loading.dismiss();
					if(res1.status==0)
					{
						this.activities = JSON.parse(res1.activities);
						this.groupMembers = JSON.parse(res1.groupMembers);
						this.groupAdmins = JSON.parse(res1.groupAdmins);
						this.groupLoans = JSON.parse(res1.groupLoans);
						this.yourLoans = JSON.parse(res1.yourLoans);
						console.log(this.groupLoans);
						console.log(this.yourLoans);
						this.payments = JSON.parse(res1.payments);
						this.expectedPayments = JSON.parse(res1.expectedPayments);
						this.all_groups_list = this.groups_list;
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
	
	
	applyLoan(loanTerm)
	{
		console.log(loanTerm);
		this.navCtrl.setRoot(ApplyLoanPage, {loanTerm: loanTerm});
	}
	
	startContributions(loan, startOrEnd){
		this.storage.get('zambia_bank_customer_token').then((val) => {
			this.token = val;
			let header = new HttpHeaders();
			header = header.set('Content-Type', 'application/x-www-form-urlencoded');
			header = header.set('Accept-Language', 'en-US,en;q=0.5');
			header = header.set('auth_token', this.token);
			
			
			const httpOptions = {headers: header};
			
			var parameter = "";
			let url = "";
			
			url = "http://localhost:8080/EKwachaWebService/NCE/services/GroupServices/startContributionPackage";
			var form_params = "packageId=" + loan.contributionPackageId;
			var form_params = form_params + "&startOrEnd=" + startOrEnd;
			parameter = form_params;	
			console.log(parameter);
			console.log(form_params);
				
			
			
			this.loading = this.loadingCtrl.create({
				content: 'Loading View. Please wait...'
			});
			this.loading.present();
			this.http.post<GroupDataInterface>(url, parameter, httpOptions).subscribe(
				res1 => {
					console.log(res1);
					this.loading.dismiss();
					if(res1.status==0)
					{
						var groupList = JSON.parse(res1.groupList);
						var gp = null;
						for(var i5=0; i5<groupList.length; i5++)
						{
							var gp1 = groupList[i5];
							if(gp1.groupId==this.group.groupId)
							{
								this.group = gp1;
								console.log(gp1);
							}
						}
						console.log(this.group);
						this.loading.dismiss();
						this.presentToast({message: res1.message});
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
	
	
	viewLoan(loan)
	{
		console.log(loan);
		this.navCtrl.setRoot(LoanRepaymentSchedulePage, {loan: loan});
	}
	
	
	makeAdmin(groupMember)
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
			
			url = "http://localhost:8080/EKwachaWebService/NCE/services/GroupServices/makeGoupMemberAdmin";
			var form_params = "groupId=" + this.group.groupId;
			var form_params = form_params + "&groupMemberId=" + groupMember.groupMemberId;
			parameter = form_params;	
			console.log(parameter);
				
			
			
			this.loading = this.loadingCtrl.create({
				content: 'Loading View. Please wait...'
			});
			this.loading.present();
			this.http.post<GroupDataInterface>(url, parameter, httpOptions).subscribe(
				res1 => {
					console.log(res1);
					this.loading.dismiss();
					if(res1.status==0)
					{
						var groupList = JSON.parse(res1.groupList);
						console.log(groupList);
						var gp = null;
						for(var i5=0; i5<groupList.length; i5++)
						{
							var gp1 = groupList[i5];
							if(gp1.groupId==this.group.groupId)
							{
								this.group = gp1;
								console.log(gp1);
							}
						}
						console.log(this.group);
						this.presentToast({message: res1.message});
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
	
	
	makePayment(expectedPayment)
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
			
			if(expectedPayment.paymentType=='Contribution')
			{
				url = "http://localhost:8080/EKwachaWebService/NCE/services/GroupServices/payContribution";
				var form_params = "expectedGroupPaymentId=" + expectedPayment.id;
				var form_params = form_params + "&amount=" + expectedPayment.amount;
				parameter = form_params;	
				console.log(parameter);
					
				
				
				this.loading = this.loadingCtrl.create({
					content: 'Loading View. Please wait...'
				});
				this.loading.present();
				this.http.post<GroupDataInterface>(url, parameter, httpOptions).subscribe(
					res1 => {
						console.log(res1);
						this.loading.dismiss();
						if(res1.status==0)
						{
							var expectedPayments = JSON.parse(res1.expectedPayments);
							console.log(expectedPayments);
							this.expectedPayments = expectedPayments;
							this.presentToast({message: res1.message});
						}
						else
						{
							this.presentToast({message: res1.message});
						}
					},
					err => {					
						this.loading.dismiss();
						console.log('Error occured');
						this.presentToast({message: 'Oops! Seems we experienced a connectivity issue while trying to make this payment'});
						this.navCtrl.setRoot(ListGroupsPage);
					}
				);
			}
			else if(expectedPayment.paymentType=='Loan Repayment')
			{
				this.navCtrl.setRoot(ListGroupsPage, {expectedPayment:expectedPayment});
			}
			
		});
	}
}
