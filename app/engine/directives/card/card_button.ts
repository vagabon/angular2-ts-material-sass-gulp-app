import {Component, ViewEncapsulation, Input} from 'angular2/core';
import {MATERIAL_DIRECTIVES} from "ng2-material/all";

@Component({
    selector: 'card-button',
    template: `
        <md-card-actions layout="row" layout-align="end center">
                <ng-content></ng-content>
        </md-card-actions>
    `,
    encapsulation: ViewEncapsulation.None
})
export class CardButtonDirective {

}
