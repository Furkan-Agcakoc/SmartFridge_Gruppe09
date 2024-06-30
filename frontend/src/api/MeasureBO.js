import BusinessObject from './BusinessObject';

/**
 * Represents a Measure object.
 */
export default class MeasureBO extends BusinessObject {

    constructor(unit, fridge_id) {
        super();
        this.unit = unit;
        this.fridge_id = fridge_id;
    }

    getUnit() {
        return this.unit;
    }

    setUnit(unit) {
        this.unit = unit;
    }

    getUnitId() {
        return this.id;
    }

    setUnitId(id) {
        this.id = id;
    }

    getFridgeId() {
        return this.fridge_id;
    }

    setFridgeId(fridge_id) {
        this.fridge_id = fridge_id;
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

