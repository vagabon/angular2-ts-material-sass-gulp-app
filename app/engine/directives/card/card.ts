import {Component, ViewEncapsulation, Input} from 'angular2/core';

@Component({
    selector: 'card',
    template: `
        <md-card>
                <ng-content></ng-content>
        </md-card>
    `,
    encapsulation: ViewEncapsulation.None
})
export class CardDirective {
}

@Component({
    selector: 'card-title',
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