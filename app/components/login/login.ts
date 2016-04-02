import {Component, Inject, ViewEncapsulation} from 'angular2/core';
import {Http} from 'angular2/http';
import {MATERIAL_DIRECTIVES} from "ng2-material/all";
import {TranslateService} from 'ng2-translate/ng2-translate';
import {RouteParams, RouterLink} from 'angular2/router';
import {FORM_DIRECTIVES} from "angular2/common";

import {Logger, BaseCrud, UserDto, UrlService} from '../../engine/all';

@Component({
  selector: 'login',
  templateUrl: 'components/login/login.html',
  providers: [],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent extends BaseCrud {

  urlService:UrlService;
  user:UserDto;

  constructor(@Inject(RouteParams) routeParams, private http:Http, private translate: TranslateService) {
    super(translate);
    this.urlService = new UrlService(http, "/");
    this.user = new UserDto();
  }

  login() {
    if (this.user.username == '' || this.user.password == '') {
      this.error = "Empty login or password";
      return;
    }
    this.urlService.login(this.user, true).subscribe((data) => {
      this.hasError(data).subscribe((data) => {
        window.location.hash = "#/home";
      });
    }, (error) => { this.info = ""; this.error = error; });
  }

  createAccount() {
    console.log(this.user.username, this.user.password, this.user.passwordConfirm, this.user.email, this.user.emailConfirm)
    if (this.fieldRequire(this.user.username, this.user.password, this.user.passwordConfirm, this.user.email, this.user.emailConfirm)) {
      this.error = "Migging field(s)";
      return;
    }
    if (this.user.password != this.user.passwordConfirm) {
      this.error = "not the same password";
      return;
    }
    if (this.user.email != this.user.emailConfirm) {
      this.error = "not the same email";
      return;
    }
    let newUser = new UserDto();
    newUser.username = this.user.username;
    newUser.password = btoa(this.user.password);
    newUser.email = this.user.email;
    this.urlService.postUrlBase("/user/createAccount", newUser).subscribe((data) => {
      this.hasError(data).subscribe((data) => {
        this.info = "User created"
      });
    }, (error) => { this.info = ""; this.error = error; });
  }
}