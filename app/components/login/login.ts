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

  sendForm() {
    if (this.user.username == '' || this.user.password == '') {
      this.error = "Empty login or password";
      return;
    }
    this.urlService.login(this.user, true).subscribe((data) => {
      this.hasError(data).subscribe((data) => {
        this.info = "Login !!!"
      });
    }, (error) => { this.info = ""; this.error = error; });
  }
}