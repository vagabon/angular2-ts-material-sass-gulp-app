import {TranslateService} from 'ng2-translate/ng2-translate';
import {Observable} from 'rxjs/Observable';

import {UrlService} from '../services/url_service';
import {Logger} from '../log/logger';

export class BaseCrud {

  info:String = "";
  error:String = "";

  constructor(private _translate: TranslateService) {

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

}