import {TranslateService} from 'ng2-translate/ng2-translate';
import {Observable} from 'rxjs/Observable';

import {Logger} from '../log/logger';

export class BaseApp {

  active:String = "";
  isScroll:Boolean = false;

  constructor(private _translate: TranslateService) {
    var userLang = navigator.language.split('-')[0];
    userLang = /(fr|en)/gi.test(userLang) ? userLang : 'fr';
    _translate.setDefaultLang('fr');
    _translate.use(userLang);
    _translate.get("TITLE").subscribe((value) => document.title  = value);
  }

  ngAfterContentChecked() {
    if(window.location.hash) {
      let hashComplete = window.location.hash.substring(1);
      let hash = hashComplete.split("/");
      if (hash[1] && hash[1] != this.active) {
        this.active = hash[1];
      }
    }
  }

  onScroll(event) {
    var body = document.body,
        html = document.documentElement;
    var height = Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
    if (event) {
      if (window.scrollY == 0 || (height - window.outerHeight <= -100)) {
        this.isScroll = false;
      } else if (!this.isScroll) {
        this.isScroll = true;
      }
    }
  }
}