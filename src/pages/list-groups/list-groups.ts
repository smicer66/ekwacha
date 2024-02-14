import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { IonicPage, NavController, NavParams, ToastController, ActionSheetController, Platform, AlertController, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import 'rxjs/add/operator/take';
import { HttpClient, HttpHeaders } from '@angular/common/http';

/*import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';*/

import { AngularFireAuth } from 'angularfire2/auth';

import { LoginPage } from '../login/login';
//import { ListGroupsPage } from '../list-groups/list-groups';
import { AddMembersToGroupPage } from '../add-members-to-group/add-members-to-group';
import { GroupDashboardPage } from '../group-dashboard/group-dashboard';

/**
 * Generated class for the ListGroupsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

interface GroupListInterface{
	status: any;
	message: any;
	groupList: any;
	groupsAdminList: any;
}

@IonicPage()
@Component({
  selector: 'page-list-groups',
  templateUrl: 'list-groups.html',
})
export class ListGroupsPage {
	
	groups_list: any;
	all_groups_list: any;
	loading: any;
	token: any;
	groups_admin_list: any;
	
	
	constructor(public platform: Platform, public alertCtrl: AlertController, public storage: Storage, public loadingCtrl: LoadingController, public http: HttpClient, public actionSheetCtrl: ActionSheetController, public toastCtrl: ToastController, public afAuth: AngularFireAuth, public fb: FormBuilder, public navCtrl: NavController, public navParams: NavParams){
		this.storage.get('zambia_bank_customer_token').then((val) => {
			this.token = val;
			let header = new HttpHeaders();
			header = header.set('Content-Type', 'application/x-www-form-urlencoded');
			header = header.set('Accept-Language', 'en-US,en;q=0.5');
			header = header.set('auth_token', this.token);
			
			
			const httpOptions = {headers: header};
			
			var parameter = "";
			let url = "";
			
			url = "http://localhost:8080/EKwachaWebService/NCE/services/GroupServices/listGroups";
			var form_params = "";
			parameter = form_params;	
			console.log(parameter);
				
			
			
			this.loading = this.loadingCtrl.create({
				content: 'Loading View. Please wait...'
			});
			this.loading.present();
			this.http.post<GroupListInterface>(url, parameter, httpOptions).subscribe(
				res1 => {
					console.log(res1);
					this.loading.dismiss();
					if(res1.status==0)
					{
						this.groups_list = JSON.parse(res1.groupList);
						this.all_groups_list = this.groups_list;
						this.groups_admin_list = JSON.parse(res1.groupsAdminList);
					}
					else
					{
						this.presentToast({message: res1.message});
					}
				},
				err => {					
					this.loading.dismiss();
					console.log('Error occured');
					this.presentToast({message: 'Oops! Seems we experienced a connectivity issue while trying to pay your utility'});
					this.navCtrl.setRoot(ListGroupsPage);
				}
			);
		});
	}

	ionViewDidLoad() {
		
	}
	
	presentToast(err) {
		const toast = this.toastCtrl.create({
			message: err.message,
			duration: 3000,
			position: 'bottom'
		});

		toast.present();
	}
	
	
	formatNumber(number, places)
	{
		var x = Number(parseFloat(number).toFixed(places)).toLocaleString('en', {minimumFractionDigits: places});
		//console.log(x);
		//console.log(Number(parseFloat(number).toFixed(2)).toLocaleString('en', {minimumFractionDigits: 2}));
		//console.log(Number(parseFloat("0").toFixed(2)).toLocaleString('en', {minimumFractionDigits: 2}));
		//console.log(Number(parseFloat("4").toFixed(2)).toLocaleString('en', {minimumFractionDigits: 2}));
		return x;
	}

	
	goToGroup(group)
	{
		console.log(group);
		var isAdmin = false;
		if(this.groups_admin_list.includes(group.groupId))
		{
			console.log("yes it containts");
			isAdmin = true;
		}
		this.navCtrl.setRoot(GroupDashboardPage, {group: group, isAdmin: isAdmin});
		console.log(group);
	}
	
	
	getGroups(ev: any) {
		this.groups_list = this.all_groups_list;
		const val = ev.target.value;
		if (val && val.trim() != '') {
			this.groups_list = this.groups_list.filter((item) => {
				return (item.groupName.toLowerCase().indexOf(val.toLowerCase()) > -1);
			})
		}
		else
		{
			this.groups_list = this.all_groups_list;
		}
	}
}
