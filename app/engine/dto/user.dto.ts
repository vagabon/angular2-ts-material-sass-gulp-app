
export class UserDto {
    username;
    password;

    constructor (username = '', password = '') {
        this.username = username;
        this.password = password;
    }
}