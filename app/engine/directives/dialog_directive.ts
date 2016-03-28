import {Injectable} from 'angular2/core';
import {Component, ElementRef} from "angular2/core";
import {MATERIAL_DIRECTIVES, MdDialog} from "ng2-material/all";
import {MdDialogConfig, MdDialogBasic, MdDialogRef} from "ng2-material/components/dialog/dialog";
import {TranslateService, TranslatePipe} from 'ng2-translate/ng2-translate';
import {Observable} from 'rxjs/Observable';

const DIALOG_CONFIRM_TITLE = "DIALOG.CONFIRM.TITLE";
const DIALOG_CONFIRM_YES = "DIALOG.CONFIRM.YES";
const DIALOG_CONFIRM_NO = "DIALOG.CONFIRM.NO";

@Component({
    selector: 'confirm',
    template: '',
})
export class DialogDirective {

    status = '';

    constructor(public _dialog:MdDialog, public _element:ElementRef, private translate:TranslateService) {
    }

    confirm(textContent) {
        return Observable.create(observer => {
            this.translate.get([textContent, DIALOG_CONFIRM_TITLE, DIALOG_CONFIRM_YES, DIALOG_CONFIRM_NO]).subscribe((value) => {

                let config = new MdDialogConfig()
                    .textContent(value[textContent])
                    .clickOutsideToClose(false)
                    .title(value[DIALOG_CONFIRM_TITLE])
                    .ariaLabel('Lucky day')
                    .ok(value[DIALOG_CONFIRM_YES])
                    .cancel(value[DIALOG_CONFIRM_NO]);
                this._dialog.open(<any>MdDialogBasic, this._element, config).then((ref:MdDialogRef) => {
                    ref.whenClosed.then((result) => {
                        if (result) {
                            observer.next();
                            observer.complete();
                        }
                    })
                });
            });
        });
    }

}
