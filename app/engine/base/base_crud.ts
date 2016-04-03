import {TranslateService} from 'ng2-translate/ng2-translate';
import {Observable} from 'rxjs/Observable';

import {UrlService} from '../services/url_service';
import {Logger} from '../log/logger';
import {Settings} from '../../settings';

export class BaseCrud {

  info:String = "";
  error:String = "";
  userConnect;

  constructor(private _translate: TranslateService) {

  }

  ngDoCheck() {
    if (this.userConnect != Settings.USER) {
      this.userConnect = Settings.USER;
    }
  }

  disabled(id) {
    return !(id == Settings.USER.id || Settings.USER.role == "ADMIN");
  }

  disabledAdmin() {
    return !(Settings.USER.role == "ADMIN");
  }

  getError(data) {
    return Observable.create(observer => {
      let hasError = false;
      if (data.status == 200) {
        if (data.type == " METIER") {
          hasError = true;
          observer.next(data.message);
        }
        if (data.type == "REQUIRED") {
          hasError = true;
          this._translate.get([data.field, "REQUIRED"]).subscribe(value => {
            Logger.log((value[data.field] + " " + value["REQUIRED"]));
            observer.next((value[data.field] + " " + value["REQUIRED"]));
            observer.complete();
          });
        }
      }
      if (data.status == 500) {
        hasError = true;
        observer.next(data.exception);
      }
      if (!hasError) {
        observer.next("")
      }
      observer.complete();
    });
  }

  hasError(data) {
    return Observable.create(observer => {
      this.info = "";
      this.getError(data).subscribe((error) => {
        this.error = error;
        if (this.error == "") {
          observer.next(data);
        } else {
          observer.error(this.error);
        }
        observer.complete();
      });
    });
  }

  fieldRequire(...values) {
    for (let i = 0; i < values.length; i++) {
      if (values[i] == '' || values[i] == undefined) {
        return true;
      }
    }
    return false;
  }

}