import { Component, ViewChild } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Platform, Nav, NavController, MenuController, Events, LoadingController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';
import { IntroPage } from '../pages/intro/intro';
import { LoanApplicationPage } from '../pages/loan-application/loan-application';
import { RepayLoanPage } from '../pages/repay-loan/repay-loan';
import { LoanRepaymentSchedulePage } from '../pages/loan-repayment-schedule/loan-repayment-schedule';
import { RequestChequeBookPage } from '../pages/request-cheque-book/request-cheque-book';
import { RequestCardPage } from '../pages/request-card/request-card';
import { ManageCardsPage } from '../pages/manage-cards/manage-cards';
import { StopChequePaymentPage } from '../pages/stop-cheque-payment/stop-cheque-payment';
import { CashDepositPage } from '../pages/cash-deposit/cash-deposit';
import { CashWithdrawalPage } from '../pages/cash-withdrawal/cash-withdrawal';
import { ChequeDepositPage } from '../pages/cheque-deposit/cheque-deposit';
import { BookBusTicketPage } from '../pages/book-bus-ticket/book-bus-ticket';
import { BuyRailwayTicketPage } from '../pages/buy-railway-ticket/buy-railway-ticket';
import { BuyFlight2Page } from '../pages/buy-flight2/buy-flight2';
import { BuyFlight3Page } from '../pages/buy-flight3/buy-flight3';
import { BuyRailwayTicket2Page } from '../pages/buy-railway-ticket2/buy-railway-ticket2';
import { BuyRailwayTicket3Page } from '../pages/buy-railway-ticket3/buy-railway-ticket3';
//import { CableTvPage } from '../pages/cable-tv/cable-tv';
//import { PayMerchantPage } from '../pages/pay-merchant/pay-merchant';
import { PaySchoolFeesPage } from '../pages/pay-school-fees/pay-school-fees';
//import { BookFlightPage } from '../pages/book-flight/book-flight';
//import { BuyInternetDataPage } from '../pages/buy-internet-data/buy-internet-data';
//import { PayUtilitiesPage } from '../pages/pay-utilities/pay-utilities';
import { FundsTransferPage } from '../pages/funds-transfer/funds-transfer';
//import { FundsTransferWithinBankPage } from '../pages/funds-transfer-within-bank/funds-transfer-within-bank';
//import { FundsTransferOtherBanksPage } from '../pages/funds-transfer-other-banks/funds-transfer-other-banks';
//import { FundsTransferInternationalPage } from '../pages/funds-transfer-international/funds-transfer-international';
//import { FundsTransferSubsidiaryPage } from '../pages/funds-transfer-subsidiary/funds-transfer-subsidiary';
import { MiniStatementPage } from '../pages/mini-statement/mini-statement';
import { BillPaymentPage } from '../pages/bill-payment/bill-payment';
import { MobileTopUpPage } from '../pages/mobile-top-up/mobile-top-up';
import { LoginpasswordPage } from '../pages/loginpassword/loginpassword';

import { AccountsPage } from '../pages/accounts/accounts';
import { LoansPage } from '../pages/loans/loans';
import { ListGroupsPage } from '../pages/list-groups/list-groups';
import { NewGroupPage } from '../pages/new-group/new-group';
import { ChequesCardsPage } from '../pages/cheques-cards/cheques-cards';
import { DepositsWithdrawalsPage } from '../pages/deposits-withdrawals/deposits-withdrawals';
import { FaqsPage } from '../pages/faqs/faqs';
import { AnalysisPage } from '../pages/analysis/analysis';
import { LoginPage } from '../pages/login/login';
//import { ManageAccountsPage } from '../pages/manage-accounts/manage-accounts';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
	rootPage:any = IntroPage;
	@ViewChild(Nav) nav: Nav;
	//@ViewChild('mycontent') nav: NavController;
	
	ekwachaActive: any = false;
	

	constructor(public loadingCtrl: LoadingController, public storage: Storage, public events: Events, platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public menuCtrl: MenuController) {
		platform.ready().then(() => {
			  // Okay, so the platform is ready and our plugins are available.
			  // Here you can do any higher level native things you might need.
			  statusBar.styleDefault();
			  splashScreen.hide();
			}
		);
		events.subscribe('tab:clicked', (tabClicked, time) => {
			console.log(['Welcome', tabClicked, 'at', time]);
			if(tabClicked==0)
			{
				this.ekwachaActive = false;
			}
			else if(tabClicked==1)
			{
				this.ekwachaActive = true;
			}
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
		//window.location.reload();
		this.menuCtrl.toggle();
		this.rootPage = LoginPage;
	}

	openPage(page)
	{
		let params = {};
		if(page=='mini-statement')
			this.nav.setRoot(TabsPage, {action: 'mini-statement'});
		else if(page=='accounts')
			this.nav.setRoot(TabsPage, {action: 'accounts'});
		else if(page=='funds-transfer')
			this.nav.setRoot(TabsPage, {action: 'funds-transfer'});
		else if(page=='airtime-top-up')
			this.nav.setRoot(TabsPage, {action: 'airtime-top-up'});
		else if(page=='bill-payments')
			this.nav.setRoot(TabsPage, {action: 'bill-payments'});
		else if(page=='loans')
			this.nav.setRoot(TabsPage, {action: 'loans'});
		else if(page=='cheques-cards')
			this.nav.setRoot(TabsPage, {action: 'cheques-cards'});
		else if(page=='deposits-withdrawals')
			this.nav.setRoot(TabsPage, {action: 'deposits-withdrawals'});
		else if(page=='account-officer')
			this.nav.setRoot(TabsPage, {action: 'account-officer'});
		else if(page=='pay-school-fees')
			this.nav.setRoot(TabsPage, {action: 'pay-school-fees'});
		else if(page=='profile-management')
			this.nav.setRoot(TabsPage, {action: 'profile-management'});
		else if(page=='faqs')
			this.nav.setRoot(TabsPage, {action: 'faqs'});
		else if(page=='newgroup')
			this.nav.setRoot(TabsPage, {action: 'newgroup'});
		else if(page=='groups')
			this.nav.setRoot(TabsPage, {action: 'groups'});
		else if(page=='outstandingContributions')
			this.nav.setRoot(TabsPage, {action: 'outstandingContributions'});
			
		/*if(page=='mini-statement')
			this.nav.setRoot(MiniStatementPage, {action: 'mini-statement'});
		else if(page=='accounts')
			this.nav.setRoot(TabsPage, {action: 'accounts'});
		else if(page=='funds-transfer')
			this.nav.setRoot(FundsTransferPage, {action: 'funds-transfer'});
		else if(page=='airtime-top-up')
			this.nav.setRoot(MobileTopUpPage, {action: 'airtime-top-up'});
		else if(page=='bill-payments')
			this.nav.setRoot(BillPaymentPage, {action: 'bill-payments'});
		else if(page=='loans')
			this.nav.setRoot(LoansPage, {action: 'loans'});
		else if(page=='cheques-cards')
			this.nav.setRoot(ChequesCardsPage, {action: 'cheques-cards'});
		else if(page=='deposits-withdrawals')
			this.nav.setRoot(DepositsWithdrawalsPage, {action: 'deposits-withdrawals'});
		else if(page=='account-officer')
			this.nav.setRoot(BillPaymentPage, {action: 'account-officer'});
		else if(page=='pay-school-fees')
			this.nav.setRoot(PaySchoolFeesPage, {action: 'pay-school-fees'});
		else if(page=='profile-management')
			this.nav.setRoot(BillPaymentPage, {action: 'profile-management'});
		else if(page=='faqs')
			this.nav.setRoot(FaqsPage, {action: 'faqs'});
		else if(page=='newgroup')
			this.nav.setRoot(NewGroupPage, {action: 'newgroup'});
		else if(page=='groups')
			this.nav.setRoot(ListGroupsPage, {action: 'groups'});
		else if(page=='outstandingContributions')
			this.nav.setRoot(ListGroupsPage, {action: 'outstandingContributions'});*/
			
		this.menuCtrl.toggle();
	}
}
//npm install ws@3.3.2 --save-dev --save-exact
