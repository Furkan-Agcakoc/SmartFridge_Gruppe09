import BusinessObject from "./BusinessObject";

/**
 * Represents a Grocerystatement object.
 */
export default class GroceryStatementBO extends BusinessObject {
  constructor(aGrocery_id, aUnit_id, aQuantity) {
    super();
    this.grocery_id = aGrocery_id;
    this.unit_id = aUnit_id;
    this.quantity = aQuantity;
  }

  setGroceryName(aGrocery_id) {
    this.grocery_id = aGrocery_id;
  }

  getGroceryName() {
    return this.grocery_id;
  }

  setUnit(aUnit_id) {
    this.unit_id = aUnit_id;
  }

  getUnit() {
    return this.unit_id;
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
        Object.setPrototypeOf(a, GroceryStatementBO.prototype);
        result.push(a);
      });
    } else {
      let a = grocerystatement;
      Object.setPrototypeOf(a, GroceryStatementBO.prototype);
      result.push(a);
    }

    return result;
  }
}
