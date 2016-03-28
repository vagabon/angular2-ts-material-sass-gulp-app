import {Component, ElementRef} from 'angular2/core';
import {MATERIAL_DIRECTIVES, MdDialog} from "ng2-material/all";
import {TranslateService, TranslatePipe} from 'ng2-translate/ng2-translate';
import {MdDialogConfig, MdDialogBasic, MdDialogRef} from "ng2-material/components/dialog/dialog";

@Component({
  selector: 'about',
  templateUrl: 'dist/components/about/about.html',
  providers: [MdDialog],
  directives: [MATERIAL_DIRECTIVES],
  pipes: [TranslatePipe]
})
export class AboutCmp {

  determinateValue = 0;
  interval = null;
  rewinds = [];

  constructor(private translate: TranslateService, private dialog: MdDialog, private element: ElementRef) {
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

  stop(ev) {
    if (this.interval == null) {
      let config = new MdDialogConfig()
          .textContent('This progress bar cannot be stopped i said !!!')
          .title('Please stop')
          .ok('--')
          .targetEvent(ev);
      this.dialog.open(<any>MdDialogBasic, this.element, config);
      this.start();
    } else {
      let config = new MdDialogConfig()
        .textContent('Congratz you stop the progress bar !')
        .title('OMG')
        .ok('Yeah !')
        .targetEvent(ev);
      this.dialog.open(<any>MdDialogBasic, this.element, config);
      clearInterval(this.interval);
      this.interval = null;
    }
  }
}
