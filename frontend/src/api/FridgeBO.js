import BusinessObject from './BusinessObject';

/**
 * Represents a Fridge object.
 */
export default class FridgeBO extends BusinessObject {

/**
    constructor(aOwner) {
        super();
        this.owner = aOwner;
    }


    setFridge(aOwner) {
        this.owner = aOwner;
    }


    getOwner() {
        return this.owner;
    }


    static fromJSON(accounts) {
        let result = [];

        if (Array.isArray(accounts)) {
            accounts.forEach((a) => {
                Object.setPrototypeOf(a, AccountBO.prototype);
                result.push(a);
            })
        } else {
            // Es handelt sich offenbar um ein singuläres Objekt
            let a = accounts;
            Object.setPrototypeOf(a, AccountBO.prototype);
            result.push(a);
        }

        return result;
    }

**/

}