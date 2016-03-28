import {Component} from 'angular2/core';
import {MATERIAL_DIRECTIVES} from "ng2-material/all";
import {bootstrap} from 'angular2/platform/browser';
import {TranslateService, TranslatePipe} from 'ng2-translate/ng2-translate';

@Component({
  selector: 'home',
  templateUrl: 'dist/components/home/home.html',
  directives: [MATERIAL_DIRECTIVES],
  pipes: [TranslatePipe]
})
export class HomeCmp {

  constructor(private translate: TranslateService) {
  }

}