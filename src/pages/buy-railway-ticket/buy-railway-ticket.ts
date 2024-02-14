import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ActionSheetController, Platform, AlertController, LoadingController  } from 'ionic-angular';
import { FormBuilder, FormGroup, AbstractControl, Validators } from '@angular/forms';
import { Storage } from "@ionic/storage";
import 'rxjs/add/operator/take';
import { HttpClient, HttpHeaders } from '@angular/common/http';

/*import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';*/

import { AngularFireAuth } from 'angularfire2/auth';

import { BuyRailwayTicket2Page } from '../buy-railway-ticket2/buy-railway-ticket2';
import { LoginPage } from '../login/login';
//import { LoadingProvider } from '../../providers/loading/loading';


interface TrainListRespInt{
	status: any;
	outwardTripSeatsAvailabilityStatus: any;
	inwardTripSeatsAvailabilityStatus: any;
	message: any;
	outwardVehicleTripList: any;
	inwardVehicleTripList: any;
	outwardTicketPrices: any;
	outwardSeatsAlloted: any;
	inwardTicketPrices: any;
	inwardSeatsAlloted: any;
}

interface ClientSystemDetails{
	bookingFee: any;
	costPerKg: any;
	courierServiceList: any;
	districtList: any;
	message: any;
	priceTypes: any;
	productCategoryList: any;
	productCoefficientList: any;
	returnTripAvailable: any;
	serviceType: any;
	stations: any;
	status: any;
	tripZoneList: any;
	vehicleList: any;
	vehicleSeatClasses: any;
	vehicleSeatSections: any;
}

/**
 * Generated class for the BuyRailwayTicketPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-buy-railway-ticket',
  templateUrl: 'buy-railway-ticket.html',
})
export class BuyRailwayTicketPage {

	buyRailwayTicketData = { train: '', trip_date: '', return_date: '', trip_type: '', adults: 0, child: 0, disabled: 0, seniors: 0, destination: '', source: ''  };
	buyRailwayTicketForm : FormGroup;
	train: AbstractControl;
	trip_date: AbstractControl;
	return_date: AbstractControl;
	adults: AbstractControl;
	child: AbstractControl;
	destination: AbstractControl;
	trip_type: AbstractControl;
	source: AbstractControl;
	
	trainlist: any;
	sourcelist: any;
	destinationlist: any;
	availabletrainlist: any;
	accountlist: any;
	returntrainlist: any;
	outwardTicketPrices: any;
	outwardSeatsAlloted: any;
	inwardTicketPrices: any;
	inwardSeatsAlloted: any;
	
	loading: any;
	
	token: any;
	//, public filePath: FilePath, public camera: Camera, public file: File,public loadingProvider: LoadingProvider
	constructor(public platform: Platform, public storage: Storage, public alertCtrl: AlertController, public loadingCtrl: LoadingController, public http: HttpClient, public actionSheetCtrl: ActionSheetController, public toastCtrl: ToastController, public afAuth: AngularFireAuth, public fb: FormBuilder, public navCtrl: NavController, public navParams: NavParams) {
		this.buyRailwayTicketForm = this.fb.group({
			'train' : [null, Validators.compose([Validators.required])],
			'trip_date': [null, Validators.compose([Validators.required])],
			'return_date': [null, Validators.compose([Validators.required])],
			'adults': [null, Validators.compose([])],
			'child': [null, Validators.compose([Validators.required])],
			'trip_type': [null, Validators.compose([Validators.required])],
			'destination': [null, Validators.compose([Validators.required])],
			'source': [null, Validators.compose([Validators.required])]
		});

        this.train = this.buyRailwayTicketForm.controls['train'];
        this.trip_date = this.buyRailwayTicketForm.controls['trip_date'];
        this.return_date = this.buyRailwayTicketForm.controls['return_date'];
        this.adults = this.buyRailwayTicketForm.controls['adults'];
        this.child = this.buyRailwayTicketForm.controls['child'];
        this.trip_type = this.buyRailwayTicketForm.controls['trip_type'];
        this.destination = this.buyRailwayTicketForm.controls['destination'];
        this.source = this.buyRailwayTicketForm.controls['source'];
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad buyRailwayTicketPage');
		this.storage.get('zambia_bank_customer_accounts').then((val) => {
			console.log(val);
			this.accountlist = JSON.parse(val);
			let header = new HttpHeaders();
			header = header.set('Content-Type', 'application/json; charset=utf-8');
			header = header.set('Accept', 'application/json');
			
			//const httpOptions = {headers: header};
			//var parameter = JSON.stringify({});
			this.loading = this.loadingCtrl.create({
				content: 'Loading View. Please wait...'
			});
			this.loading.present();
			
			let url = "http://localhost:8080/ReservationTicketingWebService/NCE/services/ClientServices/getClientSystemDetails?clientCode=96&deviceCode=4059730729";
			this.http.get<ClientSystemDetails>(url).subscribe(
				res => {
					this.loading.dismiss();
					let status: any = null;
					status = res.status;
					console.log(res);
					console.log(status);
					if(res.status==0)
					{
						this.trainlist = JSON.parse(res.vehicleSeatClasses);
						//this.sourcelist = res.sourcelist;
						this.sourcelist = JSON.parse(res.stations);
					}
				},
				err => {
					this.loading.dismiss();
				  console.log('Error occured');
				}
			);
		});
	}

	
	onSourceChange(selectedValue: any) {
		console.log('Selected', selectedValue);
		let header = new HttpHeaders();
		header = header.set('Content-Type', 'application/json; charset=utf-8');
		header = header.set('Accept', 'application/json');
		
		//const httpOptions = {headers: header};
		//var parameter = JSON.stringify({});
		var holder = [];
		for(var k4=0; k4<this.sourcelist.length; k4++)
		{
			var obj = this.sourcelist[k4];
			var k2 = obj.stationId + "###" + obj.stationName;
			if(this.buyRailwayTicketData.source != k2)
			{
				holder.push(obj);
			}
		}
		this.destinationlist = holder;
		console.log(this.destinationlist);
		
		
	}
	
	searchTrainTrips(buyRailwayTicketData)
	{
		this.storage.get('zambia_bank_customer_token').then((val) => {
			this.token = val;
			
			let header = new HttpHeaders();
			header = header.set('Content-Type', 'application/x-www-form-urlencoded');
			header = header.set('Accept-Language', 'en-US,en;q=0.5');
			
			const httpOptions = {headers: header};
			
			var seatDetails = {};
			seatDetails['ADULT'] = [];
			seatDetails['CHILD'] = [];
			seatDetails['SENIOR'] = [];
			seatDetails['DISABLED'] = [];
			if(this.buyRailwayTicketData.adults>0)
			{
				for(var i=0; i<this.buyRailwayTicketData.adults; i++)
				{
					var seatDetail = {};
					seatDetail['seatClass'] = this.buyRailwayTicketData.train.split('###')[2];
					seatDetail['seatLocation'] = 'WINDOW';
					seatDetails['ADULT'].push(seatDetail);
				}
			}
			if(this.buyRailwayTicketData.child>0)
			{
				for(var i=0; i<this.buyRailwayTicketData.child; i++)
				{
					var seatDetail = {};
					seatDetail['seatClass'] = this.buyRailwayTicketData.train.split('###')[2];
					seatDetail['seatLocation'] = 'WINDOW';
					seatDetails['CHILD'].push(seatDetail);
				}
			}
			if(this.buyRailwayTicketData.seniors>0)
			{
				for(var i=0; i<this.buyRailwayTicketData.seniors; i++)
				{
					var seatDetail = {};
					seatDetail['seatClass'] = this.buyRailwayTicketData.train.split('###')[2];
					seatDetail['seatLocation'] = 'WINDOW';
					seatDetails['SENIOR'].push(seatDetail);
				}
			}
			if(this.buyRailwayTicketData.disabled>0)
			{
				for(var i=0; i<this.buyRailwayTicketData.disabled; i++)
				{
					var seatDetail = {};
					seatDetail['seatClass'] = this.buyRailwayTicketData.train.split('###')[2];
					seatDetail['seatLocation'] = 'WINDOW';
					seatDetails['DISABLED'].push(seatDetail);
				}
			}
			
			console.log(seatDetails);
			var seatDetailsStr = JSON.stringify(seatDetails);
			
			
			var form_params = "";
			form_params = form_params + "&departureStationCode=" + encodeURI(this.buyRailwayTicketData.source.split('###')[2]);
			form_params = form_params + "&arrivalStationCode=" + encodeURI(this.buyRailwayTicketData.destination.split('###')[2]);
			form_params = form_params + "&departureTime=" + encodeURI(this.buyRailwayTicketData.trip_date);
			form_params = form_params + "&hoursAdd=" + (7*24);
			form_params = form_params + "&tripClass=" + encodeURI(this.buyRailwayTicketData.train.split('###')[2]);
			form_params = form_params + "&clientCode=" + 96;
			form_params = form_params + "&deviceCode=" + 4059730729;
			form_params = form_params + "&passengerDetails=" + encodeURI(seatDetailsStr);
			//form_params = form_params + "&departureStationCode=" + encodeURI(buyRailwayTicketData.source.split('###')[2]);
			if(this.buyRailwayTicketData.trip_type=='return')
			{
				form_params = form_params + "&returnDate=" + encodeURI(this.buyRailwayTicketData.return_date);
			}
			var parameter = {};
			//parameter['form_params'] = form_params;
			parameter = form_params;
			
			console.log(parameter);
			let url = "http://localhost:8080/ReservationTicketingWebService/NCE/services/VehicleServices/searchAvailableTrips";
			
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
						if(this.buyRailwayTicketData.trip_type=='return')
						{
							if(res.outwardTripSeatsAvailabilityStatus==true && res.inwardTripSeatsAvailabilityStatus==true)
							{
								this.availabletrainlist = res.outwardVehicleTripList;
								this.returntrainlist = res.inwardVehicleTripList;
								this.outwardTicketPrices = res.outwardTicketPrices;
								this.outwardSeatsAlloted = res.outwardSeatsAlloted;
								this.inwardTicketPrices = res.inwardTicketPrices;
								this.inwardSeatsAlloted = res.inwardSeatsAlloted;
								this.navCtrl.push(BuyRailwayTicket2Page, {train:this.buyRailwayTicketData.train, source:buyRailwayTicketData.source, destination:this.buyRailwayTicketData.destination, 
									trip_date:this.buyRailwayTicketData.trip_date, return_date:this.buyRailwayTicketData.return_date, availabletrainlist:this.availabletrainlist, 
									outwardTicketPrices:this.outwardTicketPrices, outwardSeatsAlloted:this.outwardSeatsAlloted, 
									inwardTicketPrices:this.inwardTicketPrices, inwardSeatsAlloted:this.inwardSeatsAlloted, trip_type: this.buyRailwayTicketData.trip_type,
									returntrainlist: this.returntrainlist, adults: this.buyRailwayTicketData.adults, child: this.buyRailwayTicketData.child, 
									seniors: this.buyRailwayTicketData.seniors, disabled: this.buyRailwayTicketData.disabled, seatDetails: seatDetails
								});
							}
							else
							{
								if(res.outwardTripSeatsAvailabilityStatus==true)
								{
									let alert = this.alertCtrl.create({
										title: 'Trips Unavailable',
										message: "Oops...unfortunately there are no return train trips from " + this.buyRailwayTicketData.destination.split('###')[1] + " to " + this.buyRailwayTicketData.source.split('###')[1] + " matching your specified search. You can modify your search and search again",
										buttons: ['OK']
									});
									alert.present();
								}
								else
								{
									let alert = this.alertCtrl.create({
										title: 'Trips Unavailable',
										message: "Oops...unfortunately there are no train trips from " + this.buyRailwayTicketData.source.split('###')[1] + " to " + this.buyRailwayTicketData.destination.split('###')[1] + " matching your specified search. You can modify your search and search again",
										buttons: ['OK']
									});
									alert.present();
								}
								
							}
						}
						else if(this.buyRailwayTicketData.trip_type=='one-way')
						{
							if(res.outwardTripSeatsAvailabilityStatus==true)
							{
								console.log("seatDetails ==>");
								console.log(seatDetails);
								this.availabletrainlist = res.outwardVehicleTripList;
								this.outwardTicketPrices = res.outwardTicketPrices;
								this.outwardSeatsAlloted = res.outwardSeatsAlloted;
								this.navCtrl.push(BuyRailwayTicket2Page, {train:this.buyRailwayTicketData.train, source:this.buyRailwayTicketData.source, destination:this.buyRailwayTicketData.destination, 
									trip_date:this.buyRailwayTicketData.trip_date, return_date:this.buyRailwayTicketData.return_date, availabletrainlist:this.availabletrainlist, 
									outwardTicketPrices:this.outwardTicketPrices, outwardSeatsAlloted:this.outwardSeatsAlloted, 
									trip_type: this.buyRailwayTicketData.trip_type, adults: this.buyRailwayTicketData.adults, child: this.buyRailwayTicketData.child, 
									seniors: this.buyRailwayTicketData.seniors, disabled: this.buyRailwayTicketData.disabled, seatDetails: seatDetails
								});
							}
							else
							{
								let alert = this.alertCtrl.create({
									title: 'Trips Unavailable',
									message: "Oops...unfortunately there are no train trips from " + this.buyRailwayTicketData.source.split('###')[1] + " to " + this.buyRailwayTicketData.destination.split('###')[1] + " matching your specified search. You can modify your search and search again",
									buttons: ['OK']
								});
								alert.present();
							}
						}
					}
					else
					{
						let alert = this.alertCtrl.create({
							title: 'Trips Unavailable',
							message: "Oops...unfortunately there are no train trips from " + this.buyRailwayTicketData.source.split('###')[1] + " to " + this.buyRailwayTicketData.destination.split('###')[2] + " matching your specified search. You can modify your search and search again",
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

