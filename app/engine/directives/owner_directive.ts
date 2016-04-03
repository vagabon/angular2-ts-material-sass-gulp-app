import {Directive, Input, ElementRef} from "angular2/core";
import {Settings} from "../../settings"

@Directive({
    selector: '[owner]'
})
export class OwnerDirective {

    @Input() owner:number;

    constructor(private el: ElementRef) {
    }

    ngOnInit() {
        if (!(this.owner == Settings.USER.id || Settings.USER.role == "ADMIN")) {
            this.el.nativeElement.style.display = "none";
        }
    }
}