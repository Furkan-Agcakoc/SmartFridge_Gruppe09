import BusinessObject from './BusinessObject';

/**
 * Represents a Fridge object.
 */
export default class FridgeBO extends BusinessObject {

    constructor(aFridge_name, aHousehold_id) {
        super();
        this.fridge_name = aFridge_name;
        this.household_id = aHousehold_id;
    }

    setFridgeName(aFridge_name) {
        this.fridge_name = aFridge_name;
    }

    getFridgeName() {
        return this.fridge_name;
    }

    getHouseholdId() {
        return this.household_id;
    }

    setHouseholdId(aHousehold_id) {
        this.household_id = aHousehold_id;
    }


    static fromJSON(fridge) {
        let result = [];

        if (Array.isArray(fridge)) {
            fridge.forEach((a) => {
                Object.setPrototypeOf(a, FridgeBO.prototype);
                result.push(a);
            })
        } else {
            let a = fridge;
            Object.setPrototypeOf(a, FridgeBO.prototype);
            result.push(a);
        }

        return result;
    }

}