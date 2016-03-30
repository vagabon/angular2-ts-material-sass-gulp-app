import {Component, ElementRef, Input, Output, EventEmitter} from "angular2/core";
import {MdDialogConfig, MdDialogBasic, MdDialogRef, MdDialog} from "ng2-material/all";
import {TranslateService} from 'ng2-translate/ng2-translate';

const DIALOG_CONFIRM_TITLE = "DIALOG.CONFIRM.TITLE";
const DIALOG_CONFIRM_YES = "DIALOG.CONFIRM.YES";
const DIALOG_CONFIRM_NO = "DIALOG.CONFIRM.NO";

@Component({
    selector: 'confirm',
    template: `<div (click)="confirm()"><ng-content></ng-content></div>`,
    providers: [MdDialog]
})
export class ConfirmDirective {

    @Input() text;
    @Output() event: EventEmitter<any> = new EventEmitter();

    constructor(public _dialog:MdDialog, public _element:ElementRef, private translate:TranslateService) {
    }

    confirm(id) {
        this.translate.get([this.text, DIALOG_CONFIRM_TITLE, DIALOG_CONFIRM_YES, DIALOG_CONFIRM_NO]).subscribe((value) => {
            let config = new MdDialogConfig()
                .textContent(value[this.text])
                .clickOutsideToClose(false)
                .title(value[DIALOG_CONFIRM_TITLE])
                .ariaLabel('Lucky day')
                .ok(value[DIALOG_CONFIRM_YES])
                .cancel(value[DIALOG_CONFIRM_NO]);
            this._dialog.open(<any>MdDialogBasic, this._element, config).then((ref:MdDialogRef) => {
                ref.whenClosed.then((result) => {
                    if (result) {
                        this.event.next(id);
                    }
                })
            });
        });
    }

}
