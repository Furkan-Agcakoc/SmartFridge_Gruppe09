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

  setGroceryId(aGrocery_id) {
    this.grocery_id = aGrocery_id;
  }

  getGroceryId() {
    return this.grocery_id;
  }

  setUnitId(aUnit) {
    this.unit_id = aUnit;
  }

  getUnitId() {
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
