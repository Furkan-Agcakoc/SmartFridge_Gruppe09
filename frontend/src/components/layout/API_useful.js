import UserBO from './UserBO';
import UnitOfMeasureBO from './UnitOfMeasureBO';
import RecipeBO from './RecipeBO'; 
import FridgeBO from './FridgeBO';
import GroceryBO from './GroceryBO';
import GroceryEntryBO from './GroceryEntryBO';
import HouseholdBO from './HouseholdBO';
import QuantityBO from './QuantityBO';


export default class SmartFridgeAPI {

  // Singelton instance
    static #api = null;


  // Local Python backend
    #smartfridgeServerBaseURL = '/SmartFridge';

    // Korrektur: s in klein. Route anpassen. 

    // User related
    #getUsers = () => `${this.#smartfridgeServerBaseURL}/users`;
    #addUser = () => `${this.#smartfridgeServerBaseURL}/user`;
    #getUserById = (id) => `${this.#smartfridgeServerBaseURL}/users${id}`;
    #getUserGid = (googleUserId) => `${this.#smartfridgeServerBaseURL}/users-by-gid/${googleUserId}`;
    #updateUser = (id) => `${this.#smartfridgeServerBaseURL}/users/${id}`;
    #deleteUser = (id) => `${this.#smartfridgeServerBaseURL}/users/${id}`;
    #getUserByHousehold = (householdId) => `${this.#smartfridgeServerBaseURL}/users/${householdId}`;
    #getUserByRecipe = (id) => `${this.#smartfridgeServerBaseURL}/recipe_name/${id}`;

    // UnitOfMeasure related
    #getUnitOfMeasure = () => `${this.#smartfridgeServerBaseURL}/unitofmeasure`;
    #addUnitOfMeasure = () => `${this.#smartfridgeServerBaseURL}/unitofmeasure`;
    #getUnitOfMeasureById = (id) => `${this.#smartfridgeServerBaseURL}/unitofmeasure/${id}`;
    #updateUnitOfMeasure = (id) => `${this.#smartfridgeServerBaseURL}/unitofmeasure/${id}`;
    #deleteUnitOfMeasure = (id) => `${this.#smartfridgeServerBaseURL}/unitofmeasure/${id}`;

    // Recipe related
    #getRecipe = () => `${this.#smartfridgeServerBaseURL}/recipe`;
    #addRecipe = () => `${this.#smartfridgeServerBaseURL}/recipe`;
    #getRecipeById = (id) => `${this.#smartfridgeServerBaseURL}/recipe/${id}`;
    #updateRecipe = (id) => `${this.#smartfridgeServerBaseURL}/recipe/${id}`;
    #deleteRecipe = (id) => `${this.#smartfridgeServerBaseURL}/recipe/${id}`;
    #getRecipeByUser = (userId) => `${this.#smartfridgeServerBaseURL}/recipe-by-user/${userId}`;
    #getRecipeByHousehold = (householdId) => `${this.#smartfridgeServerBaseURL}/recipe-by-user/${householdId}`;

    // Fridge related
    #getFridge = () => `${this.#smartfridgeServerBaseURL}/fridge`;
    #addFridge = () => `${this.#smartfridgeServerBaseURL}/fridge`;
    #getFridgeById = (id) =>`${this.#smartfridgeServerBaseURL}/fridge/${id}`;
    #updateFridge = (id) => `${this.#smartfridgeServerBaseURL}/fridge/${id}`;
    #deleteFridge = (id) => `${this.#smartfridgeServerBaseURL}/fridge/${id}`;

    // Grocery related
    #getGroceries = () => `${this.#smartfridgeServerBaseURL}/grocery`;
    #addGrocery = () => `${this.#smartfridgeServerBaseURL}/grocery`;
    #getGrocery = (id) => `${this.#smartfridgeServerBaseURL}/grocery/${id}`;
    #updateGrocery = (id) => `${this.#smartfridgeServerBaseURL}/grocery/${id}`;
    #deleteGrocery = (id) => `${this.#smartfridgeServerBaseURL}/grocery/${id}`;
    #getGroceryByUser = (userId) => `${this.#smartfridgeServerBaseURL}/grocery/${userId}`;

    // GroceryEntry related
    #getGroceryEntry = () => `${this.#smartfridgeServerBaseURL}/groceryentry`;
    #addGroceryEntry = () => `${this.#smartfridgeServerBaseURL}/groceryentry`;
    #getGroceryEntryById = (id) => `${this.#smartfridgeServerBaseURL}/groceryentry/${id}`;
    #updateGroceryEntry = (id) => `${this.#smartfridgeServerBaseURL}/groceryentry/${id}`;
    #deleteGroceryEntry = (id) => `${this.#smartfridgeServerBaseURL}/groceryentry/${id}`;
    #getGroceryEntryByLocation = (locationId, location) => `${this.#smartfridgeServerBaseURL}/groceryentry/${locationId}/${location}`;

    // Household related
    #getHouseholdById = (id) =>`${this.#smartfridgeServerBaseURL}/household/${id}`;
    #getHousehold = () => `${this.#smartfridgeServerBaseURL}/household`;
    #addHousehold = () => `${this.#smartfridgeServerBaseURL}/household`;
    #updateHousehold = (id) => `${this.#smartfridgeServerBaseURL}/household/${id}`;
    #deleteHousehold = (id) => `${this.#smartfridgeServerBaseURL}/household/${id}`;
    #getHouseholdByFridgeId = (fridgeId) =>`${this.#smartfridgeServerBaseURL}/household-fridge/${fridgeId}`;


    // Quantity related
    #getQuantity = () => `${this.#smartfridgeServerBaseURL}/quantity`;
    #getQuantityById = (id) => `${this.#smartfridgeServerBaseURL}/quantity/${id}`;
    #addQuantity = () => `${this.#smartfridgeServerBaseURL}/quantity`;
    #updateQuantity = (id) => `${this.#smartfridgeServerBaseURL}/quantity/${id}`;
    #deleteQuantity = (id) => `${this.#smartfridgeServerBaseURL}/quantity/${id}`;
    


    /** 
     * Get the Singelton instance 
     * 
     * @public
     */
    static  getAPI() {
      if (this.#api == null) {
        this.#api = new SmartFridgeAPI();
      }
      return this.#api;
    }

    /**
     *  Returns a Promise which resolves to a json object. 
     *  The Promise returned from fetch() won’t reject on HTTP error status even if the response is an HTTP 404 or 500. 
     *  fetchAdvanced throws an Error also an server status errors
     */
    #fetchAdvanced = (url, init) => fetch(url, init)
      .then(res => {
        // The Promise returned from fetch() won’t reject on HTTP error status even if the response is an HTTP 404 or 500. 
        if (!res.ok) {
          throw Error(`${res.status} ${res.statusText}`);
        }
        return res.json();
      }
      )

    // Verbindung mit Zugriff auf User  
    getUsers() {
      return this.#fetchAdvanced(this.#getUsers(), {
        method:'GET',
      }).then((responseJSON) => {
        let userBos = UserBO.fromJSON(responseJSON);
        return new Promise(function (resolve) {
          resolve(userBos);
        })
      })
      }

    getUserGid(google_user_id) {
      return this.#fetchAdvanced(this.#getUserGid(google_user_id)).then(
        (responseJSON) => {
          let usersBOs = UserBO.fromJSON(responseJSON);
          return new Promise(function (resolve) {
            resolve(usersBOs);
          });
        }
      );
    }

    getUserById(userId) {
      return this.#fetchAdvanced(this.#getUserById(userId), {
        method:'GET',
      }).then((responseJSON) => {
        let userBOs = UserBO.fromJSON(responseJSON);
        return new Promise(function (resolve) {
          resolve(userBOs);
        })
      })
      }

    addUser(userbo) {
      return this.#fetchAdvanced(this.#addUser(), {
        method: 'POST',
        headers: {
          'Accept': 'application/json, text/plain',
          'Content-type': 'application/json',
        },
        body: JSON.stringify(userbo)
      }).then((responseJSON) => {
        // We always get an array of UserBOs.fromJSON, but only need one object
        let responseUserBO = UserBO.fromJSON(responseJSON)[0];
        return new Promise(function (resolve) {
          resolve(responseUserBO);
        })
      })
      }

    updateUser(user) {
      console.log(JSON.stringify(user))
      return this.#fetchAdvanced(this.#updateUser(user.getID()), {
        method:'PUT',
        headers: {
            'Accept': 'application/json, text/plain',
            'Content-type': 'application/json',
          },
        /* body: JSON.stringify(user), */
        body: JSON.stringify(user)
      }).then((responseJSON) => {
        // We always get an array of UserBos.fromJSON
        let userBO = UserBO.fromJSON(responseJSON)[0];
        // console.info(accountBOs);
        return new Promise(function (resolve) {
          resolve(userBO);
        })
      })
    }


    deleteUser(id) {
      return this.#fetchAdvanced(this.#deleteUser(id), {
        method: 'DELETE'
      }).then((responseJSON) => {
        let responseUserBO = UserBO.fromJSON(responseJSON)[0];
        return new Promise(function (resolve) {
          resolve(responseUserBO);
        })
      })

    }
    
    // User des Haushalts aufrufen.. noch nicht final! 
    getUserByHousehold(householdId) {
      return this.#fetchAdvanced(this.#getUserByHousehold(householdId), {
        method:'GET',
      }).then((responseJSON) => {
        let recipeBos = UserBO.fromJSON(responseJSON);
        return new Promise(function (resolve) {
          resolve(recipeBos);
        })
      })
      }  

      // User des rezepts aufrufen.. noch nicht final! 
    getUserByRecipe(recipeId) {
      return this.#fetchAdvanced(this.#getUserByRecipe(recipeId), {
        method:'GET',
      }).then((responseJSON) => {
        let recipeBos = RecipeBO.fromJSON(responseJSON);
        return new Promise(function (resolve) {
          resolve(recipeBos);
        })
      })
      }



    // Verbindung mit Zugriff auf UnitsOfMeasure  
    getUnitOfMeasure() {
      return this.#fetchAdvanced(this.#getUnitOfMeasure(), {
        method:'GET',
      }).then((responseJSON) => {
        let unitOfMeasureBos = UnitOfMeasureBO.fromJSON(responseJSON);
        return new Promise(function (resolve) {
          resolve(unitOfMeasureBos);
        })
      })
      }


    addUnitOfMeasure(UnitOfMeasurebo) {
      return this.#fetchAdvanced(this.#addUnitOfMeasure(), {
        method: 'POST',
        headers: {
          'Accept': 'application/json, text/plain',
          'Content-type': 'application/json',
        },
        body: JSON.stringify(UnitOfMeasurebo)
      }).then((responseJSON) => {
        // We always get an array of UnitOfMeasureBO.fromJSON, but only need one object
        let responseUnitOfMeasureBos = UnitOfMeasureBO.fromJSON(responseJSON)[0];
        return new Promise(function (resolve) {
          resolve(responseUnitOfMeasureBos);
        })
      })
      }

    getUnitOfMeasureById(id) {
      return this.#fetchAdvanced(this.#getUnitOfMeasureById(id), {
        method:'GET',
      }).then((responseJSON) => {
        let unitOfMeasureBos = UnitOfMeasureBO.fromJSON(responseJSON);
        return new Promise(function (resolve) {
          resolve(unitOfMeasureBos);
        })
      })
      }

    updateUnitOfMeasure(unitId) {
      return this.#fetchAdvanced(this.#updateUnitOfMeasure(unitId.getID()), {
        method:'PUT',
        headers: {
            'Accept': 'application/json, text/plain',
            'Content-type': 'application/json',
          },
        body: JSON.stringify(unitId)
      }).then((responseJSON) => {
        // We always get an array of UnitOfMeasureBO.fromJSON
        let unitOfMeasureBos = UnitOfMeasureBO.fromJSON(responseJSON)[0];
        // console.info(accountBOs);
        return new Promise(function (resolve) {
          resolve(unitOfMeasureBos);
        })
      })
    }


    deleteUnitOfMeasure(unitId) {
      return this.#fetchAdvanced(this.#deleteUnitOfMeasure(unitId), {
        method: 'DELETE'
      }).then((responseJSON) => {
        let responseUnitOfMeasureBO = UnitOfMeasureBO.fromJSON(responseJSON)[0];
        return new Promise(function (resolve) {
          resolve(responseUnitOfMeasureBO);
        })
      })
    }



    // Verbindung mit Zugriff auf Recipe  
    getRecipe() {
      return this.#fetchAdvanced(this.#getRecipe(), {
        method:'GET',
      }).then((responseJSON) => {
        let recipeBos = RecipeBO.fromJSON(responseJSON);
        return new Promise(function (resolve) {
          resolve(recipeBos);
        })
      })
      }


    addRecipe(recipebo) {
      return this.#fetchAdvanced(this.#addRecipe(), {
        method: 'POST',
        headers: {
          'Accept': 'application/json, text/plain',
          'Content-type': 'application/json',
        },
        body: JSON.stringify(recipebo)
      }).then((responseJSON) => {
        // We always get an array of UnitOfMeasureBO.fromJSON, but only need one object
        let responseRecipeBos = RecipeBO.fromJSON(responseJSON)[0];
        return new Promise(function (resolve) {
          resolve(responseRecipeBos);
        })
      })
      }

    getRecipeById(id) {
      return this.#fetchAdvanced(this.#getRecipeById(), {
        method:'GET',
      }).then((responseJSON) => {
        let recipeBos = RecipeBO.fromJSON(responseJSON);
        return new Promise(function (resolve) {
          resolve(recipeBos);
         })
      })
      }

    updateRecipe(recipeId) {
      return this.#fetchAdvanced(this.#updateRecipe(recipeId.getID()), {
        method:'PUT',
        headers: {
            'Accept': 'application/json, text/plain',
            'Content-type': 'application/json',
          },
        body: JSON.stringify(recipeId)
      }).then((responseJSON) => {
        // We always get an array of UnitOfMeasureBO.fromJSON
        let recipeBos = RecipeBO.fromJSON(responseJSON)[0];
        // console.info(accountBOs);
        return new Promise(function (resolve) {
          resolve(recipeBos);
        })
      })
    }


    deleteRecipe(recipeId) {
      return this.#fetchAdvanced(this.#deleteRecipe(recipeId), {
        method: 'DELETE'
      }).then((responseJSON) => {
        let responseRecipeBos = RecipeBO.fromJSON(responseJSON)[0];
        return new Promise(function (resolve) {
          resolve(responseRecipeBos);
        })
      })
    }


    getRecipeByUser(userId) {
      return this.#fetchAdvanced(this.#getRecipeByUser(userId), {
        method:'GET',
      }).then((responseJSON) => {
        let recipeBos = RecipeBO.fromJSON(responseJSON);
        return new Promise(function (resolve) {
          resolve(recipeBos);
        })
      })
    }

    getRecipeByHousehold(householdId) {
      return this.#fetchAdvanced(this.#getRecipeByHousehold(householdId), {
        method:'GET',
      }).then((responseJSON) => {
        let recipeBos = RecipeBO.fromJSON(responseJSON);
        return new Promise(function (resolve) {
          resolve(recipeBos);
        })
      })
    }


    // Verbindung mit Zugriff auf Fridge  
    getFridge() {
      return this.#fetchAdvanced(this.#getFridge(), {
        method:'GET',
      }).then((responseJSON) => {
        let fridgeBos = FridgeBO.fromJSON(responseJSON);
        return new Promise(function (resolve) {
          resolve(fridgeBos);
        })
      })
      }


    addFridge(fridgebo) {
      return this.#fetchAdvanced(this.#addFridge(), {
        method: 'POST',
        headers: {
          'Accept': 'application/json, text/plain',
          'Content-type': 'application/json',
        },
        body: JSON.stringify(fridgebo)
      }).then((responseJSON) => {
        // We always get an array of UnitOfMeasureBO.fromJSON, but only need one object
        let responseFridgeBos = FridgeBO.fromJSON(responseJSON)[0];
        return new Promise(function (resolve) {
          resolve(responseFridgeBos);
        })
      })
      }

    getFridgeById(id) {
      return this.#fetchAdvanced(this.#getFridgeById(id), {
        method:'GET',
      }).then((responseJSON) => {
        let fridgeBos = FridgeBO.fromJSON(responseJSON);
        return new Promise(function (resolve) {
          resolve(fridgeBos);
        })
      })
      }

    updateFridge(fridgeId) {
      return this.#fetchAdvanced(this.#updateFridge(fridgeId.getID()), {
        method:'PUT',
        headers: {
            'Accept': 'application/json, text/plain',
            'Content-type': 'application/json',
          },
        body: JSON.stringify(fridgeId)
      }).then((responseJSON) => {
        // We always get an array of UnitOfMeasureBO.fromJSON
        let fridgeBos = FridgeBO.fromJSON(responseJSON)[0];
        // console.info(accountBOs);
        return new Promise(function (resolve) {
          resolve(fridgeBos);
        })
      })
    }


    deleteFridge(fridgeId) {
      return this.#fetchAdvanced(this.#deleteFridge(fridgeId), {
        method: 'DELETE'
      }).then((responseJSON) => {
        let responseFridgeBos = FridgeBO.fromJSON(responseJSON)[0];
        return new Promise(function (resolve) {
          resolve(responseFridgeBos);
        })
      })
    }
    
    // Verbindung mit Zugriff auf Grocery  
    getGroceries() {
      return this.#fetchAdvanced(this.#getGroceries(), {
        method:'GET',
      }).then((responseJSON) => {
        let groceryBos = GroceryBO.fromJSON(responseJSON);
        return new Promise(function (resolve) {
          resolve(groceryBos);
        })
      })
      }


    addGrocery(GroceryBo) {
      return this.#fetchAdvanced(this.#addGrocery(), {
        method: 'POST',
        headers: {
          'Accept': 'application/json, text/plain',
          'Content-type': 'application/json',
        },
        body: JSON.stringify(GroceryBo)
      }).then((responseJSON) => {
        // We always get an array of UnitOfMeasureBO.fromJSON, but only need one object
        let responseGroceryBos = GroceryBO.fromJSON(responseJSON)[0];
        return new Promise(function (resolve) {
          resolve(responseGroceryBos);
        })
      })
      }

    getGrocery(id) {
      return this.#fetchAdvanced(this.#getGrocery(id), {
        method:'GET',
      }).then((responseJSON) => {
         let groceryBos = GroceryBO.fromJSON(responseJSON);
        return new Promise(function (resolve) {
          resolve(groceryBos);
        })
      })
      }

    updateGrocery(groceryId) {
      return this.#fetchAdvanced(this.#updateGrocery(groceryId.getID()), {
        method:'PUT',
        headers: {
            'Accept': 'application/json, text/plain',
            'Content-type': 'application/json',
          },
        body: JSON.stringify(groceryId)
      }).then((responseJSON) => {
        let groceryBos = GroceryBO.fromJSON(responseJSON)[0];
        return new Promise(function (resolve) {
          resolve(groceryBos);
        })
      })
    }


    deleteGrocery(groceryId) {
      return this.#fetchAdvanced(this.#deleteGrocery(groceryId), {
        method: 'DELETE'
      }).then((responseJSON) => {
        let responseGroceryBos = GroceryBO.fromJSON(responseJSON)[0];
        return new Promise(function (resolve) {
          resolve(responseGroceryBos);
        })
      })
    }

    getGrocerydByUser(userId) {
      return this.#fetchAdvanced(this.#getGroceryByUser(userId), {
        method:'GET',
      }).then((responseJSON) => {
         let groceryBos = GroceryBO.fromJSON(responseJSON);
        return new Promise(function (resolve) {
          resolve(groceryBos);
        })
      })
      }

    // Verbindung mit Zugriff auf GroceryEntry  
    getGroceryEntry() {
      return this.#fetchAdvanced(this.#getGroceryEntry(), {
        method:'GET',
      }).then((responseJSON) => {
        let groceryentryBos = GroceryEntryBO.fromJSON(responseJSON);
        return new Promise(function (resolve) {
          resolve(groceryentryBos);
        })
      })
      }


    addGroceryEntry(groceryentrybo) {
      return this.#fetchAdvanced(this.#addGroceryEntry(), {
        method: 'POST',
        headers: {
          'Accept': 'application/json, text/plain',
          'Content-type': 'application/json',
        },
        body: JSON.stringify(groceryentrybo)
      }).then((responseJSON) => {
        // We always get an array of UnitOfMeasureBO.fromJSON, but only need one object
        let responseGroceryEntryBos = GroceryEntryBO.fromJSON(responseJSON)[0];
        return new Promise(function (resolve) {
          resolve(responseGroceryEntryBos);
        })
      })
      }

    getGroceryEntryById(id) {
      return this.#fetchAdvanced(this.#getGroceryEntryById(id), {
        method:'GET',
      }).then((responseJSON) => {
        let groceryentryBos = GroceryEntryBO.fromJSON(responseJSON);
        return new Promise(function (resolve) {
          resolve(groceryentryBos);
         })
      })
      }

    updateGroceryEntry(groceryentryId) {
      return this.#fetchAdvanced(this.#updateGroceryEntry(groceryentryId.getID()), {
        method:'PUT',
        headers: {
            'Accept': 'application/json, text/plain',
            'Content-type': 'application/json',
          },
        body: JSON.stringify(groceryentryId)
      }).then((responseJSON) => {
        // We always get an array of UnitOfMeasureBO.fromJSON
        let groceryentryBos = GroceryEntryBO.fromJSON(responseJSON)[0];
        // console.info(accountBOs);
        return new Promise(function (resolve) {
          resolve(groceryentryBos);
        })
      })
      }


    deleteGroceryEntry(groceryentryId) {
      return this.#fetchAdvanced(this.#deleteGroceryEntry(groceryentryId), {
        method: 'DELETE'
      }).then((responseJSON) => {
        let responseGroceryEntryBos = GroceryEntryBO.fromJSON(responseJSON)[0];
        return new Promise(function (resolve) {
          resolve(responseGroceryEntryBos);
        })
      })
      }


    getGroceryEntryByLocation(locationId, location) {
      return this.#fetchAdvanced(this.#getGroceryEntryByLocation(locationId, location), {
        method:'GET',
      }).then((responseJSON) => {
        let groceryentryBos = GroceryEntryBO.fromJSON(responseJSON);
        return new Promise(function (resolve) {
          resolve(groceryentryBos);
         })
      })
      }

  // Verbindung mit Zugriff auf Household
  
    getHousehold() {
      return this.#fetchAdvanced(this.#getHousehold(), {
        method:'GET',
      }).then((responseJSON) => {
        let householdBos = HouseholdBO.fromJSON(responseJSON);
        return new Promise(function (resolve) {
          resolve(householdBos);
        })
      })
      }


    addHousehold(householdbo) {
      return this.#fetchAdvanced(this.#addHousehold(), {
        method: 'POST',
        headers: {
          'Accept': 'application/json, text/plain',
          'Content-type': 'application/json',
        },
        body: JSON.stringify(householdbo)
      }).then((responseJSON) => {
        // We always get an array of UnitOfMeasureBO.fromJSON, but only need one object
        let responseHouseholdBos = HouseholdBO.fromJSON(responseJSON)[0];
        return new Promise(function (resolve) {
          resolve(responseHouseholdBos);
        })
      })
      }

    getHouseholdById(id) {
      return this.#fetchAdvanced(this.#getHouseholdById(id), {
        method:'GET',
      }).then((responseJSON) => {
        console.log('api', id)
         let householdBos = HouseholdBO.fromJSON(responseJSON);
        return new Promise(function (resolve) {
          resolve(householdBos);
        })
      })
      }

    updateHousehold(householdId) {
      return this.#fetchAdvanced(this.#updateHousehold(householdId.getID()), {
        method:'PUT',
        headers: {
            'Accept': 'application/json, text/plain',
            'Content-type': 'application/json',
          },
        body: JSON.stringify(householdId)
      }).then((responseJSON) => {
        // We always get an array of UnitOfMeasureBO.fromJSON
        let householdBos = HouseholdBO.fromJSON(responseJSON)[0];
        // console.info(accountBOs);
        return new Promise(function (resolve) {
          resolve(householdBos);
        })
      })
    }


    deleteHousehold(householdId) {
      return this.#fetchAdvanced(this.#deleteHousehold(householdId), {
        method: 'DELETE'
      }).then((responseJSON) => {
        let responseHouseholdBos = HouseholdBO.fromJSON(responseJSON)[0];
        return new Promise(function (resolve) {
          resolve(responseHouseholdBos);
        })
      })
    }

    getHouseholdByFridgeId(fridgeId) {
      return this.#fetchAdvanced(this.#getHouseholdByFridgeId(fridgeId), {
        method:'GET',
      }).then((responseJSON) => {
        let householdBos = HouseholdBO.fromJSON(responseJSON);
        return new Promise(function (resolve) {
          resolve(householdBos);
        })
      })
    }

  // Verbindung mit Zugriff auf Quantity
    getQuantity() {
      return this.#fetchAdvanced(this.#getQuantity(), {
        method:'GET',
      }).then((responseJSON) => {
        let quantityBos = QuantityBO.fromJSON(responseJSON);
        return new Promise(function (resolve) {
          resolve(quantityBos);
        })
      })
      }

    getQuantityById() {
      return this.#fetchAdvanced(this.#getQuantityById(), {
        method:'GET',
      }).then((responseJSON) => {
        let quantityBos = QuantityBO.fromJSON(responseJSON);
        return new Promise(function (resolve) {
          resolve(quantityBos);
        })
      })
      }
  
    addQuantity(quantitybo) {
      return this.#fetchAdvanced(this.#addQuantity(), {
        method: 'POST',
        headers: {
          'Accept': 'application/json, text/plain',
          'Content-type': 'application/json',
        },
        body: JSON.stringify(quantitybo)
      }).then((responseJSON) => {
        // We always get an array of UnitOfMeasureBO.fromJSON, but only need one object
        let responseQuantityBos = QuantityBO.fromJSON(responseJSON)[0];
        return new Promise(function (resolve) {
          resolve(responseQuantityBos);
        })
      })
      }

    updateQuantity(quantityId) {
      return this.#fetchAdvanced(this.#updateQuantity(quantityId.getID()), {
        method:'PUT',
        headers: {
            'Accept': 'application/json, text/plain',
            'Content-type': 'application/json',
          },
        body: JSON.stringify(quantityId)
      }).then((responseJSON) => {
        // We always get an array of UnitOfMeasureBO.fromJSON
        let quantityBos = QuantityBO.fromJSON(responseJSON)[0];
        // console.info(accountBOs);
        return new Promise(function (resolve) {
          resolve(quantityBos);
        })
      })
    }


    deleteQuantity(quantityId) {
      return this.#fetchAdvanced(this.#deleteQuantity(quantityId), {
        method: 'DELETE'
      }).then((responseJSON) => {
        let responseQuantityBos = QuantityBO.fromJSON(responseJSON)[0];
        return new Promise(function (resolve) {
          resolve(responseQuantityBos);
        })
      })
    }









    /**
     * Returns a Promise, which resolves to an Array of UserBOs
     * 
     * @public
     
    getUsers() {
      return this.#fetchAdvanced(this.#getUsersURL()).then((responseJSON) => {
        let userBOs = UserBO.fromJSON(responseJSON);
        // console.info(usersBOs);
        return new Promise(function (resolve) {
          resolve(userBOs);
        })
      })
    }

    
    * Returns a Promise, which resolves to a CustomerBO
    * 
    * @param {Number} userID to be retrieved
    * @public
    
    getUser(userID) {
      return this.#fetchAdvanced(this.#getUserURL(userID)).then((responseJSON) => {
        // We always get an array of UserBOs.fromJSON, but only need one object
        let responseUserBO = UserBO.fromJSON(responseJSON)[0];
        // console.info(responseUserBO);
        return new Promise(function (resolve) {
          resolve(responseUserBO);
        })
      })
    }
  }
  */

  }
