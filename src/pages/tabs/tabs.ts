import { Component, ViewChild  } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { Tabs, Events } from 'ionic-angular';
//import { AboutPage } from '../about/about';
//import { ContactPage } from '../contact/contact';
//import { HomePage } from '../home/home';
import { OneBankPage } from '../one-bank/one-bank';
import { EkwachaPage } from '../ekwacha/ekwacha';
import { AccountsPage } from '../accounts/accounts';
import { MiniStatementPage } from '../mini-statement/mini-statement';
import { FundsTransferPage } from '../funds-transfer/funds-transfer';
import { MobileTopUpPage } from '../mobile-top-up/mobile-top-up';
import { BillPaymentPage } from '../bill-payment/bill-payment';
import { FaqsPage } from '../faqs/faqs';
import { NewGroupPage } from '../new-group/new-group';
import { ListGroupsPage } from '../list-groups/list-groups';
import { GroupDashboardPage } from '../group-dashboard/group-dashboard';
import { LoansPage } from '../loans/loans';


@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
	@ViewChild('myTabs') tabRef: Tabs;
	
	//tab1Root = HomePage;
	//tab2Root = AboutPage;
	//tab3Root = ContactPage;
	tab1Root: any = OneBankPage;
	tab2Root: any = EkwachaPage;
	
	action: any;
	
	constructor(public events: Events, public navParams: NavParams) {
		this.action = navParams.get('action');
		if(this.action!=undefined && this.action!=null && this.action==='mini-statement')
		{
			this.tab1Root = MiniStatementPage;
		}
		else if(this.action!=undefined && this.action!=null && this.action==='accounts')
		{
			this.tab1Root = AccountsPage;
		}
		else if(this.action!=undefined && this.action!=null && this.action==='funds-transfer')
		{
			this.tab1Root = FundsTransferPage;
		}
		else if(this.action!=undefined && this.action!=null && this.action==='airtime-top-up')
		{
			this.tab1Root = MobileTopUpPage;
		}
		else if(this.action!=undefined && this.action!=null && this.action==='bill-payments')
		{
			this.tab1Root = BillPaymentPage;
		}
		else if(this.action!=undefined && this.action!=null && this.action==='profile-management')
		{
			this.tab1Root = AccountsPage;
		}
		else if(this.action!=undefined && this.action!=null && this.action==='faqs')
		{
			this.tab1Root = FaqsPage;
		}
		else if(this.action!=undefined && this.action!=null && this.action==='newgroup')
		{
			this.tab2Root = NewGroupPage;
		}
		else if(this.action!=undefined && this.action!=null && this.action==='groups')
		{
			this.tab2Root = ListGroupsPage;
		}
		else if(this.action!=undefined && this.action!=null && this.action==='outstandingContributions')
		{
			this.tab2Root = GroupDashboardPage;
		}
		else if(this.action!=undefined && this.action!=null && this.action==='contributionsPaid')
		{
			this.tab2Root = GroupDashboardPage;
		}
		else if(this.action!=undefined && this.action!=null && this.action==='loans')
		{
			this.tab2Root = LoansPage;
		}
		else if(this.action!=undefined && this.action!=null && this.action==='earnings')
		{
			this.tab2Root = LoansPage;
		}
		else if(this.action!=undefined && this.action!=null && this.action==='transferToWallet')
		{
			this.tab2Root = LoansPage;
		}
		else if(this.action!=undefined && this.action!=null && this.action==='profile-management')
		{
			this.tab1Root = LoansPage;
		}
	}
	
	onTabsChange() {
		console.log(this.tabRef);
		console.log(this.tabRef.getSelected());
		const previousTab = this.tabRef.previousTab(false);
		
		
		if(previousTab) {
			try {
				// Get the navCtrl and pop to the root page
				previousTab.getViews()[0].getNav().popToRoot();
			} catch(exception) {
				// Oops....
				console.error(exception);
			}
		}
		
		if(this.tabRef.getSelected().tabTitle=='eKwacha')
		{
			console.log('ekwacha clicked');
			this.events.publish('tab:clicked', 1, Date.now());
			this.tab2Root = EkwachaPage;
		}
		else if(this.tabRef.getSelected().tabTitle=='One Bank')
		{
			console.log('one bank clicked');
			this.events.publish('tab:clicked', 0, Date.now());
			this.tab1Root = OneBankPage;
		}
	}
}
