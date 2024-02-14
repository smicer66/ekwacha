/**
 * Generated class for the NewGroupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

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
import { ListGroupsPage } from '../list-groups/list-groups';
import { AddMembersToGroupPage } from '../add-members-to-group/add-members-to-group';
//import { LoadingProvider } from '../../providers/loading/loading';

declare var cordova: any;

@IonicPage()
@Component({
  selector: 'page-new-group',
  templateUrl: 'new-group.html',
})
export class NewGroupPage {

	newGroupData = { groupName: '' , groupShortName: '', membershipLimit: '', openGroup: '', aboutGroup: ''};
	newGroupForm : FormGroup;
	groupName: AbstractControl;
	groupShortName: AbstractControl;
	membershipLimit: AbstractControl;
	openGroup: AbstractControl;
	aboutGroup: AbstractControl;
	loading: any;
	token: any;
	
	constructor(public platform: Platform, public alertCtrl: AlertController, public storage: Storage, public loadingCtrl: LoadingController, public http: HttpClient, public actionSheetCtrl: ActionSheetController, public toastCtrl: ToastController, public afAuth: AngularFireAuth, public fb: FormBuilder, public navCtrl: NavController, public navParams: NavParams){
		this.newGroupForm = this.fb.group({
			'groupName' : [null, Validators.compose([Validators.required])],
			'groupShortName' : [null, Validators.compose([Validators.required])],
			'membershipLimit' : [null, Validators.compose([Validators.required])],
			'openGroup' : [null, Validators.compose([Validators.required])],
			'aboutGroup' : [null, Validators.compose([Validators.required])],
		});
		console.log('1');
        this.groupName = this.newGroupForm.controls['groupName'];
		this.groupShortName = this.newGroupForm.controls['groupShortName'];
		this.membershipLimit = this.newGroupForm.controls['membershipLimit'];
		this.openGroup = this.newGroupForm.controls['openGroup'];
		this.aboutGroup = this.newGroupForm.controls['aboutGroup'];
		console.log('2');
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad NewGroupPage');
	}

	doGroupCreateStepOne(newGroupData)
	{
		this.storage.get('zambia_bank_customer_token').then((val) => {
			this.token = val;
			let header = new HttpHeaders();
			header = header.set('Content-Type', 'application/x-www-form-urlencoded');
			header = header.set('Accept-Language', 'en-US,en;q=0.5');
			header = header.set('auth_token', this.token);
			
			
			const httpOptions = {headers: header};
			
			var parameter = "";
			let url = "";
			var orderRef = Math.random().toString(36).substring(2, 15).toUpperCase() + Math.random().toString(36).substring(2, 15).toUpperCase();
			url = "http://localhost:8080/EKwachaWebService/NCE/services/GroupServices/createNewGroup";
			var form_params = "";
			form_params = form_params + "&name=" + encodeURI(this.newGroupData.groupName);
			form_params = form_params + "&shortName=" + encodeURI(this.newGroupData.groupShortName);
			form_params = form_params + "&story=" + encodeURI(this.newGroupData.aboutGroup);
			form_params = form_params + "&isOpen=" + encodeURI(this.newGroupData.openGroup);
			form_params = form_params + "&maximumMembers=" + encodeURI(this.newGroupData.membershipLimit);
			parameter = form_params;	
			console.log(parameter);
				
			
			
			this.loading = this.loadingCtrl.create({
				content: 'Loading View. Please wait...'
			});
			this.loading.present();
			this.http.post<AccountVerify>(url, parameter, httpOptions).subscribe(
				res1 => {
					console.log(res1);
					this.loading.dismiss();
					if(res1.status==0)
					{
						this.storage.get('zambia_group_list').then((val) => {
							var groupList = [];
							if(val!=undefined && val!=null)
							{
								groupList = JSON.parse(val);
							}
							var groupInfo = {};
							groupInfo['groupName'] = res1.groupName;
							groupInfo['groupId'] = res1.groupId;
							groupInfo['shortName'] = this.newGroupData.groupShortName;
							groupInfo['story'] = this.newGroupData.aboutGroup;
							groupInfo['isOpen'] = this.newGroupData.openGroup;
							groupInfo['maximumMembers'] = this.newGroupData.membershipLimit;
							
							groupList.push(groupInfo);
							this.storage.set('zambia_group_list', JSON.stringify(groupList));
							this.navCtrl.setRoot(AddMembersToGroupPage, {message: res1.message, nextTitle: 'Add Group Member - 2/3', groupId: res1.groupId, 
								groupName: res1.groupName, remainingMemberCount: res1.remainingMemberCount});
							
						});
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
	
	presentToast(err) {
		const toast = this.toastCtrl.create({
			message: err.message,
			duration: 3000,
			position: 'bottom'
		});

		toast.present();
	}
}

interface AccountVerify{
	status: any;
	response_msg: any;
	account_number: any;
	reg_code: any;
	message: any;
	groupId: any;
	groupName: any;
	remainingMemberCount: any;
}