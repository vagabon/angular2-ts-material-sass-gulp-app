import { Pipe } from 'angular2/core';

import {Settings} from "../../settings"

@Pipe({
    name: 'loginPipe'
})
export class LoginPipe {

    transform(value) {
        return Settings.TOKEN == '' ? '' : Settings.URL + "/user/getImage?image=" +value + "&token=" + Settings.TOKEN;
    }

}
