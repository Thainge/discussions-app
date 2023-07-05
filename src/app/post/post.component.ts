import { Component } from '@angular/core';
import { DiscussionPost, PostComment } from '../home/home.component';
import { NgxSpinnerService } from "ngx-spinner";
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DiscussionApiService } from '../discussion-api.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from "@angular/platform-browser";

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent {
  postId: number;
  post: DiscussionPost = new DiscussionPost({});
  postComments: PostComment[];
  commentForm: FormGroup;

  constructor(private titleService: Title, private apiService: DiscussionApiService, private route: ActivatedRoute, private spinner: NgxSpinnerService) {
    this.titleService.setTitle(this.post.title + "Discussions App");
  }

  async ngOnInit() {
    // Form for comments
    this.commentForm = new FormGroup({
      comment: new FormControl('', Validators.required)
    });

    this.spinner.show();

    // Get route Id
    this.route.params.subscribe(
      (params: Params) => {
        this.postId = params['postId'];
      }
    );

    // Fetch post data
    var postData = await this.apiService.GetSinglePost(this.postId);
    this.post = postData as DiscussionPost;
    // fetch comments data
    var commentsData = await this.apiService.GetPostComments(this.postId);
    this.postComments = commentsData as PostComment[];
    this.spinner.hide();
  }

  async onSubmit(form: FormGroup) {
    this.commentForm.markAllAsTouched();

    if (form.valid) {
      this.spinner.show();
      console.log(form.value);
      await this.apiService.CreateComment(form.value, this.postId);

      await new Promise(resolve => setTimeout(resolve, 500));
      // Fetch new post data
      var postData = await this.apiService.GetSinglePost(this.postId);
      this.post = postData as DiscussionPost;
      // fetch new comments data
      var commentsData = await this.apiService.GetPostComments(this.postId);
      this.postComments = commentsData as PostComment[];
      this.commentForm.reset();
      this.spinner.hide();
    }
  }

  async upVote(e: Event, Id: number) {
    e.stopPropagation();
    e.preventDefault();
    this.spinner.show();
    this.apiService.Upvote(Id);

    // Local update
    await new Promise(resolve => setTimeout(resolve, 500));
    var postData = await this.apiService.GetSinglePost(this.postId);
    this.post = postData as DiscussionPost;
    this.spinner.hide();
  }

  async downVote(e: Event, Id: number) {
    e.stopPropagation();
    e.preventDefault();
    this.spinner.show();
    this.apiService.Downvote(Id);

    // Local update
    await new Promise(resolve => setTimeout(resolve, 500));
    var postData = await this.apiService.GetSinglePost(this.postId);
    this.post = postData as DiscussionPost;
    this.spinner.hide();
  }
}
