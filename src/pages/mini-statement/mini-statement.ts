import { Component } from '@angular/core';
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
import { AnalysisPage } from '../analysis/analysis';
import { BillPaymentPage } from '../bill-payment/bill-payment';

/**
 * Generated class for the MiniStatementPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

 
interface MiniStatementRespInt{
	status: any;
	transactionList: any;
	response_msg: any;
	total: any;
	iconName: any;
}

@IonicPage()
@Component({
  selector: 'page-mini-statement',
  templateUrl: 'mini-statement.html',
})
export class MiniStatementPage {

	token: any;
	transactionslist: any;
	loading: any;
	
	constructor(public storage: Storage, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public http: HttpClient, public actionSheetCtrl: ActionSheetController, 
		public toastCtrl: ToastController, public afAuth: AngularFireAuth, public fb: FormBuilder, public navCtrl: NavController, public navParams: NavParams) {
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad MiniStatementPage');
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
				
			var url = "http://localhost:8080/EKwachaWebService/NCE/services/CustomerServices/getMiniStatement";
			var form_params = "";
			parameter = form_params;
			this.loading = this.loadingCtrl.create({
				content: 'Loading View. Please wait...'
			});
			this.loading.present();
			this.http.post<MiniStatementRespInt>(url, parameter, httpOptions).subscribe(
				res1 => {
					this.loading.dismiss();
					console.log(res1);
					if(res1.status==0)
					{
						this.transactionslist = JSON.parse(res1.transactionList);
						console.log(this.transactionslist);
					}
					else
					{
						this.navCtrl.setRoot(AnalysisPage);
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
		this.token = null;
		loading.dismiss();
		this.navCtrl.setRoot(LoginPage);
		
	}

	
	payABill()
	{
		this.navCtrl.setRoot(BillPaymentPage);
	}
}
