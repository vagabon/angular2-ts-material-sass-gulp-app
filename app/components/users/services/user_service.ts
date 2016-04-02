import {Injectable} from 'angular2/core';
import {Http, Headers} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';

import {UrlService} from '../../../engine/all';

const USER_PATH = "/user";

@Injectable()
export class UserService extends UrlService {

  http:Http;
  data;

  constructor(httpd:Http) {
    super(httpd, USER_PATH);
    this.http = httpd;
  }


}
