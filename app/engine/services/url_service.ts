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

  constructor(public http:Http, public path) {
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
    var errorText = error || 'Server error';
    window.document.getElementById("errorMessage").innerText = error.status;
    observer.error(errorText);
    observer.complete();
  }

  getHeaders(json = false) {
    var headers = new Headers();
    headers.append('Authorization', Settings.TOKEN.NAME + '$$$$' + Settings.TOKEN.VALUE);
    if (json) {
      headers.append('Content-Type', 'application/json');
    }
    return headers;
  }

  lauthGetUrl(url, observer) {
    Logger.log(url);
    this.http.get(url, {headers: this.getHeaders()})
        .map(res => res.json())
        .subscribe((data) => this.resolve(data, observer), (error) => this.handleError(error, observer));
  }

  lauthPostUrl(url, json, observer) {
    Logger.log(url, json);
    this.http.post(url, JSON.stringify(json), {headers: this.getHeaders(true)})
        .map(res => res.json())
        .subscribe((data) => this.resolve(data, observer), (error) => this.handleError(error, observer));
  }

  launchUrl(url, json, type) {
    document.getElementById("errorContent").style.display = "none";
    if (Settings.TOKEN.NAME == '') {
      Settings.TOKEN.NAME = Math.random().toString(36).substring(2);
    }
    if (1) {
      return Observable.create(observer => {
        Logger.log(URL + "/token?name=" + Settings.TOKEN.NAME);
        var headers = new Headers();
        headers.append('Authorization', 'generate');
        headers.append('content-Type', 'application/json');
        this.http.get(URL + "/token?name=" + Settings.TOKEN.NAME, {headers:headers}).map(res => res.json()).subscribe((data) => {
          Logger.log(data)
          if (data["generate"] && data["generate"] == "1") {
            Settings.TOKEN.NAME = data["name"];
            Settings.TOKEN.VALUE = data["token"];
            Settings.TOKEN.DATE = data["date"];
          }
          if (type == "GET") {
            this.lauthGetUrl(url, observer);
          }
          if (type == "POST") {
            this.lauthPostUrl(url, json, observer);
          }
        }, (error) => this.handleError(error, observer));
      });
    } else {
      Logger.log("Sans demande de jeton");
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
            console.log(xhr.response);
            if (xhr.response != "") {
              observer.next(JSON.parse(xhr.response));
            }
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
