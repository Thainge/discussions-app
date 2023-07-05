import { Component } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
import { Router } from '@angular/router';
import { DiscussionApiService } from '../discussion-api.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from "@angular/platform-browser";

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent {
  showErrors: boolean = false;
  loading: boolean = true;
  formData: FormGroup;

  constructor(private titleService: Title, private apiService: DiscussionApiService, private router: Router, private spinner: NgxSpinnerService) {
    this.titleService.setTitle("Create Post - Discussions App");
  }

  ngOnInit() {
    this.spinner.hide();

    this.formData = new FormGroup({
      title: new FormControl('', Validators.required),
      description: new FormControl('')
    });
  }

  async onSubmit(form: FormGroup) {
    this.formData.markAllAsTouched();

    if (form.valid) {
      this.spinner.show();
      await this.apiService.CreatePost(form.value);
      this.spinner.hide();

      await new Promise(resolve => setTimeout(resolve, 500));
      this.router.navigate(['/']);
    }
  }
}
