import {Component} from 'angular2/core';
import {TranslateService} from 'ng2-translate/ng2-translate';

@Component({
  selector: 'home',
  templateUrl: 'dist/components/home/home.html'
})
export class HomeCmp {

  constructor(private translate: TranslateService) {
  }

}