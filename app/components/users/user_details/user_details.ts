import {Component, Inject, OnInit} from 'angular2/core';
import {MATERIAL_DIRECTIVES} from "ng2-material/all";
import {TranslateService, TranslatePipe} from 'ng2-translate/ng2-translate';
import {RouteParams, RouterLink} from 'angular2/router';
import {FORM_DIRECTIVES} from "angular2/common";

import {UserService} from '../services/user_service';
import {Logger, ImagePipe, InfoDirective, BaseCrud} from '../../../engine/all';

@Component({
  selector: 'user-details',
  templateUrl: 'dist/components/users/user_details/user_details.html',
  providers: [UserService],
  directives: [RouterLink, MATERIAL_DIRECTIVES, InfoDirective],
  pipes: [TranslatePipe, ImagePipe]
})
export class UserDetailsCmp extends BaseCrud implements OnInit {

  username:String = '';
  user:any = null;
  userId: Number;
  imageAvatar: File = null;

  constructor(@Inject(RouteParams) routeParams, private translate: TranslateService, private urlService:UserService) {
    super(translate);
    this.userId = parseInt(routeParams.params.userId);
  }

  convertDate(inputFormat) {
    function pad(s) { return (s < 10) ? '0' + s : s; }
    var d = new Date(inputFormat);
    return [d.getFullYear(), pad(d.getMonth()+1), pad(d.getDate())].join('-');
  }

  isValidDate(value) {
    var dateWrapper = new Date(value);
    return !isNaN(dateWrapper.getDate());
  }

  ngOnInit() {
    let exist = this.userId && typeof this.userId === "number" && this.userId >= 0;
    if (!exist) {
      this.userId = null;
      this.user = { id: null};
    } else {
      this.urlService.findById(this.userId).subscribe(data => {
            if (data[0]) {
              if (!exist) {
                this.user = {};
                for (var key in data[0]) {
                  this.user[key] = null;
                }
              } else {
                this.user = data[0];
                for (var key in this.user) {
                  if (this.isValidDate(this.user[key]) && typeof this.user[key] === "number" && key != "id") {
                    this.user[key] = this.convertDate(this.user[key]);
                  }
                }
                this.username = data[0].username;
              }
            }
          }
      );
    }
  }

  fileChangeEvent(fileInput) {
    this.imageAvatar = fileInput.target.files[0];
  }

  makeFileRequest(url: string, file: File) {
    return new Promise((resolve, reject) => {
      var formData: any = new FormData();
      formData.append("file", file);
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
          if (xhr.status == 200) {
            resolve(JSON.parse(xhr.response));
          } else {
            reject(xhr.response);
          }
        }
      }
      xhr.open("POST", url, true);
      xhr.send(formData);
    });
  }

  update() {
    this.urlService.update(this.user).subscribe((data) => {
      this.hasError(data).subscribe((data) => {
        this.info = this.user.id == null ? "L'utilisateur a été créé" : "L'utilisateur a été mis à jour";
        this.error = "";
        this.user.id = data.id;
        this.userId = data.id;
        this.ngOnInit();
      });
    });
  }

  sendForm() {
    if (this.imageAvatar != null) {
      this.urlService.upload(this.imageAvatar).subscribe((data) => {
        this.hasError(data).subscribe((data) => {
            this.user.image = data.image;
            this.update();
        });
      });
    } else {
      this.update();
    }

  }
}