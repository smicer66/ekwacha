import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ActionSheetController, AlertController, LoadingController } from 'ionic-angular';
import { FormBuilder } from '@angular/forms';
import { Storage } from "@ionic/storage";
import 'rxjs/add/operator/take';
import { HttpClient, HttpHeaders } from '@angular/common/http';

/*import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';*/

import { AngularFireAuth } from 'angularfire2/auth';
//import { LoadingProvider } from '../../providers/loading/loading';

import { LoginPage } from '../login/login';
import { Chart } from 'chart.js';

/**
 * Generated class for the AnalysisPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
 
interface AnalysisRespInt{
	list : any;
	accounts_list : any;
	status: any;
	customerAccount: any;
}

@IonicPage()
@Component({
  selector: 'page-analysis',
  templateUrl: 'analysis.html',
})
export class AnalysisPage {
	@ViewChild('lineCanvas') lineCanvas;
	lineChart: any;
	
	transactionslist: any = [];
	accounts_list: any = [];
	token: any;
	customerAccount: any = {accountNumber:'', availableBalance:''};
	
	constructor(public storage: Storage, public alertCtrl: AlertController, public loadingCtrl: LoadingController, public http: HttpClient, public actionSheetCtrl: ActionSheetController, public toastCtrl: ToastController, public afAuth: AngularFireAuth, public fb: FormBuilder, public navCtrl: NavController, public navParams: NavParams) {
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad AnalysisPage');
		this.storage.get('zambia_bank_customer_token').then((val) => {
			console.log(val);
			this.token = val;
			
			let header = new HttpHeaders();
			header = header.set('Content-Type', 'application/json; charset=utf-8');
			header = header.set('Accept', 'application/json');
			header = header.set('auth_token', this.token);
			console.log(header);
			const httpOptions = {headers: header};
			var parameter = JSON.stringify({ });
			console.log(parameter);
				
			let url = "http://localhost:8080/EKwachaWebService/NCE/services/CustomerServices/getWalletDashboard";
			this.http.get<AnalysisRespInt>(url, httpOptions).subscribe(
				res1 => {
					console.log(res1);
					if(res1.status==0)
					{
						this.transactionslist = res1.list;
						this.accounts_list = res1.accounts_list;
						this.customerAccount = JSON.parse(res1.customerAccount);
						
						this.lineChart = new Chart(this.lineCanvas.nativeElement, {
							type: 'doughnut',
							data: {
								labels: ["Airtime", "Utilities", "Merchants"],
								datasets: [{
									data: [65, 59, 80],
									backgroundColor: [
										'rgba(0, 255, 0, 1)',
										'rgba(255, 0, 0, 1)',
										'rgba(0, 0, 255, 1)',
									]
								}]
							},
							options: {
								legend: {
									display: false
								},
								tooltips: {
									callbacks: {
									   label: function(tooltipItem) {
											  return tooltipItem.yLabel;
									   }
									}
								},
								title: {
									display: false,
									fontStyle: 'bold',
									fontSize: 18
								}
							}
						});
					}
					else
					{
						this.transactionslist = [];
						this.accounts_list = [];
						
						this.lineChart = new Chart(this.lineCanvas.nativeElement, {
							type: 'doughnut',
							data: {
								datasets: [{
									data: [65, 59, 80],
									backgroundColor: [
										'rgba(0, 255, 0, 1)',
										'rgba(255, 0, 0, 1)',
										'rgba(0, 0, 255, 1)'
									]
								}]
							},
							options: {
								legend: {
									display: false
								},
								tooltips: {
									callbacks: {
									   label: function(tooltipItem) {
											  return tooltipItem.yLabel;
									   }
									}
								},
								title: {
									display: false,
									fontStyle: 'bold',
									fontSize: 18
								}
							}
						});
					}
				},
				err => {
					console.log('Error occured');
					this.navCtrl.setRoot(LoginPage);
				}
			);
		});
		
		
	}
	
	
	goToAirtime()
	{
	
	}
	
	goToUtilities()
	{
	
	}
	
	goToPayments()
	{
	
	}
	
	goToTransfers()
	{
	
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
	
	
	formatNumber(number, places)
	{
		return Number(parseFloat(number).toFixed(places)).toLocaleString('en', {minimumFractionDigits: places});
	}

}
