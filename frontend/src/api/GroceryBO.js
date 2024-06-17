import BusinessObject from './BusinessObject';

/**
 * Represents a Grocery object.
 */
export default class GroceryBO extends BusinessObject {

    constructor(aGrocery_name) {
        super();
        this.grocery_name = aGrocery_name;
    }

    setGroceryName(aGrocery_name) {
        this.grocery_name = aGrocery_name;
    }

    getGroceryName() {
        return this.grocery_name;
    }


    static fromJSON(grocery) {
        let result = [];

        if (Array.isArray(grocery)) {
            grocery.forEach((a) => {
                Object.setPrototypeOf(a, GroceryBO.prototype);
                result.push(a);
            })
        } else {
            let a = grocery;
            Object.setPrototypeOf(a, GroceryBO.prototype);
            result.push(a);
        }

        return result;
    }
}