import { Component } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
import { ActivatedRoute, Router } from '@angular/router';
import { DiscussionApiService } from '../discussion-api.service';
import { AuthenticationService, UserInfo } from '../authentication.service';
import { Title } from "@angular/platform-browser";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  loading: boolean = true;
  currentFilter: number;
  currentSearch: string;
  postsList: DiscussionPost[] = [];
  User?: UserInfo;

  constructor(private titleService: Title, private readonly googleApi: AuthenticationService, private apiService: DiscussionApiService, private router: Router, private route: ActivatedRoute, private spinner: NgxSpinnerService) {
    this.titleService.setTitle("Home - Discussions App");
  }

  async ngOnInit() {
    this.currentFilter = parseInt(this.route.snapshot.queryParamMap.get('f') as string) || 1;
    this.currentSearch = this.route.snapshot.queryParamMap.get('q') as string || "";
    this.spinner.show();

    // get user
    let foundUser = this.googleApi.getUser();

    if (!foundUser.info) {
      setTimeout(() => {
        this.User = this.googleApi.getUser();
      }, 500)
    }
    this.User = foundUser;

    // Get all posts
    this.postsList = await this.apiService.GetAllPosts(this.currentFilter, this.currentSearch);

    this.loading = false;
    this.spinner.hide();
  }

  async setFilter(newValue: number) {
    this.currentFilter = newValue;
    this.spinner.show();

    // Update params in url for filter
    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: { f: newValue },
        queryParamsHandling: 'merge', // remove to replace all query params by provided
      }).then(() => {
        window.location.reload();
      });

    this.loading = false;
    this.spinner.hide();
  }

  async upVote(e: Event, Id: number) {
    e.stopPropagation();
    e.preventDefault();
    this.spinner.show();
    this.apiService.Upvote(Id);

    // Local update
    await new Promise(resolve => setTimeout(resolve, 500));
    this.postsList = await this.apiService.GetAllPosts(this.currentFilter, this.currentSearch);

    this.spinner.hide();
  }

  async downVote(e: Event, Id: number) {
    e.stopPropagation();
    e.preventDefault();
    this.spinner.show();
    this.apiService.Downvote(Id);

    // Local update
    await new Promise(resolve => setTimeout(resolve, 500));
    this.postsList = await this.apiService.GetAllPosts(this.currentFilter, this.currentSearch);

    this.spinner.hide();

  }
}

export class DiscussionPost {
  id?: number;
  votes?: number;
  author?: string;
  authorImage?: string;
  title?: string;
  description?: string;
  dateCreated?: Date;
  comments?: number;

  constructor(values: DiscussionPost) {
    Object.assign(this, values);
  }
}

export class PostComment {
  id?: number;
  discussionPostId?: number;
  comment?: string;
  author?: string;
  authorImage?: string;
  postedDate?: Date;

  constructor(values: PostComment) {
    Object.assign(this, values);
  }
}
