import BusinessObject from './BusinessObject';

/**
 * Represents a Measure object.
 */
export default class MeasureBO extends BusinessObject {

    constructor(unit, household_id) {
        super();
        this.unit = unit;
        this.household_id = null;
    }

    getUnit() {
        return this.unit;
    }

    setUnit(unit) {
        this.unit = unit;
    }

    getHouseholdId() {
        return this.household_id;
    }

    setHouseholdId(household_id) {
        this.household_id = household_id;
    }

    static fromJSON(grocery) {
        let result = [];

        if (Array.isArray(grocery)) {
            grocery.forEach((a) => {
                Object.setPrototypeOf(a, MeasureBO.prototype);
                result.push(a);
            })
        } else {
            let a = grocery;
            Object.setPrototypeOf(a, MeasureBO.prototype);
            result.push(a);
        }

        return result;
    }
}

