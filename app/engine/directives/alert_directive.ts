import {Component, ElementRef, Input, Output, EventEmitter} from "angular2/core";
import {MdDialog} from "ng2-material/all";
import {MdDialogConfig, MdDialogBasic} from "ng2-material/components/dialog/dialog";
import {TranslateService} from 'ng2-translate/ng2-translate';
import {Observable} from 'rxjs/Observable';

const DIALOG_ALERT_TITLE = "DIALOG.ALERT.TITLE";
const DIALOG_ALERT_OK = "DIALOG.ALERT.OK";

@Component({
    selector: 'alert',
    template: `<div (click)="alert()"><ng-content></ng-content></div>`,
    providers: [MdDialog]
})
export class AlertDirective {

    @Input() text;
    @Output() event: EventEmitter<any> = new EventEmitter();

    constructor(public dialog:MdDialog, public element:ElementRef, private translate:TranslateService) {
    }

    alert() {
        this.translate.get([this.text, DIALOG_ALERT_TITLE, DIALOG_ALERT_OK]).subscribe((value) => {
            let config = new MdDialogConfig()
                .textContent(value[this.text])
                .title(value[DIALOG_ALERT_TITLE])
                .ok(value[DIALOG_ALERT_OK])
            this.dialog.open(<any>MdDialogBasic, this.element, config);
            this.event.next("");
        });
    }

}
