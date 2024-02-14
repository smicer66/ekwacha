import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ActionSheetController, Platform, AlertController, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Storage } from "@ionic/storage";
import 'rxjs/add/operator/take';
import { HttpClient, HttpHeaders } from '@angular/common/http';
/*import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';*/
import { AngularFireAuth } from 'angularfire2/auth';
import { LoginPage } from '../login/login';
import { FundsTransferPage } from '../funds-transfer/funds-transfer';
//import { LoadingProvider } from '../../providers/loading/loading';

/**
 * Generated class for the FundsTransferWithinBankPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
 
@IonicPage()
@Component({
  selector: 'page-funds-transfer-within-bank',
  templateUrl: 'funds-transfer-within-bank.html',
})
export class FundsTransferWithinBankPage {
	ftWithinFormData = { sourceBankAccount: '', destinationType:'', toWho: '', destinationBankAccount: null, destinationBank: '', recAccountNo: '', recWalletId: null, 
		recWalletNo: '', amount: '', narration: '', pin1: '', pin2: '', pin3: '', pin4: '', mobilemoneyreceipient: '' };
	ftWithinForm : FormGroup;
	sourceBankAccount: AbstractControl;
	destinationType: AbstractControl;
	toWho: AbstractControl;
	destinationBankAccount: AbstractControl;
	destinationBank: AbstractControl;
	recAccountNo: AbstractControl;
	recWalletNo: AbstractControl;
	amount: AbstractControl;
	narration: AbstractControl;
	mobilemoneyreceipient: AbstractControl;
	pin1: AbstractControl;
	pin2: AbstractControl;
	pin3: AbstractControl;
	pin4: AbstractControl;
	
	accounts_list: any;
	token: any;
	loading: any;
	toSelfAccountList: any;
	displayAmount: any = false;
	bankList: any;
	receipientCustomerWalletId: any;
	
	
	//, public file: File, public filePath: FilePath,public loadingProvider: LoadingProvider, public camera: Camera
	constructor(public platform: Platform,  public storage: Storage, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public http: HttpClient, public actionSheetCtrl: ActionSheetController, public toastCtrl: ToastController, public afAuth: AngularFireAuth, public fb: FormBuilder, public navCtrl: NavController, public navParams: NavParams) {
		this.ftWithinForm = this.fb.group({
			'sourceBankAccount' : [null, Validators.compose([Validators.required])],
			'amount': [null, Validators.compose([Validators.required])],
			'narration': [null, Validators.compose([])],
			'pin1' : [null, Validators.compose([Validators.required])],
			'pin2': [null, Validators.compose([Validators.required])],
			'pin3' : [null, Validators.compose([Validators.required])],
			'pin4': [null, Validators.compose([Validators.required])],
			'destinationType': [null, Validators.compose([])],
			'toWho': [null, Validators.compose([])],
			'destinationBankAccount': [null, Validators.compose([])],
			'destinationBank': [null, Validators.compose([])],
			'recAccountNo': [null, Validators.compose([])],
			'recWalletNo': [null, Validators.compose([])],
			'mobilemoneyreceipient': [null, Validators.compose([Validators.required])],
			
			
		});

		this.sourceBankAccount = this.ftWithinForm.controls['sourceBankAccount'];
		this.destinationType = this.ftWithinForm.controls['destinationType'];
		this.toWho = this.ftWithinForm.controls['toWho'];
		this.destinationBankAccount = this.ftWithinForm.controls['destinationBankAccount'];
		this.destinationBank = this.ftWithinForm.controls['destinationBank'];
		this.recAccountNo = this.ftWithinForm.controls['recAccountNo'];
		this.recWalletNo = this.ftWithinForm.controls['recWalletNo'];
		this.amount = this.ftWithinForm.controls['amount'];
		this.narration = this.ftWithinForm.controls['narration'];
		this.mobilemoneyreceipient = this.ftWithinForm.controls['mobilemoneyreceipient'];
		this.pin1 = this.ftWithinForm.controls['pin1'];
		this.pin2 = this.ftWithinForm.controls['pin2'];
		this.pin3 = this.ftWithinForm.controls['pin3'];
		this.pin4 = this.ftWithinForm.controls['pin4'];
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad BuypayUtilityDataPage');
		this.storage.get('zambia_bank_customer_accounts').then((val1) => {
			var allCustomerAccounts = JSON.parse(val1);
			console.log(allCustomerAccounts);
			var all_accounts = [];
			this.storage.get('zambia_bank_list').then((bankListing) => {
				this.bankList = JSON.parse(bankListing);
				this.storage.get('zambia_bank_loggedInUser').then((userStr) => {
					var userStrJS = JSON.parse(userStr);
					var key1 = "accts" + userStrJS.id;
					var acctsExisting = allCustomerAccounts[key1];
					//this.accounts_list = ;
					console.log(acctsExisting);
					for(var i=0; i<acctsExisting.length; i++)
					{
						
						var account = acctsExisting[i];
						var account_ = {};
						var imgurl = 'assets/imgs/' + account.logoUrl;
						account_ = {bankId: account.customerBankId, bankName: account.customerBankName, accountName: account.customerBankAccountName, 
							accountNumber: account.customerBankAccountNumber, accountType: account.accountType, availableBalance: '...Fetching Balance', 
							logoUrl: imgurl, bgColor: (i%2==0 ? '' : '#E2F5D6'), customerBankAccountId: account.customerBankAccountId, 
							customerAccountId: account.customerAccountId};
						all_accounts.push(account_);
					}
					this.accounts_list = all_accounts;
					this.toSelfAccountList = all_accounts;
					console.log(this.accounts_list);
				});
			});
		});
	}
	
	verifyAccountNo(recAccountNo)
	{
		this.storage.get('zambia_bank_customer_token').then((val) => {
			this.token = val;
			let header = new HttpHeaders();
			header = header.set('Content-Type', 'application/x-www-form-urlencoded');
			header = header.set('Accept-Language', 'en-US,en;q=0.5');
			header = header.set('auth_token', this.token);
			
			
			const httpOptions = {headers: header};
			var form_params = "";
			form_params = form_params + "&receipientBankNumber=" + encodeURI(this.ftWithinFormData.recAccountNo);
			form_params = form_params + "&bankId=" + encodeURI(this.ftWithinFormData.destinationBank);
			console.log(form_params);
			var parameter = form_params;
			this.loading = this.loadingCtrl.create({
				content: 'Please wait...'
			});
			this.loading.present();
			let url = "";
			url = "http://localhost:8080/EKwachaWebService/NCE/services/FundsTransferServices/verifyBankAccountNumber";
			this.http.post<AccountVerify>(url, parameter, httpOptions).subscribe(
				res1 => {
					console.log(res1);
					this.loading.dismiss();
					if(res1.status==0)
					{
						var accountDetail = JSON.parse(res1.accountDetail);
						var accountDetails = '<strong>Account Number: </strong>' + recAccountNo + '<br>';
						accountDetails = accountDetails + '<strong>Account Name: </strong>' + accountDetail.customerName + '<br>';
						accountDetails = accountDetails + '<strong>Bank Name: </strong>' + accountDetail.bankName + '<br>';
						let alert1 = this.alertCtrl.create({
							title: 'Account Verify',
							subTitle: accountDetails,
							buttons: [{
								text: 'Continue',
								role: 'ok',
								handler: () => {
									this.displayAmount = true;
								}
							}]
						});
						alert1.present();
					}
					else
					{
						this.presentToast({message: res1.message});
					}
				},
				err => {
					this.loading.dismiss();
					console.log('Error occured');
					this.presentToast({message: 'Oops! Seems we experienced a connectivity issue while trying to verifying the bank account'});
					this.navCtrl.setRoot(LoginPage);
				}
			);
		});
	}
	
	
	
	
	verifyWalletNo(recWalletNo)
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
			url = "http://localhost:8080/EKwachaWebService/NCE/services/FundsTransferServices/verifyWalletAccountNumber";
			var form_params = "";
			form_params = form_params + "&receipientBankNumber=" + encodeURI(this.ftWithinFormData.recWalletNo);
			parameter = form_params;	
			console.log(parameter);
				
			
			
			this.loading = this.loadingCtrl.create({
				content: 'Loading View. Please wait...'
			});
			this.loading.present();
			this.http.post<AccountVerify>(url, parameter, httpOptions).subscribe(
				res1 => {
					console.log(res1);
					this.loading.dismiss();
					if(res1.status==0)
					{
						var accountDetail = JSON.parse(res1.accountDetail);
						var accountDetails = '<strong>Wallet Number: </strong>' + recWalletNo + '<br>';
						accountDetails = accountDetails + '<strong>Wallet Name: </strong>' + accountDetail.customerName + '<br>';
						let alert1 = this.alertCtrl.create({
							title: 'Wallet Verify',
							subTitle: accountDetails,
							buttons: [{
								text: 'Continue',
								role: 'ok',
								handler: () => {
									this.displayAmount = true;
									this.receipientCustomerWalletId = accountDetail.accountId;
									alert1.dismiss();
									return false;
								}
							}]
						});
						alert1.present();
					}
					else
					{
						this.presentToast({message: res1.message});
					}
				},
				err => {
					this.loading.dismiss();
					console.log('Error occured');
					this.presentToast({message: 'Oops! Seems we experienced a connectivity issue while trying to verifying the bank account'});
					this.navCtrl.setRoot(LoginPage);
				}
			);
		});
	}
	
	
	
	onSourceChange()
	{
		this.displayAmount = false;
		var newDestinationAccountList = [];
		for(var x=0; x<this.accounts_list.length; x++)
		{
			var account = this.accounts_list[x];
			console.log(account);
			console.log(this.ftWithinFormData.sourceBankAccount);
			if(account.customerBankAccountId==this.ftWithinFormData.sourceBankAccount)
			{
			
			}
			else
			{
				newDestinationAccountList.push(account);
			}
		}
		this.toSelfAccountList = newDestinationAccountList;
	}
	
	onDestinationTypeChange()
	{
		this.displayAmount = false;
		if(this.ftWithinFormData.destinationType=='Transfer To Mobile Money')
		{
			this.displayAmount =true;
		}
	}
	
	onTransferToWhoChange()
	{
		if(this.ftWithinFormData.toWho=='Self')
		{
			this.displayAmount = true;
		}
		else
		{
			this.displayAmount = false;
		}
	}
	
	
	doFundsTransfer(ftWithinFormData)
	{
		console.log(ftWithinFormData);
		this.storage.get('zambia_bank_customer_token').then((val) => {
			this.token = val;
			var orderRef = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
			let header = new HttpHeaders();
			header = header.set('Content-Type', 'application/x-www-form-urlencoded');
			header = header.set('Accept-Language', 'en-US,en;q=0.5');
			header = header.set('auth_token', this.token);
			
			
			const httpOptions = {headers: header};
			var parameter = "";
			let url = "";
			if(this.ftWithinFormData.destinationType=='Transfer To A Bank')
			{
				if(this.ftWithinFormData.toWho=='Self')
				{
					var destinationDetails = this.ftWithinFormData.destinationBankAccount.split("###");
					url = "http://localhost:8080/EKwachaWebService/NCE/services/FundsTransferServices/fundsTransferBankToBank";
					var form_params = "";
					form_params = form_params + "&customerBankAccountId=" + encodeURI(this.ftWithinFormData.sourceBankAccount);
					form_params = form_params + "&receipientBankNumber=" + encodeURI(destinationDetails[1]);
					form_params = form_params + "&creditBankId=" + encodeURI(destinationDetails[2]);
					form_params = form_params + "&amount=" + encodeURI(this.ftWithinFormData.amount);
					form_params = form_params + "&selectTransferType=" + encodeURI('B2BS');
					form_params = form_params + "&orderRef=" + encodeURI(orderRef);
					form_params = form_params + "&pin=" + encodeURI((this.ftWithinFormData.pin1 + "" + this.ftWithinFormData.pin2 + "" + this.ftWithinFormData.pin3 + "" + this.ftWithinFormData.pin4));
					
					
					parameter = form_params;
				}
				else if(this.ftWithinFormData.toWho=='Outside')
				{
					url = "http://localhost:8080/EKwachaWebService/NCE/services/FundsTransferServices/fundsTransferBankToBank";
					var form_params = "";
					form_params = form_params + "&customerBankAccountId=" + encodeURI(this.ftWithinFormData.sourceBankAccount);
					form_params = form_params + "&receipientBankNumber=" + encodeURI(this.ftWithinFormData.recAccountNo);
					form_params = form_params + "&creditBankId=" + encodeURI(this.ftWithinFormData.destinationBank);
					form_params = form_params + "&amount=" + encodeURI(this.ftWithinFormData.amount);
					form_params = form_params + "&selectTransferType=" + encodeURI('B2BA');
					form_params = form_params + "&orderRef=" + encodeURI(orderRef);
					form_params = form_params + "&pin=" + encodeURI((this.ftWithinFormData.pin1 + "" + this.ftWithinFormData.pin2 + "" + this.ftWithinFormData.pin3 + "" + this.ftWithinFormData.pin4));
					
					parameter = form_params;
				}
			}
			else if(this.ftWithinFormData.destinationType=='Transfer To A Wallet')
			{
				if(this.ftWithinFormData.toWho=='Self')
				{
					var myWalletId = "";
					url = "http://localhost:8080/EKwachaWebService/NCE/services/FundsTransferServices/fundsTransferBankToEkwachaWallet";
					
					var form_params = "";
					form_params = form_params + "&customerBankAccountId=" + encodeURI(this.ftWithinFormData.sourceBankAccount);
					form_params = form_params + "&amount=" + encodeURI(this.ftWithinFormData.amount);
					form_params = form_params + "&selectTransferType=" + encodeURI('B2WS');
					form_params = form_params + "&orderRef=" + encodeURI(orderRef);
					form_params = form_params + "&pin=" + encodeURI((this.ftWithinFormData.pin1 + "" + this.ftWithinFormData.pin2 + "" + this.ftWithinFormData.pin3 + "" + this.ftWithinFormData.pin4));
					
					parameter = form_params;
				}
				if(this.ftWithinFormData.toWho=='Outside')
				{
					url = "http://localhost:8080/EKwachaWebService/NCE/services/FundsTransferServices/fundsTransferBankToEkwachaWallet";
					
					var form_params = "";
					form_params = form_params + "&customerBankAccountId=" + encodeURI(this.ftWithinFormData.sourceBankAccount);
					form_params = form_params + "&receipientCustomerWalletId=" + encodeURI(this.receipientCustomerWalletId);
					form_params = form_params + "&amount=" + encodeURI(this.ftWithinFormData.amount);
					form_params = form_params + "&selectTransferType=" + encodeURI('B2WA');
					form_params = form_params + "&orderRef=" + encodeURI(orderRef);
					form_params = form_params + "&pin=" + encodeURI((this.ftWithinFormData.pin1 + "" + this.ftWithinFormData.pin2 + "" + this.ftWithinFormData.pin3 + "" + this.ftWithinFormData.pin4));
					
					parameter = form_params;
				}
			}
			console.log(parameter);
				
			
			
			this.loading = this.loadingCtrl.create({
				content: 'Loading View. Please wait...'
			});
			this.loading.present();
			this.http.post<FundsTransferRespInt>(url, parameter, httpOptions).subscribe(
				res1 => {
					console.log(res1);
					this.loading.dismiss();
					if(res1.status==0)
					{
						this.navCtrl.setRoot(FundsTransferPage, {message: res1.message});
					}
					else
					{
						this.presentToast({message: res1.message});
					}
				},
				err => {
					this.loading.dismiss();
					console.log('Error occured');
					this.navCtrl.setRoot(LoginPage);
				}
			);
		});
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
		this.token = null;
		this.navCtrl.setRoot(LoginPage);
		
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

interface FundsTransferRespInt{
	status: any;
	list: any;
	response_msg: any;
	total: any;
	message: any;
}

interface AccountVerify{
	status: any;
	message: any;
	accountDetail: any;
}