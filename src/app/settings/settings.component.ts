import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthenticationService, UserInfo } from '../authentication.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
  userDataForForm?: ApplicationUser;
  formData: FormGroup;
  User?: UserInfo;

  constructor(private readonly googleApi: AuthenticationService, private spinner: NgxSpinnerService) {
    let foundUser = this.googleApi.getUser();

    if (!foundUser.info) {
      setTimeout(() => {
        this.User = this.googleApi.getUser();
      }, 500)
    }
    this.User = foundUser;
  }

  ngOnInit() {
    this.spinner.hide();

    this.formData = new FormGroup({
      name: new FormControl(this.User?.info?.given_name, Validators.required)
    });
  }

  async onSubmit(form: FormGroup) {
    this.formData.markAllAsTouched();

    if (form.valid) {
      let newProfile = this.User;
      console.log(form)
      if (newProfile) {
        newProfile.info.given_name = form.value.name;
        localStorage.setItem('userData', JSON.stringify(newProfile));
      }
    }
    window.location.reload();
  }
}

export class ApplicationUser {
  id: number;
  name: string;
  imageText: string;
  image: string;

  constructor(values: ApplicationUser) {
    Object.assign(this, values);
  }
}