import BusinessObject from './BusinessObject';

/**
 * Represents a Grocerystatement object.
 */
export default class GroceryStatementBO extends BusinessObject {

    constructor(aGrocery_name, aUnit, aQuantity) {
        super();
        this.grocery_name = aGrocery_name;
        this.unit = aUnit;
        this.quantity = aQuantity;
    }

    setGroceryName(aGrocery_name) {
        this.grocery_name = aGrocery_name;
    }

    getGroceryName() {
        return this.grocery_name;
    }

    setUnit(aUnit) {
        this.unit = aUnit;
    }

    getUnit() {
        return this.unit;
    }

    setQuantity(aQuantity) {
        this.quantity = aQuantity;
    }

    getQuantity() {
        return this.quantity;
    }

    static fromJSON(grocerystatement) {
        let result = [];

        if (Array.isArray(grocerystatement)) {
            grocerystatement.forEach((a) => {
                Object.setPrototypeOf(a, GrocerystatementBO.prototype);
                result.push(a);
            })
        } else {
            let a = grocerystatement;
            Object.setPrototypeOf(a, GrocerystatementBO.prototype);
            result.push(a);
        }

        return result;
    }
}