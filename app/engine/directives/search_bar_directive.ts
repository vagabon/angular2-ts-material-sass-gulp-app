import { Component, ViewEncapsulation, Input, Output, EventEmitter } from 'angular2/core';
import {MATERIAL_DIRECTIVES, MdDialog} from "ng2-material/all";

@Component({
    selector: 'search-bar',
    template: `
        <md-input-container class="md-block" flex-gt-sm>
          <button md-button class="md-icon-button" (click)="search()"><i md-icon>search</i></button>
          <input md-input [value]="value" [(ngModel)]="value" (change)="search()" placeholder="Search">
          <button md-button class="md-icon-button" (click)="clearSearch()"><i md-icon>clear</i></button>
        </md-input-container>
    `,
    directives: [MATERIAL_DIRECTIVES],
    encapsulation: ViewEncapsulation.None
})
export class SearchBarDirective {

    value:String;
    @Output() event: EventEmitter<any> = new EventEmitter();

    search() {
        this.event.next(this.value);
    }

    clearSearch() {
        this.value = "";
        this.event.next("");
    }
}
