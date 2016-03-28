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

  getUrl(url) {
    Logger.log(url);
    var obj = document.getElementById("errorContent").style.display = "none";
    return  Observable.create(observer => {
      this.http.get(url)
          .map(res => res.json())
          .subscribe((data) => this.resolve(data, observer), (error) => this.handleError(error, observer));
    });
  }

  postUrl(url, json) {
    Logger.log(url, json);
    var obj = document.getElementById("errorContent").style.display = "none";
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return  Observable.create(observer => {
      this.http.post(url, JSON.stringify(json), {headers:headers})
        .map(res => res.json())
        .subscribe((data) => this.resolve(data, observer), (error) => this.handleError(error, observer));
    });
  }

  resolve(data, observer) {
    Logger.log(data);
    if (data.status == 500) {
      var obj = document.getElementById("errorContent").style.display = "block";
      document.getElementById("errorMessage").innerHTML = data.stacktrace;
    }
    observer.next(data);
    observer.complete();
  }

  handleError(error, observer) {
    console.error(error);
    var obj = document.getElementById("errorContent").style.display = "block";
    document.getElementById("errorMessage").innerHTML = error.json().error || 'Server error';
    observer.error(error.json().error || 'Server error');
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
