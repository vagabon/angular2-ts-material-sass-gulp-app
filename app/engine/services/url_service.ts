import {Injectable} from 'angular2/core';
import {Http, Headers} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';

import {Logger} from '../log/logger';
import {Settings} from "../../settings";

const URL = Settings.URL;
const FINDALL = '/findall';
const FINDBY = '/findBy';
const CREATE = '/create';
const UPDATE = '/updateAll';
const DELETE = '/delete';
const UPLOAD = '/upload';

@Injectable()
export class UrlService {

  data: Array<any>;

  constructor(public http:Http, public path: String) {
  }

  lauthGetUrl(url, observer) {
    Logger.log(url);
    var obj = document.getElementById("errorContent").style.display = "none";
    var headers = new Headers();
    headers.append('Authorization', Settings.TOKEN.NAME + ',' + Settings.TOKEN.VALUE);
    Settings.TOKEN.NAME = '';
    this.http.get(url, {headers:headers})
        .map(res => res.json())
        .subscribe((data) => this.resolve(data, observer), (error) => this.handleError(error, observer));
  }

  lauthPostUrl(url, json, observer) {
    Logger.log(url, json);
    document.getElementById("errorContent").style.display = "none";
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', Settings.TOKEN.NAME + ',' + Settings.TOKEN.VALUE);
    Settings.TOKEN.NAME = '';
    this.http.post(url, JSON.stringify(json), {headers:headers})
        .map(res => res.json())
        .subscribe((data) => this.resolve(data, observer), (error) => this.handleError(error, observer));
  }

  launchUrl(url, json, type) {
    if (Settings.TOKEN.NAME == '') {
      Settings.TOKEN.NAME = Math.random().toString(36).substring(2);
      return Observable.create(observer => {
        Logger.log(URL + "/token?name=" + Settings.TOKEN.NAME);
        var headers = new Headers();
        headers.append('Authorization', 'generate');
        headers.append('content-Type', 'application/json');
        this.http.get(URL + "/token?name=" + Settings.TOKEN.NAME, {headers:headers}).map(res => res.json()).subscribe((data) => {
          Logger.log(data)
          Settings.TOKEN.VALUE = data["token"];
          if (type == "GET") {
            this.lauthGetUrl(url, observer);
          }
          if (type == "POST") {
            this.lauthPostUrl(url, json, observer);
          }
        });
      });
    } else {
      return  Observable.create(observer => {
        if (type == "GET") {
          this.lauthGetUrl(url, observer);
        }
        if (type == "POST") {
          this.lauthPostUrl(url, json, observer);
        }
      });
    }
  }

  getUrl(url) {
    return this.launchUrl(url, {}, "GET");
  }

  postUrl(url, json) {
    return this.launchUrl(url, json, "POST");
  }

  resolve(data, observer) {
    Logger.log(data);
    if (data.status == 500) {
      document.getElementById("errorContent").style.display = "block";
      document.getElementById("errorMessage").innerHTML = data.stacktrace;
    }
    observer.next(data);
    observer.complete();
  }

  handleError(error, observer) {
    console.error(error);
    document.getElementById("errorContent").style.display = "block";
    var errorText = error.json().error || 'Server error';
    document.getElementById("errorMessage").innerHTML = errorText;
    observer.error(errorText);
    observer.complete();
  }

  findById(id) {
    return this.getUrl(URL + this.path + FINDBY + '?champs=id&values=' + id);
  }

  findByUsername(username, min, max) {
    if (username == '') {
      return this.findAll(min, max);
    }
    return this.getUrl(URL + this.path + FINDBY + '?champs=username&values=' + username);
  }

  findAll(min, max) {
    return this.getUrl(URL + this.path + FINDALL + '?limit1=' + min + '&limit2=' + max);
  }

  update(user) {
    if (typeof user.id === "number" && user.id >= 0) {
      return this.postUrl(URL + this.path + UPDATE, user);
    } else {
      return this.postUrl(URL + this.path + CREATE, user);
    }
  }

  delete(userId) {
    return this.postUrl(URL + this.path + DELETE, userId);
  }

  upload(file: File) {
    Logger.log(URL + this.path + UPLOAD, File);
    var obj = document.getElementById("errorContent").style.display = "none";
    return Observable.create(observer => {
      var formData:any = new FormData();
      formData.append("file", file);
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
          if (xhr.status == 200) {
            observer.next(JSON.parse(xhr.response));
          } else {
            observer.error(xhr.response);
            var obj = document.getElementById("errorContent").style.display = "block";
            document.getElementById("errorMessage").innerHTML = xhr.response;
          }
          observer.complete();
        }
      }
      xhr.open("POST", URL + this.path + UPLOAD, true);
      xhr.send(formData);
    });
  }
}
