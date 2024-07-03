import BusinessObject from './BusinessObject';

/**
 * Represents a Recipe object.
 */
export default class RecipeBO extends BusinessObject {

    constructor(aRecipe_name, aDuration, aPortion, aInstruction, aUser_id, aFridge_id, aId) {
        super();
        this.recipe_name = aRecipe_name;
        this.duration = aDuration;
        this.portion = aPortion;
        this.instruction = aInstruction;
        this.user_id = aUser_id;
        this.fridge_id = aFridge_id;
        if (aId) {
            this.setID(aId);
        }
    }

    setRecipeName(aRecipe_name) {
        this.recipe_name = aRecipe_name;
    }

    getRecipeName() {
        return this.recipe_name;
    }

    setDuration(aDuration) {
        this.duration = aDuration;
    }

    getDuration() {
        return this.duration;
    }

    setPortion(aPortion) {
        this.portion = aPortion;
    }

    getPortion() {
        return this.portion;
    }

    setInstruction(aInstruction) {
        this.instruction = aInstruction;
    }

    getInstruction() {
        return this.instruction;
    }

    setUserId(aUser_id) {
        this.user_id = aUser_id;
    }

    getUserID() {
        return this.user_id;
    }

    getHouseholdId() {
        return this.fridge_id;
    }

    setHouseholdId(aFridge_id) {
        this.fridge_id = aFridge_id;
    }

    static fromJSON(recipe) {
        let result = [];

        if (Array.isArray(recipe)) {
            recipe.forEach((a) => {
                let obj = new RecipeBO(a.recipe_name, a.duration, a.portion, a.instruction, a.user_id, a.fridge_id, a.id);
                result.push(obj);
            });
        } else {
            let a = recipe;
            let obj = new RecipeBO(a.recipe_name, a.duration, a.portion, a.instruction, a.user_id, a.fridge_id, a.id);
            result.push(obj);
        }

        return result;
    }
}
