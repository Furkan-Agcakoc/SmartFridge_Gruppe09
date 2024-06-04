import BusinessObject from './BusinessObject';

/**  Represents a User object  **/

export default class UserBO extends BusinessObject {

    constructor(aFirstname, aLastname, aNickname, aEmail, aGoogle_user_id) {
        super();
        this.firstname = aFirstname;
        this.lastname = aLastname;
        this.nickname = aNickname;
        this.email = aEmail;
        this.google_user_id = aGoogle_user_id;
    }

    setFirstname(aFirstname) {
        this.firstname = aFirstname;
    }

    getFirstname() {
        return this.firstname;
    }

    setLastname(aLastname) {
        this.lastname = aLastname;
    }

    getLastname() {
        return this.lastname;
    }

    setNickname(aNickname) {
        this.nickname = aNickname;
    }

    getNickname() {
        return this.nickname;
    }

    setEmail(aEmail) {
        this.email = aEmail;
    }

    getEmail(){
        return this.email;
    }

    setGoogle_user_id(aGoogle_user_id) {
        this.google_user_id = aGoogle_user_id;
    }

    getGoogle_user_id() {
        return this.google_user_id;
    }

    static fromJSON(user) {
        let result = [];

        if (Array.isArray(user)) {
            user.forEach((a) => {
                Object.setPrototypeOf(a, UserBO.prototype);
                result.push(a);
            })
        } else {
            let a = user;
            Object.setPrototypeOf(a, UserBO.prototype);
            result.push(a);
        }

        return result;
    }
}