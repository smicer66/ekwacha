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

import { LoginPage } from '../login/login';
import { BillPaymentPage } from '../bill-payment/bill-payment';
import { ListGroupsPage } from '../list-groups/list-groups';

/**
 * Generated class for the NewContributionPackagePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

interface NewContributionPackageInterface{
	status: any;
	message: any;
}

@IonicPage()
@Component({
  selector: 'page-new-contribution-package',
  templateUrl: 'new-contribution-package.html',
})
export class NewContributionPackagePage {
	
	newContributionPackageData = { packageName: '', regularPeriod: '', paymentInterval: '', contributionCount: '', packageAmount: '', 
		penaltyAmount: '', penaltyType: '', aboutPackage: '', minContributions: '', minLoanAmount: '', maxLoanAmount: '', 
		repaymentPeriodType: '', minLoanPeriod: '', maxLoanPeriod: '', interestRate: '', tenorType: '', penalty: '', loanPenaltyType: ''  };
	newContributionPackageForm : FormGroup;
	memberPhoneNumber: AbstractControl;
	packageName: AbstractControl;
	regularPeriod: AbstractControl;
	paymentInterval: AbstractControl;
	contributionCount: AbstractControl;
	packageAmount: AbstractControl;
	penaltyAmount: AbstractControl;
	penaltyType: AbstractControl;
	aboutPackage: AbstractControl;
	minContributions: AbstractControl;
	minLoanAmount: AbstractControl;
	maxLoanAmount: AbstractControl;
	minLoanPeriod: AbstractControl;
	maxLoanPeriod: AbstractControl;
	repaymentPeriodType: AbstractControl;
	interestRate: AbstractControl;
	tenorType: AbstractControl;
	penalty: AbstractControl;
	loanPenaltyType: AbstractControl;
	
	
	groupId: any;
	message: any;
	groupName: any;
	title: any;
	groupTitle: any;
	token: any;
	loading: any;
	
	
	
	constructor(public platform: Platform, public actionSheetCtrl: ActionSheetController, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public storage: Storage, public http: HttpClient, public toastCtrl: ToastController, public afAuth: AngularFireAuth, public fb: FormBuilder, public navCtrl: NavController, public navParams: NavParams) {
		this.message = navParams.get('message');
		this.groupId = navParams.get('groupId');
		this.groupName = navParams.get('groupName');
		this.title = navParams.get('nextTitle');
		if(this.title!=undefined && this.title!=null)
		{
		
		}
		else
		{
			this.title = 'New Contribution Package';
			this.groupTitle = this.groupName;
		}
		
		this.newContributionPackageForm = this.fb.group({
			'memberPhoneNumber' : [null, Validators.compose([Validators.required])],
			'packageName': [null, Validators.compose([Validators.required])],
			'regularPeriod': [null, Validators.compose([Validators.required])],
			'paymentInterval': [null, Validators.compose([Validators.required])],
			'contributionCount': [null, Validators.compose([Validators.required])],
			'packageAmount': [null, Validators.compose([Validators.required])],
			'penaltyAmount': [null, Validators.compose([Validators.required])],
			'penaltyType': [null, Validators.compose([Validators.required])],
			'aboutPackage': [null, Validators.compose([])],
			'minContributions': [null, Validators.compose([Validators.required])],
			'minLoanAmount': [null, Validators.compose([Validators.required])],
			'maxLoanAmount': [null, Validators.compose([Validators.required])],
			'minLoanPeriod': [null, Validators.compose([Validators.required])],
			'maxLoanPeriod': [null, Validators.compose([Validators.required])],
			'interestRate': [null, Validators.compose([Validators.required])],
			'tenorType': [null, Validators.compose([Validators.required])],
			'repaymentPeriodType': [null, Validators.compose([Validators.required])],
			'penalty': [null, Validators.compose([Validators.required])],
			'loanPenaltyType': [null, Validators.compose([Validators.required])]
		});

        this.memberPhoneNumber = this.newContributionPackageForm.controls['memberPhoneNumber'];
        this.packageName = this.newContributionPackageForm.controls['packageName'];
        this.regularPeriod = this.newContributionPackageForm.controls['regularPeriod'];
        this.paymentInterval = this.newContributionPackageForm.controls['paymentInterval'];
        this.contributionCount = this.newContributionPackageForm.controls['contributionCount'];
        this.packageAmount = this.newContributionPackageForm.controls['packageAmount'];
        this.penaltyAmount = this.newContributionPackageForm.controls['penaltyAmount'];
        this.penaltyType = this.newContributionPackageForm.controls['penaltyType'];
        this.aboutPackage = this.newContributionPackageForm.controls['aboutPackage'];
        this.minContributions = this.newContributionPackageForm.controls['minContributions'];
        this.minLoanAmount = this.newContributionPackageForm.controls['minLoanAmount'];
        this.maxLoanAmount = this.newContributionPackageForm.controls['maxLoanAmount'];
        this.minLoanPeriod = this.newContributionPackageForm.controls['minLoanPeriod'];
        this.maxLoanPeriod = this.newContributionPackageForm.controls['maxLoanPeriod'];
        this.interestRate = this.newContributionPackageForm.controls['interestRate'];
        this.tenorType = this.newContributionPackageForm.controls['tenorType'];
		this.repaymentPeriodType = this.newContributionPackageForm.controls['repaymentPeriodType'];
		this.penalty = this.newContributionPackageForm.controls['penalty'];
		this.loanPenaltyType = this.newContributionPackageForm.controls['loanPenaltyType'];
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad NewContributionPackagePage');
	}
	
	
	doGroupCreateContributionPackage(newContributionPackageData)
	{
		console.log(this.newContributionPackageData);
		
		this.storage.get('zambia_bank_customer_token').then((val) => {
			this.token = val;
			let header = new HttpHeaders();
			header = header.set('Content-Type', 'application/x-www-form-urlencoded');
			header = header.set('Accept-Language', 'en-US,en;q=0.5');
			header = header.set('auth_token', this.token);
			
			
			const httpOptions = {headers: header};
			
			var parameter = "";
			let url = "";
			
			url = "http://localhost:8080/EKwachaWebService/NCE/services/GroupServices/createNewContributionPackage";
			var form_params = "";
			form_params = form_params + "&packageName=" + encodeURI(this.newContributionPackageData.packageName);
			form_params = form_params + "&contributionAmount=" + encodeURI(this.newContributionPackageData.packageAmount);
			form_params = form_params + "&contributionPeriod=" + encodeURI(this.newContributionPackageData.regularPeriod);
			form_params = form_params + "&contributionPeriodType=" + encodeURI(this.newContributionPackageData.paymentInterval);
			form_params = form_params + "&minimumBalanceRequired=" + encodeURI(this.newContributionPackageData.minContributions);
			form_params = form_params + "&story=" + encodeURI(this.newContributionPackageData.aboutPackage);
			form_params = form_params + "&numberOfPayments=" + encodeURI(this.newContributionPackageData.contributionCount);
			form_params = form_params + "&penaltyApplicable=" + encodeURI(this.newContributionPackageData.penaltyAmount);
			form_params = form_params + "&penaltyApplicableType=" + encodeURI(this.newContributionPackageData.penaltyType);
			form_params = form_params + "&groupId=" + encodeURI(this.groupId);
			form_params = form_params + "&minLoanAmount=" + encodeURI(this.newContributionPackageData.minLoanAmount);
			form_params = form_params + "&maxLoanAmount=" + encodeURI(this.newContributionPackageData.maxLoanAmount);
			form_params = form_params + "&minTerm=" + encodeURI(this.newContributionPackageData.minLoanPeriod);
			form_params = form_params + "&maxTerm=" + encodeURI(this.newContributionPackageData.maxLoanPeriod);
			form_params = form_params + "&repaymentPeriodType=" + encodeURI(this.newContributionPackageData.repaymentPeriodType);
			form_params = form_params + "&interestRate=" + encodeURI(this.newContributionPackageData.interestRate);
			form_params = form_params + "&interestType=" + encodeURI(this.newContributionPackageData.tenorType);
			form_params = form_params + "&penalty=" + encodeURI(this.newContributionPackageData.penalty);
			form_params = form_params + "&loanPenaltyType=" + encodeURI(this.newContributionPackageData.loanPenaltyType);
			
			parameter = form_params;	
			console.log(parameter);
				
			
			
			this.loading = this.loadingCtrl.create({
				content: 'Loading View. Please wait...'
			});
			this.loading.present();
			this.http.post<NewContributionPackageInterface>(url, parameter, httpOptions).subscribe(
				res1 => {
					console.log(res1);
					this.loading.dismiss();
					if(res1.status==0)
					{
						this.navCtrl.setRoot(ListGroupsPage, {message: res1.message});
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
