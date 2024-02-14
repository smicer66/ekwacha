import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Storage } from "@ionic/storage";
import { LoginPage } from '../login/login';
import { AddBankAccountPage } from '../add-bank-account/add-bank-account';
import { FundsTransferPage } from '../funds-transfer/funds-transfer';

/**
 * Generated class for the ManageAccountsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-manage-accounts',
  templateUrl: 'manage-accounts.html',
})
export class ManageAccountsPage {
	accounts_list: any = [];
	token: any;
	bank_list: any;
	
	
	constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public loadingCtrl: LoadingController) {
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad ManageAccountsPage');
		this.storage.get('zambia_bank_list').then((bankStr) => {
			this.bank_list = JSON.parse(bankStr);
			var banks = {};
			for(var i1=0; i1<this.bank_list.length; i1++)
			{
				var bank = this.bank_list[i1];
				var key = 'bank_' + bank.id;
				banks[key] = bank;
			}
			this.bank_list = banks;
			console.log(this.bank_list);
			
			this.storage.get('zambia_bank_customer_token').then((val) => {
				this.token = val;
				this.storage.get('zambia_bank_customer_accounts').then((val1) => {
					var allCustomerAccounts = JSON.parse(val1);
					console.log(allCustomerAccounts);
					var all_accounts = [];
					this.storage.get('zambia_bank_loggedInUser').then((userStr) => {
						var userStrJS = JSON.parse(userStr);
						var key1 = "accts" + userStrJS.id;
						var acctsExisting = allCustomerAccounts[key1];
						this.accounts_list = acctsExisting;
						console.log(this.accounts_list);
						for(var i=0; i<this.accounts_list.length; i++)
						{
							var account = this.accounts_list[i];
							var key_ = 'bank_' + account.customerBankId;
							var bank_ = this.bank_list[key_];
							var account_ = {};
							var imgurl = 'assets/imgs/' + account.logoUrl;
							account_ = {bankId: account.customerBankId, bankName: account.customerBankName, accountName: account.customerBankAccountName, 
								accountNumber: account.customerBankAccountNumber, accountType: account.accountType, availableBalance: '...Fetching Balance', 
								logoUrl: imgurl, bgColor: (i%2==0 ? '' : '#E2F5D6')};
							all_accounts.push(account_);
						}
						this.accounts_list = all_accounts;
						console.log(this.accounts_list);
					});
				});
			});
		});
	}

	addNewBankAccount()
	{
		this.navCtrl.setRoot(AddBankAccountPage, {fromWhere: 1});
	}
	
	transferMoney(acct)
	{
		this.navCtrl.setRoot(FundsTransferPage, {acct: acct});
	}
	
	
	removeAccount(acct)
	{
		this.storage.get('zambia_bank_customer_accounts').then((val) => {
			var bank_acct_list = JSON.parse(val);
			this.storage.get('zambia_bank_loggedInUser').then((userStr) => {
				var userStrJS = JSON.parse(userStr);
				var userKey = "accts" + userStrJS.id;
				var userAccts = bank_acct_list[userKey];
				var newAcctList = [];
				for(var i1=0; i1<userAccts.length; i1++)
				{
					var bankAcctEntry = userAccts[i1];
					if(acct.customerBankAccountId!=bankAcctEntry.customerBankAccountId)
					{
						//var key = 'bank_' + bank.id;
						newAcctList.push(bankAcctEntry);
					}
				}
				userAccts[userKey] =  newAcctList;
				this.storage.set('zambia_bank_customer_accounts', JSON.stringify(userAccts)).then(rp => {
					var all_accounts = [];
					for(var i=0; i<newAcctList.length; i++)
					{
						var account = newAcctList[i];
						var key_ = 'bank_' + account.customerBankId;
						var bank_ = this.bank_list[key_];
						var account_ = {};
						var imgurl = 'assets/imgs/' + account.logoUrl;
						account_ = {bankId: account.customerBankId, bankName: account.customerBankName, accountName: account.customerBankAccountName, 
							accountNumber: account.customerBankAccountNumber, accountType: account.accountType, availableBalance: '...Fetching Balance', 
							logoUrl: imgurl, bgColor: (i%2==0 ? '' : '#E2F5D6')};
						all_accounts.push(account_);
					}
					this.accounts_list = all_accounts;
				});
			});
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
		this.navCtrl.setRoot(LoginPage);
		
	}

}
