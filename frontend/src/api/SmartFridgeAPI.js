import FridgeBO from "./FridgeBO";
import GroceryBO from "./GroceryBO";
import GroceryStatementBO from "./GroceryStatementBO";
import HouseholdBO from "./HouseholdBO";
// import InhabitantBO from "./InhabitantBO";
import RecipeBO from "./RecipeBO";
import UserBO from "./UserBO";
import MeasureBO from "./MeasureBO";

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
  static getAPI() {
    if (this.#api == null) {
      this.#api = new SmartFridgeAPI();
    }
    return this.#api;
  }

  // fridge related
  #getFridgeURL = () => `${this.#SmartFridgeBaseURL}/fridge`;
  #addFridgeURL = () => `${this.#SmartFridgeBaseURL}/fridge`;
  #getFridgeByIdURL = (id) => `${this.#SmartFridgeBaseURL}/fridge/${id}`;
  #updateFridgeURL = (id) => `${this.#SmartFridgeBaseURL}/fridge/${id}`;
  #deleteFridgeURL = (id) => `${this.#SmartFridgeBaseURL}/fridge/${id}`;
  #getFridgeByHouseholdIdURL = (id) =>
    `${this.#SmartFridgeBaseURL}/fridge/${id}`;

  // grocery related
  #getGroceryURL = () => `${this.#SmartFridgeBaseURL}/grocery`;
  #getGroceryByIdURL = (id) => `${this.#SmartFridgeBaseURL}/grocery/${id}`;
  #getGroceryByNameURL = (grocery_name) =>
    `${this.#SmartFridgeBaseURL}/grocery/grocery_name/${grocery_name}`;
  #addGroceryURL = () => `${this.#SmartFridgeBaseURL}/grocery`;
  #deleteGroceryURL = (id) => `${this.#SmartFridgeBaseURL}/grocery/${id}`;
  #updateGroceryURL = (id) => `${this.#SmartFridgeBaseURL}/grocery/${id}`;
  #getGroceryByFridgeIdURL = (id) =>
    `${this.#SmartFridgeBaseURL}/grocery/fridge_id/${id}`;

  // groceryStatement related
  #getGroceryStatementURL = () =>
    `${this.#SmartFridgeBaseURL}/grocerystatement`;
  #getGroceryStatementByIdURL = (id) =>
    `${this.#SmartFridgeBaseURL}/grocerystatement/${id}`;
  #addGroceryStatementURL = () =>
    `${this.#SmartFridgeBaseURL}/grocerystatement`;
  #deleteGroceryStatementURL = (id) =>
    `${this.#SmartFridgeBaseURL}/grocerystatement/${id}`;
  #updateGroceryStatementURL = (id) =>
    `${this.#SmartFridgeBaseURL}/grocerystatement/${id}`;
  #addGroceryinFridgeURL = () =>
    `${this.#SmartFridgeBaseURL}/grocery_in_fridge`;
  #getGroceryInFridgeByIdURL = (fridge_id) =>
    `${this.#SmartFridgeBaseURL}/grocery_in_fridge/${fridge_id}`;
  #addGroceryinRecipeURL = () =>
    `${this.#SmartFridgeBaseURL}/grocery_in_recipe`;
  #getGroceryInRecipeByIdURL = (recipe_id) =>
    `${this.#SmartFridgeBaseURL}/grocery_in_recipe/${recipe_id}`;


  // household related
  #getHouseholdURL = () => `${this.#SmartFridgeBaseURL}/household/`;
  #getHouseholdByIdURL = (id) => `${this.#SmartFridgeBaseURL}/household/${id}`;
  #getHouseholdsByUserIdURL = (userId) =>
    `${this.#SmartFridgeBaseURL}/household/user/${userId}`;
  #addHouseholdURL = () => `${this.#SmartFridgeBaseURL}/household`;
  #deleteHouseholdURL = (id) => `${this.#SmartFridgeBaseURL}/household/${id}`;
  #updateHouseholdURL = (id) => `${this.#SmartFridgeBaseURL}/household/${id}`;

  // inhabitant related
  #addInhabitantURL = () => `${this.#SmartFridgeBaseURL}/inhabitant`;
  // #getInhabitantURL = () => `${this.#SmartFridgeBaseURL}/inhabitant`;

  #getInhabitantByIdURL = (household_id) =>
    `${this.#SmartFridgeBaseURL}/inhabitant/${household_id}`;
  #deleteInhabitantURL = (user_id, household_id) =>
    `${this.#SmartFridgeBaseURL}/inhabitant/${user_id}/${household_id}`;

  // recipe related
  #getRecipeURL = () => `${this.#SmartFridgeBaseURL}/recipe/`;
  #getRecipeByNameURL = (recipe_name) =>
    `${this.#SmartFridgeBaseURL}/recipe/${recipe_name}}`;
  #getRecipeByIdURL = (id) => `${this.#SmartFridgeBaseURL}/recipe/${id}`;
  #addRecipeURL = () => `${this.#SmartFridgeBaseURL}/recipe/`;
  #deleteRecipeURL = (id) => `${this.#SmartFridgeBaseURL}/recipe/${id}`;
  #updateRecipeURL = (id) => `${this.#SmartFridgeBaseURL}/recipe/${id}`;
  #cookRecipeURL = (recipeId, fridgeId) => `${this.#SmartFridgeBaseURL}/recipe/${recipeId}/${fridgeId}`;

  // user related
  #getUserURL = () => `${this.#SmartFridgeBaseURL}/user`;
  #getUserByGoogleIdURL = (google_user_id) =>
    `${this.#SmartFridgeBaseURL}/user/google_user_id/${google_user_id}`;
  #getUserByIdURL = (id) => `${this.#SmartFridgeBaseURL}/user/${id}`;
  #addUserURL = () => `${this.#SmartFridgeBaseURL}/user`;
  #deleteUserURL = (id) => `${this.#SmartFridgeBaseURL}/user/${id}`;
  #updateUserURL = (id) => `${this.#SmartFridgeBaseURL}/user/${id}`;

  // measure related
  #getMeasureURL = () => `${this.#SmartFridgeBaseURL}/measure`;
  #addMeasureURL = () => `${this.#SmartFridgeBaseURL}/measure`;
  #getMeasureByIdURL = (id) => `${this.#SmartFridgeBaseURL}/measure/${id}`;
  #deleteMeasureURL = (id) => `${this.#SmartFridgeBaseURL}/measure/${id}`;
  #getMeasureByFridgeIdURL = (id) =>
    `${this.#SmartFridgeBaseURL}/measure/fridge_id/${id}`;
  #getMeasureByNameURL = (unit) =>
    `${this.#SmartFridgeBaseURL}/measure/unit/${unit}`;
  #updateMeasureURL = (id) => `${this.#SmartFridgeBaseURL}/measure/${id}`;


  



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

  // ###########Grocery_in_Fridge

  addGroceryinFridge(grocerystatementId, fridgeId) {
    console.log(
      JSON.stringify("Das ist die GrocerystatementID", grocerystatementId)
    );
    return this.#fetchAdvanced(this.#addGroceryinFridgeURL(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        grocerystatement_id: grocerystatementId,
        fridge_id: fridgeId,
      }),
    });
  }

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

  getFridgeByHouseholdId(householdID) {
    return this.#fetchAdvanced(
      this.#getFridgeByHouseholdIdURL(householdID)
    ).then((responseJSON) => {
      let responseFridgeBO = FridgeBO.fromJSON(responseJSON)[0];
      return new Promise(function (resolve) {
        resolve(responseFridgeBO);
      });
    });
  }

  /**  grocery related  **/

  getGroceryByFridgeId(fridgeID) {
    return this.#fetchAdvanced(this.#getGroceryByFridgeIdURL(fridgeID)).then(
      (responseJSON) => {
        let responseGroceryBOs = GroceryBO.fromJSON(responseJSON);
        return new Promise(function (resolve) {
          resolve(responseGroceryBOs);
        });
      }
    );
  }
  getGroceryInFridgeId(fridgeId) {
    return this.#fetchAdvanced(this.#getGroceryInFridgeByIdURL(fridgeId)).then(
      (responseJSON) => {
        let groceryStatementBOs = responseJSON;
        return new Promise(function (resolve) {
          resolve(groceryStatementBOs);
        });
      }
    );
  }

  getGrocery() {
    console.log("Fetching URL erfolgreich:", this.#getGroceryURL()); // Debugging-Zweck
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
    return this.#fetchAdvanced(this.#updateGroceryURL(groceryBO.id), {
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

  getGroceryInRecipeId(recipeId) {
    return this.#fetchAdvanced(this.#getGroceryInRecipeByIdURL(recipeId)).then(
      (responseJSON) => {
        let groceryStatementBOs = responseJSON;
        return new Promise(function (resolve) {
          resolve(groceryStatementBOs);
        });
      }
    );
  }

  addGroceryinRecipe(grocerystatementId, recipeId) {
    console.log(
      JSON.stringify("Das ist die GrocerystatementID", grocerystatementId)
    );
    return this.#fetchAdvanced(this.#addGroceryinRecipeURL(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        grocerystatement_id: grocerystatementId,
        recipe_id: recipeId,
      }),
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

  getHouseholdsByUserId(userId) {
    return this.#fetchAdvanced(this.#getHouseholdsByUserIdURL(userId)).then(
      (responseJSON) => {
        let responseHouseholdBOs = HouseholdBO.fromJSON(responseJSON);
        return new Promise(function (resolve) {
          resolve(responseHouseholdBOs);
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
    console.log("von smartfridge.api", JSON.stringify(householdBO));
    return this.#fetchAdvanced(this.#addHouseholdURL(), {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain",
        "Content-type": "application/json",
      },
      body: JSON.stringify(householdBO),
    }).then((responseJSON) => {
      let responseHouseholdBO = HouseholdBO.fromJSON(responseJSON);
      return new Promise(function (resolve) {
        resolve(responseHouseholdBO[0]);
      });
    });
  }

  updateHousehold(householdBO) {
    return this.#fetchAdvanced(this.#updateHouseholdURL(householdBO.id), {
      method: "PUT",
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

  /** inhabitant related **/

  addInhabitant(userId, householdId) {
    console.log(JSON.stringify("Das ist die UserID", userId));
    console.log(JSON.stringify("Das ist die householdID", householdId));
    return this.#fetchAdvanced(this.#addInhabitantURL(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userId,
        household_id: householdId,
      }),
    });
  }

  getInhabitantsByHouseholdId(householdId) {
    return this.#fetchAdvanced(this.#getInhabitantByIdURL(householdId)).then(
      (responseJSON) => {
        let inhabitantBOs = responseJSON;
        return new Promise(function (resolve) {
          resolve(inhabitantBOs);
        });
      }
    );
  }

  deleteInhabitant(userId, householdId) {
    return this.#fetchAdvanced(this.#deleteInhabitantURL(userId, householdId), {
      method: "DELETE",
    }).then((responseJSON) => {
      let responseInhabitantBO = responseJSON; // Anpassen je nach tatsächlichem API-Response-Format
      return new Promise(function (resolve) {
        resolve(responseInhabitantBO);
      });
    });
  }

  //   getInhabitantsByHouseholdId(householdId) {
  //     console.log(JSON.stringify("Das ist die householdID", householdId)); // Debugging-Zweck
  //     const url = this.#getInhabitantByIdURL(householdId); // Annahme, dass die URL-Methode die householdId benötigt
  //     console.log("Fetching URL erfolgreich:", url); // Debugging-Zweck
  //     return this.#fetchAdvanced(url).then((responseJSON) => {
  //         return new Promise(function (resolve) {
  //             resolve(responseJSON); // Rückgabe des JSON-Antwortobjekts
  //         });
  //     });
  // }

  // getInhabitantById(householdId) {
  //   return this.#fetchAdvanced(this.#getInhabitantByIdURL(householdId)).then(
  //     (responseJSON) => {
  //       let responseInhabitantBO = responseJSON;
  //       return new Promise(function (resolve) {
  //         resolve(responseInhabitantBO);
  //       });
  //     }
  //   );
  // }

  // addInhabitant({householdId, userId}) {
  //   console.log(JSON.stringify("Das ist die UserID", userId));
  //   console.log(JSON.stringify("Das ist die householdID", householdId));
  //   return this.#fetchAdvanced(this.#addInhabitantURL(), {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       user_id: userId,
  //       household_id: householdId,
  //     }),
  //   });
  // }

  // addInhabitant(inhabitant) {
  //   console.log(JSON.stringify(inhabitant));

  //   return this.#fetchAdvanced(this.#addInhabitantURL(), {
  //     method: "POST",
  //     headers: {
  //       Accept: "application/json, text/plain",
  //       "Content-type": "application/json",
  //     },
  //     body: JSON.stringify(inhabitant),
  //   }).then((responseJSON) => {
  //     let responseInhabitantBO = responseJSON; // Anpassen je nach tatsächlichem API-Response-Format
  //     return new Promise(function (resolve) {
  //       resolve(responseInhabitantBO);
  //     });
  //   });
  // }

  // addInhabitant(inhabitantBO) {
  //   return this.#fetchAdvanced(this.#addInhabitantURL(), {
  //     method: "POST",
  //     headers: {
  //       Accept: "application/json, text/plain",
  //       "Content-type": "application/json",
  //     },
  //     body: JSON.stringify(inhabitantBO),
  //   }).then((responseJSON) => {
  //     let responseInhabitantBO = InhabitantBO.fromJSON(responseJSON)[0];
  //     return new Promise(function (resolve) {
  //       resolve(responseInhabitantBO);
  //     });
  //   });
  // }

  // addInhabitant(inhabitantBO) {
  //   return this.#fetchAdvanced(this.#addInhabitantURL(), {
  //     method: "POST",
  //     headers: {
  //       Accept: "application/json, text/plain",
  //       "Content-type": "application/json",
  //     },
  //     body: JSON.stringify(inhabitantBO),
  //   }).then((responseJSON) => {
  //     let responseInhabitantBO = InhabitantBO.fromJSON(responseJSON)[0];
  //     return new Promise(function (resolve) {
  //       resolve(responseInhabitantBO);
  //     });
  //   });
  // }

  // addInhabitant(inhabitantBO) {
  //   return this.#fetchAdvanced(this.#addInhabitantURL(), {
  //     method: "POST",
  //     headers: {
  //       Accept: "application/json, text/plain",
  //       "Content-type": "application/json",
  //     },
  //     body: JSON.stringify(inhabitantBO),
  //   }
  // }

  // deleteInhabitant(inhabitantID) {
  //   return this.#fetchAdvanced(this.#deleteInhabitantURL(inhabitantID), {
  //     method: "DELETE",
  //   }).then((responseJSON) => {
  //     let responseInhabitantBO = InhabitantBO.fromJSON(responseJSON)[0];
  //     return new Promise(function (resolve) {
  //       resolve(responseInhabitantBO);
  //     });
  //   });
  // }

  /**  recipe related **/

  getRecipe() {
    const url = `${this.#getRecipeURL()}`;
    return this.#fetchAdvanced(url).then((responseJSON) => {
      let recipeBOs = RecipeBO.fromJSON(responseJSON);
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

    console.log('RECIPE BO ====>', recipeBO)
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

  cookRecipe(recipeId, fridgeId) {
    return this.#fetchAdvanced(this.#cookRecipeURL(recipeId, fridgeId), {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain",
        "Content-type": "application/json",
      },
      body: JSON.stringify({}),
    }).then((responseJSON) => {
      return new Promise(function (resolve) {
        resolve(responseJSON);
      });
    });
  };
  
  /**  user related  **/

  getUser() {
    const url = this.#getUserURL();
    // console.log("Fetching URL:", url); // Debugging-Zweck
    return this.#fetchAdvanced(url)
      .then((responseJSON) => {
        let userBOs = UserBO.fromJSON(responseJSON);
        return new Promise(function (resolve) {
          resolve(userBOs);
        });
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
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

  addUser(userBO) {
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

  /**  Measure related  **/

  getMeasureByFridgeId(fridgeID) {
    return this.#fetchAdvanced(this.#getMeasureByFridgeIdURL(fridgeID)).then(
      (responseJSON) => {
        let responseMeasureBOs = MeasureBO.fromJSON(responseJSON);
        return new Promise(function (resolve) {
          resolve(responseMeasureBOs);
        });
      }
    );
  }

  getMeasureByName(measureName) {
    return this.#fetchAdvanced(this.#getMeasureByNameURL(measureName)).then(
      (responseJSON) => {
        let responseMeasureBO = MeasureBO.fromJSON(responseJSON)[0];
        return new Promise(function (resolve) {
          resolve(responseMeasureBO);
        });
      }
    );
  }

  getMeasureById(measureID) {
    return this.#fetchAdvanced(this.#getMeasureByIdURL(measureID)).then(
      (responseJSON) => {
        let responseMeasureBO = GroceryBO.fromJSON(responseJSON);
        return new Promise(function (resolve) {
          resolve(responseMeasureBO);
        });
      }
    );
  }

  getMeasure() {
    return this.#fetchAdvanced(this.#getMeasureURL()).then((responseJSON) => {
      let measureBOs = MeasureBO.fromJSON(responseJSON);
      return new Promise(function (resolve) {
        resolve(measureBOs);
      });
    });
  }

  addMeasure(measureBO) {
    return this.#fetchAdvanced(this.#addMeasureURL(), {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain",
        "Content-type": "application/json",
      },
      body: JSON.stringify(measureBO),
    }).then((responseJSON) => {
      let responseMeasureBO = MeasureBO.fromJSON(responseJSON)[0];
      return new Promise(function (resolve) {
        resolve(responseMeasureBO);
      });
    });
  }

  deleteMeasure(measureID) {
    return this.#fetchAdvanced(this.#deleteMeasureURL(measureID), {
      method: "DELETE",
    }).then((responseJSON) => {
      let responseMeasureBOs = MeasureBO.fromJSON(responseJSON)[0];
      return new Promise(function (resolve) {
        resolve(responseMeasureBOs);
      });
    });
  }
  
  updateMeasure(measureBO) {
    return this.#fetchAdvanced(this.#updateMeasureURL(measureBO.id), {
      method: "PUT",
      headers: {
        Accept: "application/json, text/plain",
        "Content-type": "application/json",
      },
      body: JSON.stringify(measureBO),
    }).then((responseJSON) => {
      let responseMeasureBO = MeasureBO.fromJSON(responseJSON)[0];
      return new Promise(function (resolve) {
        resolve(responseMeasureBO);
      });
    });
  }

}


