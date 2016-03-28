import {Component, ViewEncapsulation, Input} from 'angular2/core';
import {MATERIAL_DIRECTIVES} from "ng2-material/all";

@Component({
    selector: 'my-title',
    template: `
            <md-card-title class="noFlex">
                <md-card-title-media *ngIf="img != ''">
                    <img src="{{img}}" class="card-media md-media-lg" alt="Grass">
                </md-card-title-media>
                <md-card-title-text>
                    <ng-content></ng-content>
                </md-card-title-text>
            </md-card-title>
    `,
    encapsulation: ViewEncapsulation.None
})
export class CardTitleDirective {
    @Input() img: string;
}
