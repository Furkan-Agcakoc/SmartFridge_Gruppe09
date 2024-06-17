import FridgeBO from "./FridgeBO";
import GroceryBO from "./GroceryBO";
import GroceryStatementBO from "./GroceryStatementBO";
import HouseholdBO from "./HouseholdBO";
import InhabitantBO from "./InhabitantBO";
import RecipeBO from "./RecipeBO";
import UserBO from "./UserBO";

export default class SmartFridgeAPI {
  // Singelton instance
  static #api = null;

  // Local Python backend
  #SmartFridgeBaseURL = "http://127.0.0.1:5000/Smartfridge";
  /**
   * Get the Singelton instance
   *
   * @public
   */
  static get api() {
    if (this.#api == null) {
      this.#api = new SmartFridgeAPI();
    }
    return this.#api;
  }

  // fridge related
  #getFridgeURL = () => `${this.#SmartFridgeBaseURL}/fridge`;
  #addFridgeURL = () => `${this.#SmartFridgeBaseURL}/fridge`;
  #getFridgeByIdURL = (id) => `${this.#SmartFridgeBaseURL}/fridge/${id}`;
  #updateFridgeURL = (id) => `${this.#SmartFridgeBaseURL}/customers/${id}`;
  #deleteFridgeURL = (id) => `${this.#SmartFridgeBaseURL}/customers/${id}`;

  // grocery related
  #getGroceryURL = () => `${this.#SmartFridgeBaseURL}/grocery`;
  #getGroceryByIdURL = (id) =>
    `${this.#SmartFridgeBaseURL}/grocery/${id}/accounts`;
  #getGroceryByNameURL = (grocery_name) =>
    `${this.#SmartFridgeBaseURL}/grocery/${grocery_name}`;
  #addGroceryURL = () => `${this.#SmartFridgeBaseURL}/grocery`;
  #deleteGroceryURL = (id) => `${this.#SmartFridgeBaseURL}/grocery/${id}`;
  #updateGroceryURL = (id) => `${this.#SmartFridgeBaseURL}/grocery/${id}`;

  // groceryStatement related
  #getGroceryStatementURL = () =>
    `${this.#SmartFridgeBaseURL}/groceryStatement/}`;
  #getGroceryStatementByIdURL = (id) =>
    `${this.#SmartFridgeBaseURL}/groceryStatement/${id}`;
  #addGroceryStatementURL = () =>
    `${this.#SmartFridgeBaseURL}/groceryStatement`;
  #deleteGroceryStatementURL = (id) =>
    `${this.#SmartFridgeBaseURL}/groceryStatement/${id}`;
  #updateGroceryStatementURL = (id) =>
    `${this.#SmartFridgeBaseURL}/groceryStatement/${id}`;

  // household related
  #getHouseholdURL = () => `${this.#SmartFridgeBaseURL}/household/}`;
  #getHouseholdByIdURL = (id) => `${this.#SmartFridgeBaseURL}/household/${id}`;
  #addHouseholdURL = () => `${this.#SmartFridgeBaseURL}/household`;
  #deleteHouseholdURL = (id) => `${this.#SmartFridgeBaseURL}/household/${id}`;
  #updateHouseholdURL = (id) => `${this.#SmartFridgeBaseURL}/household/${id}`;

  // inhabitant related
  #addInhabitantURL = () => `${this.#SmartFridgeBaseURL}/inhabitant`;
  #getInhabitantURL = (household_id) =>
    `${this.#SmartFridgeBaseURL}/inhabitant/${household_id}`;
  #deleteInhabitantURL = (id) => `${this.#SmartFridgeBaseURL}/inhabitant/${id}`;

  // recipe related
  #getRecipeURL = () => `${this.#SmartFridgeBaseURL}/recipe/}`;
  #getRecipeByNameURL = (recipe_name) =>
    `${this.#SmartFridgeBaseURL}/recipe/${recipe_name}}`;
  #getRecipeByIdURL = (id) => `${this.#SmartFridgeBaseURL}/recipe/${id}`;
  #addRecipeURL = () => `${this.#SmartFridgeBaseURL}/recipe`;
  #deleteRecipeURL = (id) => `${this.#SmartFridgeBaseURL}/recipe/${id}`;
  #updateRecipeURL = (id) => `${this.#SmartFridgeBaseURL}/recipe/${id}`;

  // user related
  #getUserURL = () => `${this.#SmartFridgeBaseURL}/user/}`;
  #getUserByGoogleIdURL = (google_user_id) =>
    `${this.#SmartFridgeBaseURL}/user/google_user_id/${google_user_id}}`;
  #getUserByIdURL = (id) => `${this.#SmartFridgeBaseURL}/user/${id}`;
  #addUserURL = () => `${this.#SmartFridgeBaseURL}/user`;
  #deleteUserURL = (id) => `${this.#SmartFridgeBaseURL}/user/${id}`;
  #updateUserURL = (id) => `${this.#SmartFridgeBaseURL}/user/${id}`;

  /**
   *  Returns a Promise which resolves to a json object.
   *  The Promise returned from fetch() won’t reject on HTTP error status even if the response is an HTTP 404 or 500.
   *  fetchAdvanced throws an Error also an server status errors
   **/
  #fetchAdvanced = (url, init) =>
    fetch(url, init).then((res) => {
      // The Promise returned from fetch() won’t reject on HTTP error status even if the response is an HTTP 404 or 500.
      if (!res.ok) {
        throw Error(`${res.status} ${res.statusText}`);
      }
      return res.json();
    });

  /**  fridge related  **/

  getFridge() {
    return this.#fetchAdvanced(this.#getFridgeURL()).then((responseJSON) => {
      let fridgeBO = FridgeBO.fromJSON(responseJSON);
      return new Promise(function (resolve) {
        resolve(fridgeBO);
      });
    });
  }

  getFridgeById(fridgeID) {
    return this.#fetchAdvanced(this.#getFridgeByIdURL(fridgeID)).then(
      (responseJSON) => {
        let responseFridgeBO = FridgeBO.fromJSON(responseJSON)[0];
        return new Promise(function (resolve) {
          resolve(responseFridgeBO);
        });
      }
    );
  }

  addFridge(fridgeBO) {
    return this.#fetchAdvanced(this.#addFridgeURL(), {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain",
        "Content-type": "application/json",
      },
      body: JSON.stringify(fridgeBO),
    }).then((responseJSON) => {
      let responseFridgeBO = FridgeBO.fromJSON(responseJSON)[0];
      return new Promise(function (resolve) {
        resolve(responseFridgeBO);
      });
    });
  }

  updateFridge(fridgeBO) {
    return this.#fetchAdvanced(this.#updateFridgeURL(fridgeBO.getID()), {
      method: "PUT",
      headers: {
        Accept: "application/json, text/plain",
        "Content-type": "application/json",
      },
      body: JSON.stringify(FridgeBO),
    }).then((responseJSON) => {
      let responseFridgeBO = FridgeBO.fromJSON(responseJSON)[0];
      return new Promise(function (resolve) {
        resolve(responseFridgeBO);
      });
    });
  }

  deleteFridge(fridgeID) {
    return this.#fetchAdvanced(this.#deleteFridgeURL(fridgeID), {
      method: "DELETE",
    }).then((responseJSON) => {
      let responseFridgeBO = FridgeBO.fromJSON(responseJSON)[0];
      return new Promise(function (resolve) {
        resolve(responseFridgeBO);
      });
    });
  }

  /**  grocery related  **/

  getGrocery() {
    return this.#fetchAdvanced(this.#getGroceryURL()).then((responseJSON) => {
      let groceryBOs = GroceryBO.fromJSON(responseJSON);
      return new Promise(function (resolve) {
        resolve(groceryBOs);
      });
    });
  }

  getGroceryById(groceryID) {
    return this.#fetchAdvanced(this.#getGroceryByIdURL(groceryID)).then(
      (responseJSON) => {
        let responseGroceryBO = GroceryBO.fromJSON(responseJSON);
        return new Promise(function (resolve) {
          resolve(responseGroceryBO);
        });
      }
    );
  }

  getGroceryByName(groceryName) {
    return this.#fetchAdvanced(this.#getGroceryByNameURL(groceryName)).then(
      (responseJSON) => {
        let responseGroceryBO = GroceryBO.fromJSON(responseJSON)[0];
        return new Promise(function (resolve) {
          resolve(responseGroceryBO);
        });
      }
    );
  }

  deleteGrocery(groceryID) {
    return this.#fetchAdvanced(this.#deleteGroceryURL(groceryID), {
      method: "DELETE",
    }).then((responseJSON) => {
      let responseGroceryBOs = GroceryBO.fromJSON(responseJSON)[0];
      return new Promise(function (resolve) {
        resolve(responseGroceryBOs);
      });
    });
  }

  addGrocery(groceryBO) {
    return this.#fetchAdvanced(this.#addGroceryURL(), {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain",
        "Content-type": "application/json",
      },
      body: JSON.stringify(groceryBO),
    }).then((responseJSON) => {
      let responseGroceryBO = GroceryBO.fromJSON(responseJSON)[0];
      return new Promise(function (resolve) {
        resolve(responseGroceryBO);
      });
    });
  }

  updateGrocery(groceryBO) {
    return this.#fetchAdvanced(this.#updateGroceryURL(groceryBO.getID()), {
      method: "PUT",
      headers: {
        Accept: "application/json, text/plain",
        "Content-type": "application/json",
      },
      body: JSON.stringify(groceryBO),
    }).then((responseJSON) => {
      let responseGroceryBO = GroceryBO.fromJSON(responseJSON)[0];
      return new Promise(function (resolve) {
        resolve(responseGroceryBO);
      });
    });
  }

  /**  GroceryStatement related **/

  getGroceryStatement() {
    return this.#fetchAdvanced(this.#getGroceryStatementURL()).then(
      (responseJSON) => {
        let groceryStatementBOs = GroceryStatementBO.fromJSON(responseJSON);
        return new Promise(function (resolve) {
          resolve(groceryStatementBOs);
        });
      }
    );
  }

  getGroceryStatementById(groceryStatementID) {
    return this.#fetchAdvanced(
      this.#getGroceryStatementByIdURL(groceryStatementID)
    ).then((responseJSON) => {
      let responseGroceryStatementBO =
        GroceryStatementBO.fromJSON(responseJSON);
      return new Promise(function (resolve) {
        resolve(responseGroceryStatementBO);
      });
    });
  }

  deleteGroceryStatement(groceryStatementID) {
    return this.#fetchAdvanced(
      this.#deleteGroceryStatementURL(groceryStatementID),
      {
        method: "DELETE",
      }
    ).then((responseJSON) => {
      let responseGroceryStatementBO =
        GroceryStatementBO.fromJSON(responseJSON)[0];
      return new Promise(function (resolve) {
        resolve(responseGroceryStatementBO);
      });
    });
  }

  addGroceryStatement(groceryStatementBO) {
    return this.#fetchAdvanced(this.#addGroceryStatementURL(), {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain",
        "Content-type": "application/json",
      },
      body: JSON.stringify(groceryStatementBO),
    }).then((responseJSON) => {
      let responseGroceryStatementBO =
        GroceryStatementBO.fromJSON(responseJSON)[0];
      return new Promise(function (resolve) {
        resolve(responseGroceryStatementBO);
      });
    });
  }

  updateGroceryStatement(groceryStatementBO) {
    return this.#fetchAdvanced(
      this.#updateGroceryStatementURL(groceryStatementBO.getID()),
      {
        method: "PUT",
        headers: {
          Accept: "application/json, text/plain",
          "Content-type": "application/json",
        },
        body: JSON.stringify(groceryStatementBO),
      }
    ).then((responseJSON) => {
      let responseGroceryStatementBO =
        GroceryStatementBO.fromJSON(responseJSON)[0];
      return new Promise(function (resolve) {
        resolve(responseGroceryStatementBO);
      });
    });
  }

  /** Household related  **/

  getHousehold() {
    return this.#fetchAdvanced(this.#getHouseholdURL()).then((responseJSON) => {
      let householdBOs = HouseholdBO.fromJSON(responseJSON);
      return new Promise(function (resolve) {
        resolve(householdBOs);
      });
    });
  }

  getHouseholdById(householdID) {
    return this.#fetchAdvanced(this.#getHouseholdByIdURL(householdID)).then(
      (responseJSON) => {
        let responseHouseholdBO = HouseholdBO.fromJSON(responseJSON);
        return new Promise(function (resolve) {
          resolve(responseHouseholdBO);
        });
      }
    );
  }

  deleteHousehold(householdID) {
    return this.#fetchAdvanced(this.#deleteHouseholdURL(householdID), {
      method: "DELETE",
    }).then((responseJSON) => {
      let responseHouseholdBO = HouseholdBO.fromJSON(responseJSON)[0];
      return new Promise(function (resolve) {
        resolve(responseHouseholdBO);
      });
    });
  }

  addHouseHold(householdBO) {
    console.log(JSON.stringify(householdBO));
    return this.#fetchAdvanced(this.#addHouseholdURL(), {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain",
        "Content-type": "application/json",
      },
      body: JSON.stringify(householdBO),
    }).then((responseJSON) => {
      let responseHouseholdBO = HouseholdBO.fromJSON(responseJSON)[0];
      return new Promise(function (resolve) {
        resolve(responseHouseholdBO);
      });
    });
  }

  updateHousehold(householdBO) {
    return this.#fetchAdvanced(this.#updateHouseholdURL(householdBO.getID()), {
      method: "PUT",
      headers: {
        Accept: "application/json, text/plain",
        "Content-type": "application/json",
      },
      body: JSON.stringify(HouseholdBO),
    }).then((responseJSON) => {
      let responseGroceryStatementBO =
        GroceryStatementBO.fromJSON(responseJSON)[0];
      return new Promise(function (resolve) {
        resolve(responseGroceryStatementBO);
      });
    });
  }

  /** inhabitant related **/

  getInhabitant() {
    return this.#fetchAdvanced(this.#getInhabitantURL()).then(
      (responseJSON) => {
        let inhabitantBOs = InhabitantBO.fromJSON(responseJSON);
        return new Promise(function (resolve) {
          resolve(inhabitantBOs);
        });
      }
    );
  }

  addInhabitant(inhabitantBO) {
    return this.#fetchAdvanced(this.#addInhabitantURL(), {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain",
        "Content-type": "application/json",
      },
      body: JSON.stringify(inhabitantBO),
    }).then((responseJSON) => {
      let responseInhabitantBO = InhabitantBO.fromJSON(responseJSON)[0];
      return new Promise(function (resolve) {
        resolve(responseInhabitantBO);
      });
    });
  }

  deleteInhabitant(inhabitantID) {
    return this.#fetchAdvanced(this.#deleteInhabitantURL(inhabitantID), {
      method: "DELETE",
    }).then((responseJSON) => {
      let responseInhabitantBO = InhabitantBO.fromJSON(responseJSON)[0];
      return new Promise(function (resolve) {
        resolve(responseInhabitantBO);
      });
    });
  }

  /**  recipe related **/

  getRecipe() {
    return this.#fetchAdvanced(this.#getRecipeURL()).then((responseJSON) => {
      let recipeBOs = GroceryBO.fromJSON(responseJSON);
      return new Promise(function (resolve) {
        resolve(recipeBOs);
      });
    });
  }

  getRecipeById(recipeID) {
    return this.#fetchAdvanced(this.#getRecipeByIdURL(recipeID)).then(
      (responseJSON) => {
        let responseRecipeBO = RecipeBO.fromJSON(responseJSON);
        return new Promise(function (resolve) {
          resolve(responseRecipeBO);
        });
      }
    );
  }

  getRecipeByName(recipeName) {
    return this.#fetchAdvanced(this.#getRecipeByNameURL(recipeName)).then(
      (responseJSON) => {
        let responseRecipeBO = RecipeBO.fromJSON(responseJSON)[0];
        return new Promise(function (resolve) {
          resolve(responseRecipeBO);
        });
      }
    );
  }

  deleteRecipe(recipeID) {
    return this.#fetchAdvanced(this.#deleteRecipeURL(recipeID), {
      method: "DELETE",
    }).then((responseJSON) => {
      let responseRecipeBOs = RecipeBO.fromJSON(responseJSON)[0];
      return new Promise(function (resolve) {
        resolve(responseRecipeBOs);
      });
    });
  }

  addRecipe(recipeBO) {
    return this.#fetchAdvanced(this.#addRecipeURL(), {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain",
        "Content-type": "application/json",
      },
      body: JSON.stringify(recipeBO),
    }).then((responseJSON) => {
      let responseRecipeBO = RecipeBO.fromJSON(responseJSON)[0];
      return new Promise(function (resolve) {
        resolve(responseRecipeBO);
      });
    });
  }

  updateRecipe(recipeBO) {
    return this.#fetchAdvanced(this.#updateRecipeURL(recipeBO.getID()), {
      method: "PUT",
      headers: {
        Accept: "application/json, text/plain",
        "Content-type": "application/json",
      },
      body: JSON.stringify(recipeBO),
    }).then((responseJSON) => {
      let responseRecipeBO = RecipeBO.fromJSON(responseJSON)[0];
      return new Promise(function (resolve) {
        resolve(responseRecipeBO);
      });
    });
  }

  /**  user related  **/

  getUser() {
    return this.#fetchAdvanced(this.#getUserURL()).then((responseJSON) => {
      let userBOs = UserBO.fromJSON(responseJSON);
      return new Promise(function (resolve) {
        resolve(userBOs);
      });
    });
  }

  getUserById(userID) {
    return this.#fetchAdvanced(this.#getUserByIdURL(userID)).then(
      (responseJSON) => {
        let responseUserBO = UserBO.fromJSON(responseJSON);
        return new Promise(function (resolve) {
          resolve(responseUserBO);
        });
      }
    );
  }

  getUserByGoogleId(google_user_id) {
    return this.#fetchAdvanced(this.#getUserByGoogleIdURL(google_user_id)).then(
      (responseJSON) => {
        let responseUserBO = UserBO.fromJSON(responseJSON)[0];
        return new Promise(function (resolve) {
          resolve(responseUserBO);
        });
      }
    );
  }

  deleteUser(userID) {
    return this.#fetchAdvanced(this.#deleteUserURL(userID), {
      method: "DELETE",
    }).then((responseJSON) => {
      let responseUserBOs = UserBO.fromJSON(responseJSON)[0];
      return new Promise(function (resolve) {
        resolve(responseUserBOs);
      });
    });
  }

  adduser(userBO) {
    return this.#fetchAdvanced(this.#addUserURL(), {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain",
        "Content-type": "application/json",
      },
      body: JSON.stringify(userBO),
    }).then((responseJSON) => {
      let responseUserBO = UserBO.fromJSON(responseJSON)[0];
      return new Promise(function (resolve) {
        resolve(responseUserBO);
      });
    });
  }

  updateUser(userBO) {
    return this.#fetchAdvanced(this.#updateUserURL(userBO.getID()), {
      method: "PUT",
      headers: {
        Accept: "application/json, text/plain",
        "Content-type": "application/json",
      },
      body: JSON.stringify(userBO),
    }).then((responseJSON) => {
      let responseUserBO = UserBO.fromJSON(responseJSON)[0];
      return new Promise(function (resolve) {
        resolve(responseUserBO);
      });
    });
  }
}
