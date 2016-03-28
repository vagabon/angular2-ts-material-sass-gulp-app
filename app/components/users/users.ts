import {Component, ViewEncapsulation} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';

import {UsersListCmp} from './users_list/users_list';
import {UserDetailsCmp} from './user_details/user_details';

@Component({
  selector: 'users',
  template: '<router-outlet></router-outlet>',
  encapsulation: ViewEncapsulation.None,
  directives: [ROUTER_DIRECTIVES]
})
@RouteConfig([
  { path: '/list', component: UsersListCmp, as: 'Users-list', useAsDefault: true },
  { path: '/show/:userId', component: UserDetailsCmp, as: 'User-details' },
])
export class UsersCmp {}
