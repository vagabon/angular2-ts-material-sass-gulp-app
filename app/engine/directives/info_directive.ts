import { Component,Input } from 'angular2/core';
import {MATERIAL_DIRECTIVES, MdDialog} from "ng2-material/all";

@Component({
    selector: 'crud-info',
    template: `
        <md-content layout-padding *ngIf="error != ''" style="background-color: #c9c3c3;">
            <button md-button class="md-icon-button"><i md-icon>warning</i></button>
            {{error}}
        </md-content>
        <md-content layout-padding *ngIf="info != ''" style="background-color: #e0e0e0;">
            <button md-button class="md-icon-button"><i md-icon>info</i></button>
            {{info}}
        </md-content>
    `,
    directives: [MATERIAL_DIRECTIVES]
})
export class InfoDirective {

    @Input() info:any = "";
    @Input() error:any = "";

    search() {
    }
}
