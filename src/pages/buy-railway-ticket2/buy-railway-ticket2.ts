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

import { BuyRailwayTicket3Page } from '../buy-railway-ticket3/buy-railway-ticket3';
import { LoginPage } from '../login/login';
//import { LoadingProvider } from '../../providers/loading/loading';

/**
 * Generated class for the BuyRailwayTicket2Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
 
interface TrainListRespInt{
	status: any;
	outwardTripDetails: any;
	inwardTripDetails: any;
	message: any;
}


@IonicPage()
@Component({
  selector: 'page-buy-railway-ticket2',
  templateUrl: 'buy-railway-ticket2.html',
})
export class BuyRailwayTicket2Page {

	bookTrainData = { train: '', airline: '', trip_date: '', trip_type: '', return_date: '', adults: '', child: '', destination: '', source: '', train_from: '' };
	availabletrainlist: any;
	returntrainlist: any;
	step2title: any;
	token: any;
	loading: any;
	outwardTicketPrices: any;
	inwardTicketPrices: any;
	outwardSeatsAlloted: any;
	inwardSeatsAlloted: any;
	adults: any;
	child: any;
	seniors: any;
	disabled: any;
	seatDetails: any;
	months: any = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
	trip_types: any = [];
	preferred_outgoing_trip: any;
	preferred_incoming_trip: any;
	
	//, public camera: Camera, public filePath: FilePath,public loadingProvider: LoadingProvider, public file: File
	constructor(public platform: Platform, public storage: Storage, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public http: HttpClient, public actionSheetCtrl: ActionSheetController, public toastCtrl: ToastController, public afAuth: AngularFireAuth, public fb: FormBuilder, public navCtrl: NavController, public navParams: NavParams) {
		this.trip_types[0] = null;
		this.trip_types[1] = null;
		this.bookTrainData.train = navParams.get('train');
		this.bookTrainData.airline = navParams.get('airline');
		this.bookTrainData.trip_date = navParams.get('trip_date');
		this.bookTrainData.trip_type = navParams.get('trip_type');
		this.bookTrainData.return_date = navParams.get('return_date');
		this.bookTrainData.adults = navParams.get('adults');
		this.bookTrainData.child = navParams.get('child');
		this.bookTrainData.destination = navParams.get('destination');
		this.bookTrainData.source = navParams.get('source');
		this.availabletrainlist = navParams.get('availabletrainlist');
		console.log(this.availabletrainlist);
		this.availabletrainlist = JSON.parse(this.availabletrainlist);
		console.log(this.availabletrainlist);
		this.outwardTicketPrices = navParams.get('outwardTicketPrices');
		this.outwardTicketPrices = JSON.parse(this.outwardTicketPrices);
		this.outwardSeatsAlloted = navParams.get('outwardSeatsAlloted');
		this.outwardSeatsAlloted = JSON.parse(this.outwardSeatsAlloted);
		this.seatDetails = navParams.get('seatDetails');
		console.log(this.seatDetails);
		this.adults = navParams.get('adults');
		this.child = navParams.get('child');
		this.seniors = navParams.get('seniors');
		this.disabled = navParams.get('disabled');
		
		var alist = [];
		var count1 = 0;
		Object.keys(this.availabletrainlist).forEach(key=>{
			var k2 = this.availabletrainlist[key];
			if(count1 % 2==0)
			{
				k2.bgColor = '#E2F5D6';
				k2.tripCode = key;
			}
			var departureTime_ = k2.departureTime.split(' ');
			var departureDate = departureTime_[0].split('-');
			var departureTime = departureTime_[1].split(':');
			var ddate = new Date();
			ddate.setDate(parseInt(departureDate[2]));
			ddate.setMonth(parseInt(departureDate[1]) - 1);
			ddate.setFullYear(parseInt(departureDate[0]));
			ddate.setHours(parseInt(departureTime[0]));
			ddate.setMinutes(parseInt(departureDate[1]));
			departureTime = ddate.getDate() + " " + this.months[ddate.getMonth()] + ", " + ddate.getFullYear() + " " + (ddate.getHours()>9 ? ddate.getHours() : ("0"+ddate.getHours())) + ":" + (ddate.getMinutes()>9 ? ddate.getMinutes() : ("0"+ddate.getMinutes())) + "HRS";
			k2.formattedDepartureDate = departureTime;
			
			var arrivalTime_ = k2.arrivalTime.split(' ');
			var arrivalDate = arrivalTime_[0].split('-');
			var arrivalTime = arrivalTime_[1].split(':');
			ddate = new Date();
			ddate.setDate(parseInt(arrivalDate[2]));
			ddate.setMonth(parseInt(arrivalDate[1]) - 1);
			ddate.setFullYear(parseInt(arrivalDate[0]));
			ddate.setHours(parseInt(arrivalTime[0]));
			ddate.setMinutes(parseInt(arrivalTime[1]));
			arrivalTime = ddate.getDate() + " " + this.months[ddate.getMonth()] + ", " + ddate.getFullYear() + " " + (ddate.getHours()>9 ? ddate.getHours() : ("0"+ddate.getHours())) + ":" + (ddate.getMinutes()>9 ? ddate.getMinutes() : ("0"+ddate.getMinutes())) + "HRS";
			k2.formattedArrivalDate = arrivalTime;
			alist.push(k2);
			count1++;
		});
		this.availabletrainlist = alist;
		console.log(this.availabletrainlist);
		
		var outwardPrices = {};
		for(var priceIndex=0; priceIndex< this.outwardTicketPrices.length; priceIndex++)
		{
			var key = this.outwardTicketPrices[priceIndex].priceType;
			if(key=='FOR_ADULT_PRICE')
				outwardPrices['ADULT'] = this.outwardTicketPrices[priceIndex];
			if(key=='FOR_CHILD_PRICE')
				outwardPrices['CHILD'] = this.outwardTicketPrices[priceIndex];
			if(key=='FOR_SENIOR_CITIZENS')
				outwardPrices['SENIOR'] = this.outwardTicketPrices[priceIndex];
			if(key=='FOR_SPECIALLY_ABLED')
				outwardPrices['DISABLED'] = this.outwardTicketPrices[priceIndex];
		}
		this.outwardTicketPrices = outwardPrices;
		
		alist = [];
		var count2 = 0;
		this.returntrainlist = navParams.get('returntrainlist');
		console.log(this.returntrainlist);
		if(this.returntrainlist!=undefined && this.returntrainlist!=null)
		{
			this.returntrainlist = JSON.parse(this.returntrainlist);
			this.inwardTicketPrices = navParams.get('inwardTicketPrices');
			this.inwardTicketPrices = JSON.parse(this.inwardTicketPrices);
			this.inwardSeatsAlloted = navParams.get('inwardSeatsAlloted');
			this.inwardSeatsAlloted = JSON.parse(this.inwardSeatsAlloted);
			
			var inwardPrices = {};
			for(var priceIndex=0; priceIndex< this.inwardTicketPrices.length; priceIndex++)
			{
				var key = this.inwardTicketPrices[priceIndex].priceType;
				if(key=='FOR_ADULT_PRICE')
					inwardPrices['ADULT'] = this.inwardTicketPrices[priceIndex];
				if(key=='FOR_CHILD_PRICE')
					inwardPrices['CHILD'] = this.inwardTicketPrices[priceIndex];
				if(key=='FOR_SENIOR_CITIZENS')
					inwardPrices['SENIOR'] = this.inwardTicketPrices[priceIndex];
				if(key=='FOR_SPECIALLY_ABLED')
					inwardPrices['DISABLED'] = this.inwardTicketPrices[priceIndex];
			}
			this.inwardTicketPrices = inwardPrices;
			
			
			Object.keys(this.returntrainlist).forEach(key=>{
			
				var k2 = this.returntrainlist[key];
				if(count2 % 2==0)
				{
					k2.bgColor = '#E2F5D6';
					k2.tripCode = key;
				}
				var departureTime_ = k2.departureTime.split(' ');
				var departureDate = departureTime_[0].split('-');
				var departureTime = departureTime_[1].split(':');
				var ddate = new Date();
				ddate.setDate(parseInt(departureDate[2]));
				ddate.setMonth(parseInt(departureDate[1]) - 1);
				ddate.setFullYear(parseInt(departureDate[0]));
				ddate.setHours(parseInt(departureTime[0]));
				ddate.setMinutes(parseInt(departureDate[1]));
				departureTime = ddate.getDate() + " " + this.months[ddate.getMonth()] + ", " + ddate.getFullYear() + " " + (ddate.getHours()>9 ? ddate.getHours() : ("0"+ddate.getHours())) + ":" + (ddate.getMinutes()>9 ? ddate.getMinutes() : ("0"+ddate.getMinutes())) + "HRS";
				k2.formattedDepartureDate = departureTime;
				
				var arrivalTime_ = k2.arrivalTime.split(' ');
				var arrivalDate = arrivalTime_[0].split('-');
				var arrivalTime = arrivalTime_[1].split(':');
				ddate = new Date();
				ddate.setDate(parseInt(arrivalDate[2]));
				ddate.setMonth(parseInt(arrivalDate[1]) - 1);
				ddate.setFullYear(parseInt(arrivalDate[0]));
				ddate.setHours(parseInt(arrivalTime[0]));
				ddate.setMinutes(parseInt(arrivalTime[1]));
				arrivalTime = ddate.getDate() + " " + this.months[ddate.getMonth()] + ", " + ddate.getFullYear() + " " + (ddate.getHours()>9 ? ddate.getHours() : ("0"+ddate.getHours())) + ":" + (ddate.getMinutes()>9 ? ddate.getMinutes() : ("0"+ddate.getMinutes())) + "HRS";
				k2.formattedArrivalDate = arrivalTime;
				alist.push(k2);
				count2++;
			});
			this.returntrainlist = alist;
		}
		console.log(this.returntrainlist);
		
		if(this.bookTrainData.return_date!=null)
		{
			this.step2title = 'Step 2/3 - Select Trip';
		}
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad BuyRailwayTicket2Page');
	}
	
	goToSelectTrain(availabletrain, triptype)
	{
		console.log(availabletrain);
		this.trip_types[triptype] = availabletrain;
		if(triptype==0)
		{
			this.preferred_outgoing_trip = availabletrain;
		}
		
		if(triptype==1)
		{
			this.preferred_incoming_trip = availabletrain;
		}
		
		var proceed = false;
		if(this.bookTrainData.trip_type=='return')
		{
			if(this.preferred_outgoing_trip!=null && this.preferred_incoming_trip!=null)
			{
				console.log("Both out and in trip selected");
				proceed = true;
			}
		}
		else if(this.bookTrainData.trip_type=='one-way')
		{
			if(this.preferred_outgoing_trip!=null)
			{
				console.log("out trip selected");
				proceed = true;
			}
		}
		
		if(proceed == true)
		{
			this.storage.get('zambia_bank_customer_token').then((val) => {
				this.token = val;
				
				let header = new HttpHeaders();
				header = header.set('Content-Type', 'application/x-www-form-urlencoded');
				header = header.set('Accept-Language', 'en-US,en;q=0.5');
				/*header = header.set('ticket_purchase_token', tripToken)*/
				
				const httpOptions = {headers: header};
				
				var form_params = "";
				var parameter = {};
				
				var outwardFormParam = {};
				outwardFormParam['tripCode'] = this.preferred_outgoing_trip.tripCode;
				outwardFormParam['departingStationCode'] = this.preferred_outgoing_trip.originStationCode;
				outwardFormParam['arrivalStationCode'] = this.preferred_outgoing_trip.arrivalStationCode;
				outwardFormParam['seatDetails'] = this.seatDetails;
				outwardFormParam['clientCode'] = 96;
				outwardFormParam['forcePreferences'] = 'false';
				outwardFormParam['generalTripClass'] = this.bookTrainData.train.split("###")[2];
				if(this.bookTrainData.trip_type=='return')
				{
					var inwardFormParam = {};
					inwardFormParam['tripCode'] = this.preferred_incoming_trip.tripCode;
					inwardFormParam['departingStationCode'] = this.preferred_incoming_trip.originStationCode;
					inwardFormParam['arrivalStationCode'] = this.preferred_incoming_trip.arrivalStationCode;
					inwardFormParam['seatDetails'] = this.seatDetails;
					inwardFormParam['clientCode'] = 96;
					inwardFormParam['forcePreferences'] = 'false';
					inwardFormParam['generalTripClass'] = this.bookTrainData.train.split("###")[2];
					
					form_params = form_params + "inwardTrip=" + encodeURI(JSON.stringify(inwardFormParam));
					form_params = form_params + "&";
				}
				
				form_params = form_params + "outwardTrip=" + encodeURI(JSON.stringify(outwardFormParam));	
				form_params = form_params + "&lockdownSeats=" + 'true';
				form_params = form_params + "&clientCode=" + 96;
				form_params = form_params + "&deviceCode=" + 4059730729;
				
				parameter = form_params;
				console.log(parameter);
				let url = "http://localhost:8080/ReservationTicketingWebService/NCE/services/VehicleServices/getTripSeatAndLockDown";
				
				this.loading = this.loadingCtrl.create({
					content: 'Please wait...'
				});
				this.loading.present();
				this.http.post<TrainListRespInt>(url, parameter, httpOptions).subscribe(
					res => {
						let status: any = null;
						status = res.status;
						console.log(res);
						console.log(status);
						this.loading.dismiss();
						if(res.status==0)
						{
							var outwardTripDetails = JSON.parse(res.outwardTripDetails);
							var tripCode = outwardTripDetails.tripCode;
							var adultPassenger = outwardTripDetails.adultPassenger;
							var childPassenger = outwardTripDetails.childPassenger;
							var seniorPassenger = outwardTripDetails.seniorPassenger;
							var disabledPassenger = outwardTripDetails.disabledPassenger;
							var tripBookingToken = outwardTripDetails.tripBookingToken;
							var details = JSON.parse(outwardTripDetails.details);
							var tripDetails = details.tripDetails;
							var tripDetailsArray = JSON.parse(tripDetails);
							var seatsAlloted = details.seatsAlloted;
							var baseAdultFare = outwardTripDetails.baseAdultFare;
							var baseChildFare = outwardTripDetails.baseChildFare;
							var baseSeniorFare = outwardTripDetails.baseSeniorFare;
							var baseDisabledFare = outwardTripDetails.baseDisabledFare;
							
							//OUTWARDTRIP
							var cart = {};
							var trip = {};
							var trip_ = {};
							trip['tripDetails'] = tripDetails;
							trip['seatsAlloted'] = seatsAlloted;
							trip['adultPassenger'] = adultPassenger;
							trip['childPassenger'] = childPassenger;
							trip['seniorPassenger'] = seniorPassenger;
							trip['disabledPassenger'] = disabledPassenger;
							trip['departingFrom'] = tripDetailsArray[0]['originStation'];
							trip['arrivingAt'] = tripDetailsArray[(tripDetailsArray.length - 1)]['arrivalStation'];
							trip['departingStation'] = tripDetailsArray[0]['originStationCode'];
							trip['arrivingStation'] = tripDetailsArray[(tripDetailsArray.length - 1)]['arrivalStationCode'];
							trip['baseAdultFare'] = baseAdultFare;
							trip['baseChildFare'] = baseChildFare;
							trip['baseSeniorFare'] = baseSeniorFare;
							trip['baseDisabledFare'] = baseDisabledFare;
							trip['tripType'] = this.bookTrainData.train.split("###")[2];
							trip_[tripCode] = trip;
							cart['outwardTrip'] = trip_;
							
							if(this.bookTrainData.trip_type=='return')
							{
								var inwardTripDetails = JSON.parse(res.inwardTripDetails);
								tripCode = inwardTripDetails.tripCode;
								adultPassenger = inwardTripDetails.adultPassenger;
								childPassenger = inwardTripDetails.childPassenger;
								seniorPassenger = inwardTripDetails.seniorPassenger;
								disabledPassenger = inwardTripDetails.disabledPassenger;
								tripBookingToken = inwardTripDetails.tripBookingToken;
								var detailsInward = JSON.parse(inwardTripDetails.details);
								var returnTripDetails = detailsInward.tripDetails;
								var returnTripDetailsArray = JSON.parse(returnTripDetails);
								seatsAlloted = detailsInward.seatsAlloted;
								baseAdultFare = inwardTripDetails.baseAdultFare;
								baseChildFare = inwardTripDetails.baseChildFare;
								baseSeniorFare = inwardTripDetails.baseSeniorFare;
								baseDisabledFare = inwardTripDetails.baseDisabledFare;
								
								trip = [];
								trip_ = [];
								trip['tripDetails'] = returnTripDetails;
								trip['seatsAlloted'] = seatsAlloted;
								trip['adultPassenger'] = adultPassenger;
								trip['childPassenger'] = childPassenger;
								trip['seniorPassenger'] = seniorPassenger;
								trip['disabledPassenger'] = disabledPassenger;
								trip['departingFrom'] = returnTripDetailsArray[0]['originStation'];
								trip['arrivingAt'] = returnTripDetailsArray[(returnTripDetailsArray.length - 1)]['arrivalStation'];
								trip['departingStation'] = returnTripDetailsArray[0]['originStationCode'];
								trip['arrivingStation'] = returnTripDetailsArray[(returnTripDetailsArray.length - 1)]['arrivalStationCode'];
								trip['baseAdultFare'] = baseAdultFare;
								trip['baseChildFare'] = baseChildFare;
								trip['baseSeniorFare'] = baseSeniorFare;
								trip['baseDisabledFare'] = baseDisabledFare;
								trip['tripType'] = this.bookTrainData.train.split("###")[2];
								trip_[tripCode] = trip;
								cart['inwardTrip'] = trip_;
							}
							this.navCtrl.push(BuyRailwayTicket3Page, {train:this.bookTrainData.train, trip_date:this.bookTrainData.trip_date, return_date:this.bookTrainData.return_date, 
								adults:this.adults, child:this.child, seniors:this.seniors, disabled:this.disabled, destination:this.bookTrainData.destination, cart:cart,
								source:this.bookTrainData.source, preferred_outgoing_trip:this.preferred_outgoing_trip, preferred_incoming_trip:this.preferred_incoming_trip, 
								tripBookingToken: tripBookingToken
							});
						}
						else
						{
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
