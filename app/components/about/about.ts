import {Component, ElementRef} from 'angular2/core';
import {TranslateService} from 'ng2-translate/ng2-translate';
import {MdDialogConfig, MdDialogBasic, MdDialogRef} from "ng2-material/components/dialog/dialog";

@Component({
  selector: 'about',
  templateUrl: 'components/about/about.html'
})
export class AboutCmp {

  determinateValue = 0;
  interval = null;
  rewinds = [];

  constructor(private translate: TranslateService) {
    for (let i = 0; i < 11; i++) {
      this.rewinds[i] = {
        url: "ABOUT.CARD" + i + ".URL",
        img: "ABOUT.CARD" + i + ".IMG",
        content: "ABOUT.CARD" + i + ".CONTENT"
      };
    }
    this.start();
  }

  start() {
    this.interval = setInterval(() => {
      this.determinateValue += 1;
      if (this.determinateValue > 100) {
        this.determinateValue = 0;
      }
    }, 100, 0, true);
  }

  stop() {
    if (this.interval == null) {
      this.start();
    } else {
      clearInterval(this.interval);
      this.interval = null;
    }
  }
}
