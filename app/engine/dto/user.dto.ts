
export class UserDto {
    username;
    password;
    passwordConfirm;
    email;
    emailConfirm;

    constructor (username = '', password = '') {
        this.username = username;
        this.password = password;
    }
}