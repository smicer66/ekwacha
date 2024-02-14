import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { Contacts } from 'ionic-native';
import { IonicStorageModule } from '@ionic/storage';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpClientModule } from '@angular/common/http';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { MyApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { IntroPage } from '../pages/intro/intro';

import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { ForgetPage } from '../pages/forget/forget';
import { RegisterStepTwoPage } from '../pages/register-step-two/register-step-two';
import { RegisterStepThreePage } from '../pages/register-step-three/register-step-three';
import { RegisterStepFourPage } from '../pages/register-step-four/register-step-four';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { AnalysisPage } from '../pages/analysis/analysis';
import { BillPaymentPage } from '../pages/bill-payment/bill-payment';
import { MobileTopUpPage } from '../pages/mobile-top-up/mobile-top-up';
import { CableTvPage } from '../pages/cable-tv/cable-tv';
import { PayMerchantPage } from '../pages/pay-merchant/pay-merchant';
import { PaySchoolFeesPage } from '../pages/pay-school-fees/pay-school-fees';
import { BookFlightPage } from '../pages/book-flight/book-flight';
import { BuyInternetDataPage } from '../pages/buy-internet-data/buy-internet-data';
import { PayUtilitiesPage } from '../pages/pay-utilities/pay-utilities';
import { FundsTransferPage } from '../pages/funds-transfer/funds-transfer';
import { FundsTransferWithinBankPage } from '../pages/funds-transfer-within-bank/funds-transfer-within-bank';
import { FundsTransferOtherBanksPage } from '../pages/funds-transfer-other-banks/funds-transfer-other-banks';
import { FundsTransferInternationalPage } from '../pages/funds-transfer-international/funds-transfer-international';
import { FundsTransferSubsidiaryPage } from '../pages/funds-transfer-subsidiary/funds-transfer-subsidiary';
import { AccountsPage } from '../pages/accounts/accounts';
import { LoansPage } from '../pages/loans/loans';
import { ChequesCardsPage } from '../pages/cheques-cards/cheques-cards';
import { DepositsWithdrawalsPage } from '../pages/deposits-withdrawals/deposits-withdrawals';
import { FaqsPage } from '../pages/faqs/faqs';
import { OpenNewAccountPage } from '../pages/open-new-account/open-new-account';
import { ManageAccountsPage } from '../pages/manage-accounts/manage-accounts';
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
import { MiniStatementPage } from '../pages/mini-statement/mini-statement';
import { EkwachaPage } from '../pages/ekwacha/ekwacha';
import { OneBankPage } from '../pages/one-bank/one-bank';
import { AddBankAccountPage } from '../pages/add-bank-account/add-bank-account';
import { VerifyBankAccountPage } from '../pages/verify-bank-account/verify-bank-account';
import { ExpandableComponent } from '../components/expandable/expandable';
import { NewCountryMobilePageModule } from '../pages/new-country-mobile/new-country-mobile.module';
import { LoginpasswordPage } from '../pages/loginpassword/loginpassword';

import { NewGroupPage } from '../pages/new-group/new-group';
import { ListGroupsPage } from '../pages/list-groups/list-groups';
import { GroupDashboardPage } from '../pages/group-dashboard/group-dashboard';
import { ExpectedContributionsPage } from '../pages/expected-contributions/expected-contributions';
import { NewContributionPackagePage } from '../pages/new-contribution-package/new-contribution-package';
import { ListContributionPackagesPage } from '../pages/list-contribution-packages/list-contribution-packages';
import { PayContributionPage } from '../pages/pay-contribution/pay-contribution';
import { JoinGroupPage } from '../pages/join-group/join-group';
import { ListGroupMembersPage } from '../pages/list-group-members/list-group-members';
import { ListContributionsPage } from '../pages/list-contributions/list-contributions';
import { ApplyLoanPage } from '../pages/apply-loan/apply-loan';
import { ViewLoanPage } from '../pages/view-loan/view-loan';
import { ViewLoanTransactionsPage } from '../pages/view-loan-transactions/view-loan-transactions';
import { MakeLoanRepaymentPage } from '../pages/make-loan-repayment/make-loan-repayment';
import { AddMembersToGroupPage } from '../pages/add-members-to-group/add-members-to-group';
import { MobileMoneyTransferPage } from '../pages/mobile-money-transfer/mobile-money-transfer';
import { NimaPaymentsPage } from '../pages/nima-payments/nima-payments';
import { BetwayPaymentPage } from '../pages/betway-payment/betway-payment';


export const firebaseConfig = {
  apiKey: "AIzaSyAXjl9L_uUGLHYNGX0BvqsUx_VExs8zaeY",
   authDomain: "fir-auth-bdcc0.firebaseapp.com",
   databaseURL: "https://fir-auth-bdcc0.firebaseio.com",
   projectId: "fir-auth-bdcc0",
   storageBucket: "fir-auth-bdcc0.appspot.com",
   messagingSenderId: "544712685938"
};

@NgModule({
  declarations: [
    MyApp,
	NewGroupPage,
	ListGroupsPage,
	GroupDashboardPage,
	ExpectedContributionsPage,
	NewContributionPackagePage,
	AddMembersToGroupPage,
	ListContributionPackagesPage,
	PayContributionPage,
	JoinGroupPage,
	ListGroupMembersPage,
	ListContributionsPage,
	ApplyLoanPage,
	ViewLoanPage,
	ViewLoanTransactionsPage,
	MakeLoanRepaymentPage,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
	IntroPage,
	LoginPage,
	LoginpasswordPage,
    RegisterPage,
    ForgetPage,
	RegisterStepTwoPage,
	RegisterStepThreePage,
	RegisterStepFourPage,
	DashboardPage,
	AnalysisPage,
	BillPaymentPage,
	MobileTopUpPage,
	CableTvPage,
	PayMerchantPage,
	PaySchoolFeesPage,
	BookFlightPage,
	BuyInternetDataPage,
	PayUtilitiesPage,
	FundsTransferPage,
	FundsTransferWithinBankPage,
	FundsTransferOtherBanksPage,
	FundsTransferInternationalPage,
	FundsTransferSubsidiaryPage,
	AccountsPage,
	LoansPage,
	ChequesCardsPage,
	DepositsWithdrawalsPage,
	FaqsPage,
	OpenNewAccountPage,
	ManageAccountsPage,
	LoanApplicationPage,
	RepayLoanPage,
	LoanRepaymentSchedulePage,
	RequestChequeBookPage,
	RequestCardPage,
	ManageCardsPage,
	StopChequePaymentPage,
	CashDepositPage,
	CashWithdrawalPage,
	ChequeDepositPage,
	BookBusTicketPage,
	BuyRailwayTicketPage,
	BuyFlight2Page,
	BuyFlight3Page,
	BuyRailwayTicket2Page,
	BuyRailwayTicket3Page,
	MiniStatementPage,
	OneBankPage,
	EkwachaPage,
	AddBankAccountPage,
	VerifyBankAccountPage,
	MobileMoneyTransferPage,
	NimaPaymentsPage,
	BetwayPaymentPage,
	ExpandableComponent
  ],
  imports: [
    BrowserModule,
	HttpClientModule,
    IonicModule.forRoot(MyApp),
	IonicStorageModule.forRoot({
      name: '_zambiabank_v1',
      driverOrder: ['sqlite', 'indexeddb', 'websql']
    }),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
	AngularFontAwesomeModule,
	NewCountryMobilePageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
	NewGroupPage,
	ListGroupsPage,
	GroupDashboardPage,
	ExpectedContributionsPage,
	NewContributionPackagePage,
	AddMembersToGroupPage,
	ListContributionPackagesPage,
	PayContributionPage,
	JoinGroupPage,
	ListGroupMembersPage,
	ListContributionsPage,
	ApplyLoanPage,
	ViewLoanPage,
	ViewLoanTransactionsPage,
	MakeLoanRepaymentPage,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
	IntroPage,
	LoginPage,
	LoginpasswordPage,
	RegisterPage,
    ForgetPage,
	RegisterStepTwoPage,
	RegisterStepThreePage,
	RegisterStepFourPage,
	DashboardPage,
	AnalysisPage,
	BillPaymentPage,
	MobileTopUpPage,
	CableTvPage,
	PayMerchantPage,
	PaySchoolFeesPage,
	BookFlightPage,
	BuyInternetDataPage,
	PayUtilitiesPage,
	FundsTransferPage,
	FundsTransferWithinBankPage,
	FundsTransferOtherBanksPage,
	FundsTransferInternationalPage,
	FundsTransferSubsidiaryPage,
	AccountsPage,
	LoansPage,
	ChequesCardsPage,
	DepositsWithdrawalsPage,
	FaqsPage,
	OpenNewAccountPage,
	ManageAccountsPage,
	LoanApplicationPage,
	RepayLoanPage,
	LoanRepaymentSchedulePage,
	RequestChequeBookPage,
	RequestCardPage,
	ManageCardsPage,
	StopChequePaymentPage,
	CashDepositPage,
	CashWithdrawalPage,
	ChequeDepositPage,
	BookBusTicketPage,
	BuyRailwayTicketPage,
	BuyFlight2Page,
	BuyFlight3Page,
	BuyRailwayTicket2Page,
	BuyRailwayTicket3Page,
	OneBankPage,
	EkwachaPage,
	AddBankAccountPage,
	VerifyBankAccountPage,
	MiniStatementPage,
	MobileMoneyTransferPage,
	NimaPaymentsPage,
	BetwayPaymentPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
	Contacts,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
