import {Component, ViewEncapsulation, Input} from 'angular2/core';
import {MATERIAL_DIRECTIVES} from "ng2-material/all";

@Component({
    selector: 'card-content',
    template: `
            <md-card-content>
                <ng-content></ng-content>
            </md-card-content>
    `,
    encapsulation: ViewEncapsulation.None
})
export class CardContentDirective {
}
