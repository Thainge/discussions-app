import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { DiscussionPost, PostComment } from './home/home.component';
import { firstValueFrom } from 'rxjs';
import { NotificationItem } from './navbar/navbar.component';
import { AuthenticationService, UserInfo } from './authentication.service';

const API_URL = "https://discussion-api-east-dev-001.azurewebsites.net/discussions/";

@Injectable({
  providedIn: 'root'
})
export class DiscussionApiService {
  private _options = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
  User?: UserInfo;

  constructor(private http: HttpClient, private readonly googleApi: AuthenticationService) {
    let foundUser = this.googleApi.getUser();

    if (!foundUser.info) {
      setTimeout(() => {
        this.User = this.googleApi.getUser();
        let newOptions = this._options;
        this._options = newOptions;
      }, 500)
    }
    this.User = foundUser;
    let newOptions = this._options;
    this._options = newOptions;
  }

  public async GetAllPosts(currentFilter?: number, query?: string) {
    try {
      return firstValueFrom(this.http.get<DiscussionPost[]>(API_URL + 'All?filterId=' + currentFilter + "&query=" + query));
    } catch (err) {
      console.log(err)
      return [];
    }
  }

  public async GetSinglePost(Id: number) {
    try {
      return firstValueFrom(this.http.get<DiscussionPost>(API_URL + "Single?Id=" + Id));
    } catch (err) {
      console.log(err);
      return {};
    }
  }

  public async GetPostComments(Id: number) {
    try {
      return firstValueFrom(this.http.get(API_URL + "Comments?Id=" + Id));
    } catch (err) {
      console.log(err);
      return [];
    }
  }

  public async CreatePost(postData: DiscussionPost) {
    try {
      var bodyData = {
        title: postData.title,
        description: postData.description,
        author: this.User?.info?.given_name,
        authorImage: this.User?.info?.picture
      };
      const body = JSON.stringify(bodyData);
      console.log(this.User)
      return this.http.post(API_URL + "CreatePost", body, this._options)
        .subscribe((data) => console.log(data));
    } catch (err) {
      console.log(err);
      return {};
    }
  }

  public async CreateComment(commentData: PostComment, postId: number) {
    try {
      var bodyData = {
        discussionPostId: postId,
        comment: commentData.comment,
        author: this.User?.info?.given_name,
        authorImage: this.User?.info?.picture
      };
      const body = JSON.stringify(bodyData);
      return this.http.post(API_URL + "CreateComment", body, this._options)
        .subscribe((data) => console.log(data));
    } catch (err) {
      console.log(err);
      return {};
    }
  }

  public async Upvote(Id: number) {
    try {
      var user = this.User?.info?.given_name;
      return this.http.get(API_URL + "Upvote?Id=" + Id + "&User=" + user)
        .subscribe();
    } catch (err) {
      console.log(err);
      return {};
    }
  }

  public async Downvote(Id: number) {
    try {
      var user = this.User?.info?.given_name;
      return this.http.get(API_URL + "Downvote?Id=" + Id + "&User=" + user)
        .subscribe();
    } catch (err) {
      console.log(err);
      return {};
    }
  }

  public async GetNotifications() {
    try {
      var user = this.User?.info?.given_name;
      return firstValueFrom(this.http.get<NotificationItem[]>(API_URL + "Notifications?User=" + user));
    } catch (err) {
      console.log(err);
      return [];
    }
  }

  public async DeleteNotification(Id: number) {
    try {
      return firstValueFrom(this.http.delete(API_URL + "ClearNotification?Id=" + Id));
    } catch (err) {
      console.log(err);
      return [];
    }
  }
}
