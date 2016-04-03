import {Directive, Input, ElementRef} from "angular2/core";
import {Settings} from "../../settings"

@Directive({
    selector: '[hasRole]'
})
export class RoleDirective {

    @Input() hasRole;

    constructor(private el: ElementRef) {
    }

    ngOnInit() {
        let show = false;
        switch (this.hasRole) {
            case "ADMIN":
                show = Settings.USER.role == "ADMIN";
                break;
            case "USER":
                show = Settings.USER.role == "ADMIN" || Settings.USER.role == "USER";
                break;
            case "ANONYMOUS":
                show = Settings.USER.role == "ADMIN" || Settings.USER.role == "USER" || Settings.USER.role == "ANONYMOUS";
                break;
        }
        this.el.nativeElement.style.display = show ? "block" : "none";
    }
}
