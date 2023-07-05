import { Component } from '@angular/core';
import { IconNamesEnum, google } from 'ngx-bootstrap-icons';
import { ActivatedRoute, Router } from '@angular/router';
import { DiscussionApiService } from '../discussion-api.service';
import { AuthenticationService, UserInfo } from '../authentication.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  isLightMode: boolean = true;
  currentNav: NavBarItem;
  notificationList: NotificationItem[] = [];
  searchText: string;
  navLinks = [
    new NavBarItem("Home", "1", "house"),
    new NavBarItem("Popular", "2", "activity"),
    new NavBarItem("All", "3", "globe")
  ];
  User?: UserInfo;

  constructor(private readonly googleApi: AuthenticationService, private apiService: DiscussionApiService, private router: Router) {
    this.currentNav = this.navLinks[0]

    router.events.subscribe(val => {
      this.updateNotifications();
    });
  }

  ngOnInit() {
    let foundUser = this.googleApi.getUser();

    if (!foundUser?.info) {
      setTimeout(() => {
        this.User = this.googleApi.getUser();
      }, 500)
    }
    this.User = foundUser;
  }

  login() {
    this.googleApi.login();
  }

  isLoggedIn(): boolean {
    return this.googleApi.isLoggedIn();
  }

  logout() {
    this.googleApi.signOut();
  }

  async updateNotifications() {
    this.notificationList = await this.apiService.GetNotifications();
  }

  changeNav(newNav: NavBarItem) {
    this.currentNav = newNav;
  }

  searchPosts() {
    if (this.searchText.length > 0) {
      this.router.navigate(
        ['/'],
        {
          queryParams: { q: this.searchText },
        })
        .then(() => {
          window.location.reload();
        });
    }
  }

  clearNotification(item?: NotificationItem) {
    this.router.navigate(['/comments', item?.discussionPostId])
      .then(() => {
        window.location.reload();
      });
    this.apiService.DeleteNotification(item?.id!);
  }
}

class NavBarItem {
  title: string;
  route: string;
  icon: IconNamesEnum;

  constructor(title: string, route: string, icon: string) {
    this.title = title;
    this.route = route;
    this.icon = icon as IconNamesEnum;
  }
}

export class NotificationItem {
  id?: number;
  user?: string;
  userImage?: string;
  message?: string;
  datePosted?: Date;
  discussionPostId?: string;
}