import {Component, ElementRef} from 'angular2/core';
import {MdDialog} from "ng2-material/all";
import {MdDialogConfig, MdDialogBasic, MdDialogRef} from "ng2-material/components/dialog/dialog";
import {TranslateService} from 'ng2-translate/ng2-translate';

import {UserService} from '../services/user_service';
import {DialogDirective, Logger} from '../../../engine/all';

const MIN = 0;
const SHOW = 2;

@Component({
  selector: 'users-list',
  templateUrl: 'dist/components/users/users_list/users_list.html',
  providers: [MdDialog, ElementRef, UserService]
})
export class UsersListCmp {

  loading;
  dialog: DialogDirective;
  min = 0;
  users = [];

  constructor(private translate: TranslateService, private urlService:UserService,
              private mdDialog: MdDialog, private element: ElementRef) {
    this.dialog = new DialogDirective(mdDialog, element, translate);
    this.min = MIN;
  }

  ngOnInit() {
    Logger.log("init", this.min, this.users);
    this.show(false, this.min, SHOW);
  }

  show(reload = true, min = 0, show = this.min + SHOW) {
    if (reload) {
      this.users = [];
    }
    this.loading = true;
    this.urlService.findAll(min, show).subscribe(data => {
          Logger.log("getAll", this.min, this.users)
          if (reload) {
            this.users = data;
          } else {
            for (var i = 0; i < data.length; i++) {
              this.users.push(data[i]);
            }
          }
          this.loading = false;
        }, (error) => this.loading = false
    );
  }

  search(search) {
    this.min = 0;
    this.loading = true;
    this.urlService.findByUsername(search, this.min, SHOW).subscribe(data => {
        this.users = data;
        this.loading = false;
      }, (error) => this.loading = false
    );
    return true;
  }

  more() {
    this.min += SHOW;
    this.show(false, this.min, SHOW);
  }

  delete(userId) {
    this.dialog.confirm("USER.DELETE").subscribe(()=> {
      Logger.log("plouffff");
      this.urlService.delete(userId).subscribe(data => {
            this.show(true, 0, this.min + SHOW);
          }
      );
    });
  }

}
