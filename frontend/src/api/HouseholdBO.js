import BusinessObject from './BusinessObject';

/**
 * Represents a Household object.
 */
export default class HouseholdBO extends BusinessObject {

    constructor(aHousehold_name, aOwner_id) {
        super();
        this.household_name = aHousehold_name;
        this.owner_id = aOwner_id
    }

    getHouseholdName() {
        return this.household_name;
    }

    setHouseholdName(aHousehold_name) {
        this.household_name = aHousehold_name;
    }

    static fromJSON(household) {
        let result = [];

        if (Array.isArray(household)) {
            household.forEach((a) => {
                Object.setPrototypeOf(a, HouseholdBO.prototype);
                result.push(a);
            })
        } else {
            let a = household;
            Object.setPrototypeOf(a, HouseholdBO.prototype);
            result.push(a);
        }

        return result;
    }
}