import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ActionSheetController, Platform, AlertController, LoadingController } from 'ionic-angular';
import { Storage } from "@ionic/storage";
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Contacts } from '@ionic-native/contacts';
import 'rxjs/add/operator/take';
import { HttpClient, HttpHeaders } from '@angular/common/http';

/*import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';*/

import { AngularFireAuth } from 'angularfire2/auth';

import { LoginPage } from '../login/login';
import { NewContributionPackagePage } from '../new-contribution-package/new-contribution-package';
import { ListGroupsPage } from '../list-groups/list-groups';

/**
 * Generated class for the AddMembersToGroupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
 
interface AddMembersToGroupInterface{
	status: any;
	firstName: any;
	lastName: any;
	mobileNumber: any;
	message: any;
	memberId: any;
}

@IonicPage()
@Component({
  selector: 'page-add-members-to-group',
  templateUrl: 'add-members-to-group.html',
})
export class AddMembersToGroupPage {

	addMemberToGroupData = { memberPhoneNumber: '' };
	addMemberToGroupForm : FormGroup;
	memberPhoneNumber: AbstractControl;
	
	membersVerified: any = [];
	groupId: any;
	allContacts: any = [];
	token: any;
	loading: any;
	message: any;
	title: any;
	groupTitle: any;
	groupName: any;
	remainingMemberCount: any;
	
	
	constructor(public platform: Platform, public actionSheetCtrl: ActionSheetController, public loadingCtrl: LoadingController, public alertCtrl: AlertController, 
		public storage: Storage, public http: HttpClient, public toastCtrl: ToastController, public afAuth: AngularFireAuth, public fb: FormBuilder, 
		public navCtrl: NavController, public navParams: NavParams) {
		
		this.message = navParams.get('message');
		this.groupId = navParams.get('groupId');
		this.groupName = navParams.get('groupName');
		this.title = navParams.get('nextTitle');
		this.remainingMemberCount = navParams.get('remainingMemberCount');
		
		console.log([this.message, this.groupId, this.title]);
		
		if(this.title!=undefined && this.title!=null)
		{
		
		}
		else
		{
			this.title = 'Add Members To Group';
			this.groupTitle = this.groupName;
		}
		
		this.addMemberToGroupForm = this.fb.group({
			'memberPhoneNumber' : [null, Validators.compose([Validators.required])]
		});

        this.memberPhoneNumber = this.addMemberToGroupForm.controls['memberPhoneNumber'];
		
		if (this.platform.is('cordova'))
		{
			/*Contacts.find(['displayName', 'name', 'phoneNumbers'], {filter: "", multiple: true}).then(data => {
				console.log(data);
				this.allContacts = data
			});*/
		}
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad AddMembersToGroupPage');
	}

	
	
	verifyUser(mobileNumber: any){
	
		if(this.remainingMemberCount>0)
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
				url = "http://localhost:8080/EKwachaWebService/NCE/services/GroupServices/verifyUserByMobileNumber";
				var form_params = "";
				form_params = form_params + "&mobileNumber=" + encodeURI(this.addMemberToGroupData.memberPhoneNumber);
				form_params = form_params + "&groupId=" + encodeURI(this.groupId);
				parameter = form_params;	
				console.log(parameter);
					
				
				
				this.loading = this.loadingCtrl.create({
					content: 'Loading View. Please wait...'
				});
				this.loading.present();
				this.http.post<AddMembersToGroupInterface>(url, parameter, httpOptions).subscribe(
					res1 => {
						console.log(res1);
						this.loading.dismiss();
						if(res1.status==0)
						{
							var proceed = true;
							for(var i3=0; i3<this.membersVerified.length; i3++)
							{
								var mem = this.membersVerified[i3];
								if(mem.id==res1.memberId)
								{
									proceed = false;
								}
							}
							
							if(proceed==true)
							{
								this.addMemberToGroupData.memberPhoneNumber = '';
								if(this.membersVerified.length % 2==0)
								{
									this.membersVerified.push({bgColor: '#E2F5D6', id: res1.memberId, firstName: res1.firstName, lastName: res1.lastName, mobileNumber: res1.mobileNumber});
								}
								else
								{
									this.membersVerified.push({bgColor: '', id: res1.memberId, firstName: res1.firstName, lastName: res1.lastName, mobileNumber: res1.mobileNumber});
								}
							}
							this.presentToast({message: 'Mobile number verified!'});
						}
						else
						{
							this.presentToast({message: res1.message});
						}
					},
					err => {
						
						this.loading.dismiss();
						console.log('Error occured');
						this.presentToast({message: 'Oops! Seems we experienced a connectivity issue while trying to verify the mobile number'});
						this.navCtrl.setRoot(LoginPage);
					}
				);
			});
		}
		else
		{
			this.presentToast({message: 'This group currently has the maximum number of members it can take. You can not add a new member or join the group until a member is removed'});
		}
	}
	
	addMembersToGroup(addMemberToGroupData)
	{
		console.log(addMemberToGroupData);
		var allMembers = [];
		for(var i1=0; i1<this.membersVerified.length; i1++)
		{
			allMembers.push({customerId: this.membersVerified[i1].id, isAdmin: 0});
		}
		this.storage.get('zambia_bank_customer_token').then((val) => {
			this.token = val;
			let header = new HttpHeaders();
			header = header.set('Content-Type', 'application/x-www-form-urlencoded');
			header = header.set('Accept-Language', 'en-US,en;q=0.5');
			header = header.set('auth_token', this.token);
			
			
			const httpOptions = {headers: header};
			
			var parameter = "";
			let url = "";
			
			url = "http://localhost:8080/EKwachaWebService/NCE/services/GroupServices/createNewGroupMembers";
			var form_params = "";
			form_params = form_params + "&groupId=" + encodeURI(this.groupId);
			form_params = form_params + "&customers=" + encodeURI(JSON.stringify(allMembers));
			form_params = form_params + "&isActive=" + encodeURI('true');
			parameter = form_params;	
			console.log(parameter);
				
			
			
			this.loading = this.loadingCtrl.create({
				content: 'Loading View. Please wait...'
			});
			this.loading.present();
			this.http.post<AddMembersToGroupInterface>(url, parameter, httpOptions).subscribe(
				res1 => {
					console.log(res1);
					this.loading.dismiss();
					if(res1.status==0)
					{
						this.navCtrl.setRoot(NewContributionPackagePage, {message: res1.message, nextTitle: 'Add A Contribution Package - 3/3', groupId: this.groupId, groupName: this.groupName});
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
	
	
	removeMember(member)
	{
		var newMembers = [];
		for(var i1=0; i1<this.membersVerified.length; i1++)
		{
			if(member.id!=this.membersVerified[i1].id)
			{
				newMembers.push(this.membersVerified[i1].id);
			}
		}
		this.membersVerified = newMembers;
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
