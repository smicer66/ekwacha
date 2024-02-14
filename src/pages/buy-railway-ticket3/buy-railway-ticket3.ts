import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ActionSheetController, Platform, AlertController, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Storage } from "@ionic/storage";
import 'rxjs/add/operator/take';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as CryptoJS from 'crypto-js';

/*import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';*/

import { AngularFireAuth } from 'angularfire2/auth';

import { BillPaymentPage } from '../bill-payment/bill-payment';
import { LoginPage } from '../login/login';
//import { LoadingProvider } from '../../providers/loading/loading';


interface TrainListRespInt{
	status: any;
	list: any;
	sourcelist: any;
	response_msg: any;
	token: any;
	message: any;
}

/**
 * Generated class for the BuyRailwayTicket3Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-buy-railway-ticket3',
  templateUrl: 'buy-railway-ticket3.html',
})
export class BuyRailwayTicket3Page {
	bookTrainData3 = { firstName: '', otherName: '', lastName: '', nationalId: '', mobileNumber: '', emailAddress: '', pin1: '', pin2: '', pin3: '', pin4: '' };
	preferred_outgoing_trip: any;
	preferred_incoming_trip: any;
	step2title: any;
	tripClass: any;
	trip_date: any;
	return_date: any;
	adults: any;
	child: any;
	seniors: any;
	disabled: any;
	destination: any;
	source: any;
	cart: any;
	
	token: any;
	buyRailwayTicketForm3 : FormGroup;
	firstName: AbstractControl;
	lastName: AbstractControl;
	otherName: AbstractControl;
	nationalId: AbstractControl;
	mobileNumber: AbstractControl;
	emailAddress: AbstractControl;
	pin1: AbstractControl;
	pin2: AbstractControl;
	pin3: AbstractControl;
	pin4: AbstractControl;
	loading: any;
	tripBookingToken: any;
	
	//, public camera: Camera, public file: File, public filePath: FilePath,public loadingProvider: LoadingProvider
	constructor(public platform: Platform, public storage: Storage, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public http: HttpClient, public actionSheetCtrl: ActionSheetController, public toastCtrl: ToastController, public afAuth: AngularFireAuth, public fb: FormBuilder, public navCtrl: NavController, public navParams: NavParams) {
		this.tripClass = navParams.get('train');
		this.trip_date = navParams.get('trip_date');
		this.return_date = navParams.get('return_date');
		this.adults = navParams.get('adults');
		this.child = navParams.get('child');
		this.seniors = navParams.get('seniors');
		this.disabled = navParams.get('disabled');
		this.destination = navParams.get('destination');
		this.source = navParams.get('source');
		this.preferred_outgoing_trip = navParams.get('preferred_outgoing_trip');
		this.preferred_incoming_trip = navParams.get('preferred_incoming_trip');
		this.tripBookingToken = navParams.get('tripBookingToken');
		this.cart = navParams.get('cart');
		
		console.log(this.preferred_outgoing_trip);
		this.buyRailwayTicketForm3 = this.fb.group({
			'firstName' : [null, Validators.compose([Validators.required])],
			'lastName' : [null, Validators.compose([Validators.required])],
			'otherName' : [null],
			'nationalId' : [null, Validators.compose([Validators.required])],
			'mobileNumber' : [null, Validators.compose([Validators.required])],
			'emailAddress' : [null, Validators.compose([Validators.required])],
			'pin1' : [null, Validators.compose([Validators.required])],
			'pin2' : [null, Validators.compose([Validators.required])],
			'pin3' : [null, Validators.compose([Validators.required])],
			'pin4' : [null, Validators.compose([Validators.required])]
		});
		console.log('1');
        this.firstName = this.buyRailwayTicketForm3.controls['firstName'];
		this.lastName = this.buyRailwayTicketForm3.controls['lastName'];
		this.otherName = this.buyRailwayTicketForm3.controls['otherName'];
        this.nationalId = this.buyRailwayTicketForm3.controls['nationalId'];
		this.mobileNumber = this.buyRailwayTicketForm3.controls['mobileNumber'];
		this.emailAddress = this.buyRailwayTicketForm3.controls['emailAddress'];
        this.pin1 = this.buyRailwayTicketForm3.controls['pin1'];
		this.pin2 = this.buyRailwayTicketForm3.controls['pin2'];
		this.pin3 = this.buyRailwayTicketForm3.controls['pin3'];
		this.pin4 = this.buyRailwayTicketForm3.controls['pin4'];
		
		let alertStr = '<strong>' + this.source + ' to ' + this.destination + '<br>';
		alertStr = alertStr + '<strong>Passengers: ' + (this.adults + this.child + this.seniors + this.disabled) + '<br>';
		alertStr = alertStr + '<strong>Departs: ' + this.trip_date + '<br>';
		if(this.preferred_incoming_trip!=null)
		{
			alertStr = alertStr + '<strong>Return Date: ' + this.return_date + '<br>';
			alertStr = alertStr + '<strong>Total Fare: K' + (this.preferred_outgoing_trip.amount + this.preferred_incoming_trip.amount) + '<br>';
			alertStr = alertStr + '<hr><br>';
			alertStr = alertStr + 'Total Fare: K' + (parseFloat(this.preferred_outgoing_trip.amount) + parseFloat(this.preferred_incoming_trip.amount)) + '<br>';
		}
		else
		{
			alertStr = alertStr + '<strong>Total Fare: K' + (this.preferred_outgoing_trip.amount) + '<br>';
			alertStr = alertStr + '<hr><br>';
			alertStr = alertStr + 'Total Fare: K' + (parseFloat(this.preferred_outgoing_trip.amount)) + '<br>';
		}
		
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad BuyTrain3Page');
	}
	
	
	purchaseTrainTrip(bookTrainData3)
	{
		console.log(bookTrainData3);
		if(this.return_date!=null)
		{
			this.storage.get('zambia_bank_customer_token').then((val) => {
				this.token = val;
				
				
				let header = new HttpHeaders();
				header = header.set('Content-Type', 'application/x-www-form-urlencoded');
				header = header.set('Accept-Language', 'en-US,en;q=0.5');
				
				const httpOptions = {headers: header};
				
				var form_params = "";
				var parameter = {};
				
				form_params = form_params + "username=" + encodeURI("venice@vantak.com");	
				form_params = form_params + "&encPassword=" + encodeURI("mAGpYqEx");
				form_params = form_params + "&clientCode=" + encodeURI("96");
				form_params = form_params + "&roleCode=" + encodeURI("VENDOR");
				
				parameter = form_params;
				console.log(parameter);
				let url = "http://localhost:8080/EKwachaWebService/NCE/services/AuthenticationServices/authenticateTrainVendorUser";
				
				this.loading = this.loadingCtrl.create({
					content: 'Please wait...'
				});
				this.loading.present();
				this.http.post<TrainListRespInt>(url, parameter, httpOptions).subscribe(
					res => {
						this.loading.dismiss();
						let status: any = null;
						status = res.status;
						console.log(res);
						console.log(status);
						if(res.status==0 && res.token)
						{
							let header = new HttpHeaders();
							header = header.set('Content-Type', 'application/x-www-form-urlencoded');
							header = header.set('Accept-Language', 'en-US,en;q=0.5');
							header = header.set('auth_token', res.token);
							header = header.set('ticket_purchase_token', this.tripBookingToken);
							
							
							const httpOptions = {headers: header};
							var form_params = "";
							var clientCode = '96';
							var zrlServerDeviceCode = '4059730729';
							var webActivationCode = 'vx5rcVXWkMC5dDqlExcJud5oSGiHrfKL';
							var orderId = Math.random().toString(36).substring(2, 15).toUpperCase() + Math.random().toString(36).substring(2, 15).toUpperCase();
							var outwardAmount = 0.00;
							var inwardAmount = 0.00;
							outwardAmount = outwardAmount + 
								(this.cart['outwardTrip'][this.preferred_outgoing_trip.tripCode]['baseAdultFare'] * this.cart['outwardTrip'][this.preferred_outgoing_trip.tripCode]['adultPassenger']) + 
								(this.cart['outwardTrip'][this.preferred_outgoing_trip.tripCode]['baseChildFare'] * this.cart['outwardTrip'][this.preferred_outgoing_trip.tripCode]['childPassenger']) + 
								(this.cart['outwardTrip'][this.preferred_outgoing_trip.tripCode]['baseSeniorFare'] * this.cart['outwardTrip'][this.preferred_outgoing_trip.tripCode]['seniorPassenger']) + 
								(this.cart['outwardTrip'][this.preferred_outgoing_trip.tripCode]['baseDisabledFare'] * this.cart['outwardTrip'][this.preferred_outgoing_trip.tripCode]['disabledPassenger']); 
								
							if(this.preferred_incoming_trip!=undefined && this.preferred_incoming_trip!=null && this.cart!=undefined && this.cart!=null && this.cart['outwardTrip']!=null && this.cart['outwardTrip']!=undefined)
							{
								inwardAmount = inwardAmount + 
									(this.cart['outwardTrip'][this.preferred_outgoing_trip.tripCode]['baseAdultFare'] * this.cart['outwardTrip'][this.preferred_outgoing_trip.tripCode]['adultPassenger']) + 
									(this.cart['outwardTrip'][this.preferred_outgoing_trip.tripCode]['baseChildFare'] * this.cart['outwardTrip'][this.preferred_outgoing_trip.tripCode]['childPassenger']) + 
									(this.cart['outwardTrip'][this.preferred_outgoing_trip.tripCode]['baseSeniorFare'] * this.cart['outwardTrip'][this.preferred_outgoing_trip.tripCode]['seniorPassenger']) + 
									(this.cart['outwardTrip'][this.preferred_outgoing_trip.tripCode]['baseDisabledFare'] * this.cart['outwardTrip'][this.preferred_outgoing_trip.tripCode]['disabledPassenger']); 
							}
							var amount = outwardAmount + inwardAmount;
							console.log(amount);
							var amount_ = (amount.toFixed(2)) + '';
							var hash = clientCode + '' + zrlServerDeviceCode + '' + orderId + '' + '' + amount_ + '' + webActivationCode;
							console.log(hash);
							hash = CryptoJS.HmacSHA512(hash, 'Yn7sWDar7yPZZh7xvHFpnRWRNcj1l8Rf').toString();
							console.log(hash);  
							var purchaseDetails = {};
							var formData = {};
							var outwardTrip = {};
							var inwardTrip = {};
							var singleOutwardTrip = {};
							var passengerdetails = {};
							var leadPassenger = {};
							leadPassenger['firstname'] = this.bookTrainData3.firstName;
							leadPassenger['lastname'] = this.bookTrainData3.lastName;
							leadPassenger['othername'] = this.bookTrainData3.otherName;
							leadPassenger['emailaddress'] = this.bookTrainData3.emailAddress;
							leadPassenger['mobilenumber'] = this.bookTrainData3.mobileNumber;
							leadPassenger['nationalid'] = this.bookTrainData3.nationalId;
							passengerdetails['leadPassenger'] = leadPassenger;
							var seatsAlloted = {};
							seatsAlloted = this.cart['outwardTrip'][this.preferred_outgoing_trip.tripCode]['seatsAlloted'];
							singleOutwardTrip['tripCode'] = this.preferred_outgoing_trip.tripCode;
							singleOutwardTrip['arrivalTime'] = this.preferred_outgoing_trip.arrivalTime;
							singleOutwardTrip['departureTime'] = this.preferred_outgoing_trip.departureTime;
							singleOutwardTrip['arrivingStation'] = this.preferred_outgoing_trip.arrivalStationCode;
							singleOutwardTrip['departingStation'] = this.preferred_outgoing_trip.originStationCode;
							singleOutwardTrip['arrivingAt'] = this.preferred_outgoing_trip.tripCode;
							singleOutwardTrip['departingFrom'] = this.preferred_outgoing_trip.originStation;
							singleOutwardTrip['disabledPassenger'] = this.disabled;
							singleOutwardTrip['seniorPassenger'] = this.seniors;
							singleOutwardTrip['childPassenger'] = this.child;
							singleOutwardTrip['adultPassenger'] = this.adults;
							singleOutwardTrip['passengerdetails'] = passengerdetails;
							singleOutwardTrip['seatsAlloted'] = seatsAlloted;
							
							outwardTrip[this.preferred_outgoing_trip.tripCode] = singleOutwardTrip;
							formData['outwardTrip'] = outwardTrip;
							if(this.preferred_incoming_trip!=undefined && this.preferred_incoming_trip!=null && this.cart!=undefined && this.cart!=null && this.cart['outwardTrip']!=null && this.cart['outwardTrip']!=undefined)
							{
								formData['inwardTrip'] = inwardTrip;
							}
							
							purchaseDetails['tripTicketData'] = formData;
							purchaseDetails['hash'] = hash;
							purchaseDetails['orderId'] = orderId;
							console.log(purchaseDetails);
							console.log(this.tripClass);
							
							form_params = form_params + "paymentType=" + encodeURI("VENDOR_WALLET");	
							form_params = form_params + "&deviceCode=" + '4059730729';
							form_params = form_params + "&ticketCollectionCenterCode=" + '13950509';
							form_params = form_params + "&purchaseDetails=" + encodeURI(JSON.stringify(purchaseDetails));
							form_params = form_params + "&generalTripClass=" + (this.tripClass.split('###')[2]);
							form_params = form_params + "&clientCode=" + '96';
							form_params = form_params + "&transactionRef=" + (Math.random().toString(36).substring(2, 4).toUpperCase() + Math.random().toString(36).substring(2, 4).toUpperCase());
							form_params = form_params + "&purchasePoint=" + 'WEB';
							
							var parameter = form_params;
							/* JSON.stringify({train:this.tripClass, source:this.source, destination:this.destination, 
								trip_date:this.trip_date, return_date:this.return_date, preferred_train:this.preferred_outgoing_trip.id, 
								preferred_train_code:this.preferred_outgoing_trip.train_code, preferred_return_train:this.preferred_incoming_trip!=undefined? this.preferred_incoming_trip.id : null, 
								preferred_return_train_code:this.preferred_incoming_trip!=undefined ? this.preferred_incoming_trip.train_code : null, first_name:this.bookTrainData3.firstName, last_name:this.bookTrainData3.lastName, 
								other_name:this.bookTrainData3.otherName, national_id_number:this.bookTrainData3.nationalId, mobile_number:this.bookTrainData3.mobileNumber, 
								email_address:this.bookTrainData3.emailAddress, pin:(this.bookTrainData3.pin1 + '' + this.bookTrainData3.pin2 + '' + this.bookTrainData3.pin3 + '' + this.bookTrainData3.pin4), 
								adults:this.adults, child:this.child, seniors:this.seniors, disabled:this.disabled });*/
							console.log(parameter);
								
							let url = "http://localhost:8080/ReservationTicketingWebService/NCE/services/VehicleServices/purchaseVehicleTripTickets";
							
							this.loading = this.loadingCtrl.create({
								content: 'Please wait...'
							});
							this.loading.present();
							this.http.post<TrainListRespInt>(url, parameter, httpOptions).subscribe(
								res1 => {
									console.log(res1);
									this.loading.dismiss();
									if(res1.status==0)
									{
										this.navCtrl.setRoot(BillPaymentPage, {message: res1.message});
									}
									else
									{
										this.presentToast({message: res1.message});
									}
								},
								err => {
									this.loading.dismiss();
									console.log('Error occured');
								}
							);
						}
						else
						{
							this.presentToast({message: 'Ticket purchase was not successful. Please try again'});
						}
					},
					err => {
						this.loading.dismiss();
						console.log('Error occured');
					}
				);
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
	
	
	presentToast(err) {
		const toast = this.toastCtrl.create({
			message: err.message,
			duration: 3000,
			position: 'bottom'
		});

		toast.present();
	}

}

