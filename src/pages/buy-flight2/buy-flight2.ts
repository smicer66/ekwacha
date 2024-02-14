import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ActionSheetController, Platform, AlertController, LoadingController } from 'ionic-angular';
import { FormBuilder } from '@angular/forms';
import { Storage } from "@ionic/storage";
import 'rxjs/add/operator/take';
import { HttpClient, HttpHeaders } from '@angular/common/http';

/*import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';*/

import { AngularFireAuth } from 'angularfire2/auth';

import { BuyFlight3Page } from '../buy-flight3/buy-flight3';
import { BillPaymentPage } from '../bill-payment/bill-payment';
import { LoginPage } from '../login/login';
//import { LoadingProvider } from '../../providers/loading/loading';

/**
 * Generated class for the BuyFlight2Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

interface AirlineListRespInt{
	status: any;
	list: any;
	response_msg: any;
	sourcelist: any;
}


@IonicPage()
@Component({
  selector: 'page-buy-flight2',
  templateUrl: 'buy-flight2.html',
})
export class BuyFlight2Page {

	bookFlightData = { airline: '', trip_date: '', return_date: '', adults: '', trip_type:'', child: '', destination: '', source: '', flight_from: '' };
	availableflightlist: any;
	step2title: any;
	loading: any;
	
	token: any;
	//, public file: File, public filePath: FilePath, ,public loadingProvider: LoadingProvider, public camera: Camera
	constructor(public platform: Platform, public loadingCtrl: LoadingController, public storage: Storage, public alertCtrl: AlertController, public http: HttpClient, public actionSheetCtrl: ActionSheetController, public toastCtrl: ToastController, public afAuth: AngularFireAuth, public fb: FormBuilder, public navCtrl: NavController, public navParams: NavParams) {
		//this.bookFlightData.account = navParams.get('account');
		this.bookFlightData.airline = navParams.get('airline');
		this.bookFlightData.trip_date = navParams.get('trip_date');
		this.bookFlightData.return_date = navParams.get('return_date');
		this.bookFlightData.trip_type = navParams.get('trip_type'); 
		this.bookFlightData.adults = navParams.get('adults');
		this.bookFlightData.child = navParams.get('child');
		this.bookFlightData.destination = navParams.get('destination');
		this.bookFlightData.source = navParams.get('source');
		this.availableflightlist = navParams.get('availableflightlist');
		
		if(this.bookFlightData.return_date!=null)
		{
			this.step2title = 'Step 2/3 - Select Flight';
		}
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad BuyFlight2Page');
	}
	
	goToSelectFlight(availableflight)
	{
		console.log(availableflight);
		if(this.bookFlightData.return_date!=null)
		{
			this.storage.get('zambia_bank_customer_token').then((val) => {
				this.token = val;
				
				let header = new HttpHeaders();
				header = header.set('Content-Type', 'application/json; charset=utf-8');
				header = header.set('Accept', 'application/json');
				
				const httpOptions = {headers: header};
				var parameter = JSON.stringify({airline:this.bookFlightData.airline, source:this.bookFlightData.source, destination:this.bookFlightData.destination, 
					trip_date:this.bookFlightData.trip_date, return_date:this.bookFlightData.return_date, preferred_flight:availableflight.id, 
					preferred_flight_code:availableflight.flight_code});
				console.log(parameter);
				this.loading = this.loadingCtrl.create({
					content: 'Please wait...'
				});
				this.loading.present();
				let url = "http://bankmobileapp.syncstatenigeria.com/api/v1/get-return-flights";
				
				console.log(this.bookFlightData.trip_type);
				if(this.bookFlightData.trip_type=='return')
				{
					this.http.post<AirlineListRespInt>(url, parameter, httpOptions).subscribe(
						res => {
							let status: any = null;
							status = res.status;
							console.log(res);
							console.log(status);
							if(res.status==1)
							{
								this.loading.dismiss();
								this.availableflightlist = res.list;
								this.navCtrl.push(BuyFlight3Page, {airline:this.bookFlightData.airline, source:this.bookFlightData.source, destination:this.bookFlightData.destination, 
									trip_date:this.bookFlightData.trip_date, trip_type:this.bookFlightData.trip_type, return_date:this.bookFlightData.return_date, availableflightlist:this.availableflightlist, 
									adults:this.bookFlightData.adults, child:this.bookFlightData.child, preferred_flight:availableflight});
							}
							else
							{
								this.loading.dismiss();
								let alert = this.alertCtrl.create({
									title: 'Login Response',
									message: "Logging In Failed. Ensure you provide your valid passenger login details",
									buttons: ['OK']
								});
								alert.present();
							}
						},
						err => {
							this.loading.dismiss();
						  console.log('Error occured');
						}
					);
				}
				else if(this.bookFlightData.trip_type=='one-way')
				{
					this.storage.get('zambia_bank_customer_token').then((val) => {
						this.token = val;
						let alertStr = "<strong style='color:#000 !important;'>Departs:</strong> " + this.bookFlightData.source + "<br><strong style='color:#000 !important;'>Arrives:</strong> " + this.bookFlightData.destination + "<br>";
						alertStr = alertStr + "<strong style='color:#000 !important;'>Passengers:</strong> " + this.bookFlightData.adults + this.bookFlightData.child + "<br>";
						alertStr = alertStr + "<strong style='color:#000 !important;'>Flight Date:</strong> " + this.bookFlightData.trip_date + "<br>";
						alertStr = alertStr + "<strong style='color:#000 !important;'>Fare Fee:</strong> K" + availableflight.amount + "<br>";
						alertStr = alertStr + "<hr><br>";
						alertStr = alertStr + "<strong style='color:#000 !important;'>Total Fare:</strong> K" + (parseFloat(availableflight.amount)) + "<br>";
						
						
						
						
						let alert = this.alertCtrl.create({
							title: 'Confirm Flight',
							message: (alertStr),
							inputs: [
								{
									name: 'first_name',
									placeholder: 'Lead Passengers First Name',
									type: 'text'
								},
								{
									name: 'last_name',
									placeholder: 'Lead Passengers Last Name',
									type: 'text'
								},
								{
									name: 'other_name',
									placeholder: 'Lead Passengers Other Name',
									type: 'text'
								},
								{
									name: 'national_id_number',
									placeholder: 'Lead Passengers National Id',
									type: 'text'
								},
								{
									name: 'mobile_number',
									placeholder: 'Passengers Mobile Number',
									type: 'text'
								},
								{
									name: 'email_address',
									placeholder: 'Passengers Email Address',
									type: 'text'
								},
								{
									name: 'pin',
									placeholder: 'Enter Your 4-digit Pin',
									type: 'password'
								}
							],
							buttons: [{
									text: 'Confirm Payment',
									role: 'ok',
									handler: data => {
										console.log('confirm payment');
										let header = new HttpHeaders();
										header = header.set('Content-Type', 'application/json; charset=utf-8');
										header = header.set('Accept', 'application/json');
										header = header.set('Authorization', 'Bearer ' + this.token);
										
										
										const httpOptions = {headers: header};
										var parameter = JSON.stringify({airline:this.bookFlightData.airline, source:this.bookFlightData.source, destination:this.bookFlightData.destination, 
											trip_date:this.bookFlightData.trip_date, preferred_flight:availableflight.id, preferred_flight_code:availableflight.flight_code, 
											first_name:data.first_name, last_name:data.last_name, other_name:data.other_name, national_id_number:data.national_id_number, mobile_number:data.mobile_number, 
											email_address:data.email_address, pin:data.pin, adults:this.bookFlightData.adults, child:this.bookFlightData.child });
										console.log([parameter]);
											
										let url = "http://bankmobileapp.syncstatenigeria.com/api/v1/billing/pay-for-flight";
										
										this.loading = this.loadingCtrl.create({
											content: 'Please wait...'
										});
										this.loading.present();
										this.http.post<AirlineListRespInt>(url, parameter, httpOptions).subscribe(
											res1 => {
												console.log(res1);
												this.loading.dismiss();
												if(res1.status==1)
												{
													
													let alert1 = this.alertCtrl.create({
														title: 'Flight Ticket Purchase',
														subTitle: res1.response_msg,
														buttons: [{
															text: 'Ok',
															role: 'ok',
															handler: () => {
																console.log('Valid 1');
																this.navCtrl.setRoot(BillPaymentPage);
															}
														}]
													});
													alert1.present();
												}
												else
												{
													let alert1 = this.alertCtrl.create({
														title: 'Flight Ticket Purchase',
														subTitle: res1.response_msg,
														buttons: ['Dismiss']
													});
													alert1.present();
												}
											},
											err => {
												this.loading.dismiss();
											  console.log('Error occured');
											}
										);
										//this.navCtrl.setRoot(BillPaymentPage);
									}
								}
							]
						});
						alert.present();
					});
				}
			});
		}
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

}
