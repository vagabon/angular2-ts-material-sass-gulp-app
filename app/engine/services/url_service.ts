import {Injectable} from 'angular2/core';
import {Http, Headers} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';

import {Logger} from '../log/logger';
import {Settings} from "../../settings";
import {UserDto} from '../dto/user.dto';

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

  constructor(public http:Http, public path = "") {
  }

  showHtmlError(error = '') {
    if (document.getElementById("errorMessage")) {
      if (error != null && error != undefined && error != '') {
        document.getElementById("errorContent").style.display = "block";
        document.getElementById("errorMessage").innerHTML = error;
      } else {
        document.getElementById("errorContent").style.display = "none";
      }
    }
  }

  resolve(data, observer) {
    Logger.log(data);
    if (data.status == 500) {
      this.showHtmlError(data.stacktrace);
    }
    observer.next(data);
    observer.complete();
  }

  handleError(error, observer) {
    console.error(error);
    this.showHtmlError(error.status);
    var errorText = error || 'Server error';
    if (error.status == 401) {
      Settings.TOKEN = '';
      Settings.USER = { id: 0, 'username': '', 'role': '' };
      localStorage.removeItem("USER");
      localStorage.removeItem("TOKEN");
    }
    observer.error(errorText);
    observer.complete();
  }

  getHeaders(json = false) {
    var headers = new Headers();
    headers.append('Authorization', Settings.TOKEN);
    if (json) {
      headers.append('Content-Type', 'application/json');
    }
    return headers;
  }

  lauthGetUrlObserver(url, observer) {
    Logger.log(url);
    this.http.get(url, {headers: this.getHeaders()})
        .map(res => res.json())
        .subscribe((data) => this.resolve(data, observer), (error) => this.handleError(error, observer));
  }

  lauthPostUrlObserver(url, json, observer) {
    Logger.log(url, json);
    this.http.post(url, JSON.stringify(json), {headers: this.getHeaders(true)})
        .map(res => res.json())
        .subscribe((data) => this.resolve(data, observer), (error) => this.handleError(error, observer));
  }

  launchUrlObserver(url, json, type, observer) {
    this.showHtmlError();
    if (type == "GET") {
      this.lauthGetUrlObserver(url, observer);
    }
    if (type == "POST") {
      this.lauthPostUrlObserver(url, json, observer);
    }

  }

  login(user:UserDto, encrypte = false, reload = false) {
    this.showHtmlError();
    return Observable.create(observer => {
      Logger.log(URL + "/login" + (reload ? "?reload=true" : ""));
      this.http.post(URL + "/login" + (reload ? "?reload=true" : ""), JSON.stringify(new UserDto(user.username, encrypte ? btoa(user.password) : user.password)), {headers: this.getHeaders(true)})
          .map(res => res.json()).subscribe((data) => {
            console.log(data["token"])
            if (data["token"] && data["token"] != "") {
              Settings.USER = data["user"];
              Settings.TOKEN = data["token"];
              Logger.log(Settings.TOKEN, Settings.USER);
              localStorage.setItem("USER", JSON.stringify(Settings.USER));
              localStorage.setItem("TOKEN", Settings.TOKEN);
            }
            observer.next(data);
          }, (error) => this.handleError(error, observer));
    });
  }

  getTokenStorage() {
    if (localStorage.getItem("TOKEN") != '') {
      Settings.TOKEN = localStorage.getItem("TOKEN");
    }
  }

  launchUrl(url, json, type) {
    this.showHtmlError();
    if (Settings.TOKEN == '' && Settings.TOKEN != null) {
      this.getTokenStorage();
      return Observable.create(observer => {
        this.login(new UserDto(Settings.USERNAME, Settings.PASSWORD), false, true).subscribe((data) => {
          this.launchUrlObserver(url, json, type, observer);
        }, (error) => this.handleError(error, observer));
      });
    } else {
      return Observable.create(observer => {
        this.launchUrlObserver(url, json, type, observer);
      });
    }
  }

  getUrl(url) {
    return this.launchUrl(url, {}, "GET");
  }

  postUrlBase(url, json) {
    return this.launchUrl(Settings.URL + url, json, "POST");
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
    this.showHtmlError();
    Logger.log("POST", URL + this.path + UPLOAD + "?token=" + Settings.TOKEN);
    return Observable.create(observer => {
      var formData:any = new FormData();
      formData.append("file", file);
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
          if (xhr.status == 200) {
            Logger.log(xhr.response);
            if (xhr.response != "") {
              observer.next(JSON.parse(xhr.response));
            }
          } else {
            observer.error(xhr.response);
            document.getElementById("errorContent").style.display = "block";
            document.getElementById("errorMessage").innerHTML = xhr.response;
          }
          observer.complete();
        }
      }
      xhr.open("POST", URL + this.path + UPLOAD + "?token=" + Settings.TOKEN, true);
      xhr.send(formData);
    });
  }
}
