import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ActionSheetController, Platform, AlertController, LoadingController, ModalController } from 'ionic-angular';
import { Storage } from "@ionic/storage";
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import 'rxjs/add/operator/take';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AngularFireAuth } from 'angularfire2/auth';
//import { LoadingProvider } from '../../providers/loading/loading';
import { AnalysisPage } from '../analysis/analysis';
import { NewGroupPage } from '../new-group/new-group';
import { LoginPage } from '../login/login';
import { ListGroupsPage } from '../list-groups/list-groups';

/**
 * Generated class for the EkwachaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ekwacha',
  templateUrl: 'ekwacha.html',
})
export class EkwachaPage {

	user: any;
	message: any;
	
	
	constructor(public modalCtrl: ModalController, public platform: Platform, public loadingCtrl: LoadingController, public http: HttpClient, public storage: Storage, public alertCtrl: AlertController, public actionSheetCtrl: ActionSheetController, public toastCtrl: ToastController, public afAuth: AngularFireAuth, public fb: FormBuilder, public navCtrl: NavController, public navParams: NavParams) {
		this.message = navParams.get('message');
		console.log(this.message);
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad EkwachaPage');
		if(this.message!=null)
		{
			this.presentToast({message: this.message});
		}
		this.storage.get('zambia_group_list').then((groups) => {
			console.log(groups);
			if(groups!=null)
			{
				this.navCtrl.setRoot(ListGroupsPage);
			}
			else
			{
			}
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
	
	addGroup()
	{
		console.log('--------------');
		this.navCtrl.setRoot(NewGroupPage);
	}

}
