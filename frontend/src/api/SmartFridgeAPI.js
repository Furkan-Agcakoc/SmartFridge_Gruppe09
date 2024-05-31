import FridgeBO from './FridgeBO';
import GroceryBO from './GroceryBO';
import GroceryStatementBO from './GroceryStatementBO';
import HouseholdBO from './HouseholdBO';
import InhabitantBO from './InhabitantBO';
import RecipeBO from './RecipeBO';
import UserBO from './UserBO';

export default class SmartFridgeAPI {

    // Singelton instance
    static #api = null;


    // Local Python backend
    #SmartFridgeBaseURL = '/bank';

    // Local http-fake-backend
    //#bankServerBaseURL = '/api/bank';

    #currencyFormatter = new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: 'EUR'
    });

    #currency = '€';



    // fridge related
    #getFridgeURL = () => `${this.#SmartFridgeBaseURL}/fridge`;
    #addFridgeURL = () => `${this.#SmartFridgeBaseURL}/fridge`;
    #getFridgeByIdURL = (id) => `${this.#SmartFridgeBaseURL}/fridge/${id}`;
    #updateFridgeURL = (id) => `${this.#SmartFridgeBaseURL}/customers/${id}`;
    #deleteFridgeURL = (id) => `${this.#SmartFridgeBaseURL}/customers/${id}`;


    // grocery related
    #getGroceryURL = () => `${this.#SmartFridgeBaseURL}/grocery`;
    #getGroceryByIdURL = (id) => `${this.#SmartFridgeBaseURL}/grocery/${id}/accounts`;
    #getGroceryByNameURL = (grocery_name) => `${this.#SmartFridgeBaseURL}/grocery/${grocery_name}`;
    #addGroceryURL = () => `${this.#SmartFridgeBaseURL}/grocery`;
    #deleteGroceryURL = (id) => `${this.#SmartFridgeBaseURL}/grocery/${id}`;
    #updateGroceryURL = (id) => `${this.#SmartFridgeBaseURL}/grocery/${id}`;

    // groceryStatement related
    #getGroceryStatementURL = (grocery_name) => `${this.#SmartFridgeBaseURL}/groceryStatement/}`;
    #getGroceryStatementByIdURL = (id) => `${this.#SmartFridgeBaseURL}/groceryStatement/${id}`;
    #addGroceryStatementURL = () => `${this.#SmartFridgeBaseURL}/groceryStatement`;
    #deleteGroceryStatementURL = (id) => `${this.#SmartFridgeBaseURL}/groceryStatement/${id}`;
    #updateGroceryStatementURL = (id) => `${this.#SmartFridgeBaseURL}/groceryStatement/${id}`;

    // household related
    #getHouseholdURL = (grocery_name) => `${this.#SmartFridgeBaseURL}/Household/}`;
    #getHouseholdByIdURL = (id) => `${this.#SmartFridgeBaseURL}/Household/${id}`;
    #addHouseholdURL = () => `${this.#SmartFridgeBaseURL}/Household`;
    #deleteHouseholdURL = (id) => `${this.#SmartFridgeBaseURL}/Household/${id}`;
    #updateHouseholdURL = (id) => `${this.#SmartFridgeBaseURL}/Household/${id}`;

    // inhabitant related
    #addInhabitantURL = () => `${this.#SmartFridgeBaseURL}/inhabitant`;
    #getInhabitantURL = (household_id) => `${this.#SmartFridgeBaseURL}/inhabitant/${household_id}`;
    #deleteInhabitantURL = (id) => `${this.#SmartFridgeBaseURL}/inhabitant/${id}`;

    // recipe related
    #getRecipeURL = () => `${this.#SmartFridgeBaseURL}/recipe/}`;
    #getRecipeByNameURL = (recipe_name) => `${this.#SmartFridgeBaseURL}/recipe/${recipe_name}}`;
    #getRecipeByIdURL = (id) => `${this.#SmartFridgeBaseURL}/recipe/${id}`;
    #addRecipeURL = () => `${this.#SmartFridgeBaseURL}/recipe`;
    #deleteRecipeURL = (id) => `${this.#SmartFridgeBaseURL}/recipe/${id}`;
    #updateRecipeURL = (id) => `${this.#SmartFridgeBaseURL}/recipe/${id}`;

    // user related
    #getUserURL = () => `${this.#SmartFridgeBaseURL}/user/}`;
    #getUserByGoogleIdURL = (google_user_id) => `${this.#SmartFridgeBaseURL}/user/google_user_id/${google_user_id}}`;
    #getUserByIdURL = (id) => `${this.#SmartFridgeBaseURL}/user/${id}`;
    #addUserURL = () => `${this.#SmartFridgeBaseURL}/user`;
    #deleteUserURL = (id) => `${this.#SmartFridgeBaseURL}/user/${id}`;
    #updateUserURL = (id) => `${this.#SmartFridgeBaseURL}/user/${id}`;



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


    /**  fridge related  **/


    getFridge() {
        return this.#fetchAdvanced(this.#getFridgeURL()).then((responseJSON) => {
            let fridgeBO = FridgeBO.fromJSON(responseJSON);
            return new Promise(function (resolve) {
                resolve(fridgeBO);
            })
        })
    }

    getFridgeById(fridgeID) {
        return this.#fetchAdvanced(this.#getFridgeByIdURL(fridgeID)).then((responseJSON) => {
            let responseFridgeBO = FridgeBO.fromJSON(responseJSON)[0];
            return new Promise(function (resolve) {
                resolve(responseFridgeBO);
            })
        })
    }

    addFridge(fridgeBO) {
        return this.#fetchAdvanced(this.#addFridgeURL(), {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain',
                'Content-type': 'application/json',
            },
            body: JSON.stringify(fridgeBO)
        }).then((responseJSON) => {
            let responseFridgeBO = FridgeBO.fromJSON(responseJSON)[0];
            return new Promise(function (resolve) {
                resolve(responseFridgeBO);
            })
        })
    }

    updateFridge(fridgeBO) {
        return this.#fetchAdvanced(this.#updateFridgeURL(fridgeBO.getID()), {
            method: 'PUT',
            headers: {
                'Accept': 'application/json, text/plain',
                'Content-type': 'application/json',
            },
            body: JSON.stringify(FridgeBO)
        }).then((responseJSON) => {
            let responseFridgeBO = FridgeBO.fromJSON(responseJSON)[0];
            return new Promise(function (resolve) {
                resolve(responseFridgeBO);
            })
        })
    }

    deleteFridge(fridgeID) {
        return this.#fetchAdvanced(this.#deleteFridgeURL(fridgeID), {
            method: 'DELETE'
        }).then((responseJSON) => {
            let responseFridgeBO = FridgeBO.fromJSON(responseJSON)[0];
            return new Promise(function (resolve) {
                resolve(responseFridgeBO);
            })
        })
    }


    /**  grocery related  **/

    getGrocery() {
        return this.#fetchAdvanced(this.#getGroceryURL()).then((responseJSON) => {
            let GroceryBOs = GroceryBO.fromJSON(responseJSON);
            return new Promise(function (resolve) {
                resolve(GroceryBOs);
            })
        })
    }

    getGroceryById(groceryID) {
        return this.#fetchAdvanced(this.#getGroceryByIdURL(groceryID)).then((responseJSON) => {
            let responseGroceryBO = GroceryBO.fromJSON(responseJSON);
            return new Promise(function (resolve) {
                resolve(responseGroceryBO);
            })
        })
    }

    getGroceryByName(groceryName) {
        return this.#fetchAdvanced(this.#getGroceryByNameURL(groceryName)).then((responseJSON) => {
            let responseGroceryBO = GroceryBO.fromJSON(responseJSON)[0];
            return new Promise(function (resolve) {
                resolve(responseGroceryBO);
            })
        })
    }

    deleteGrocery(groceryID) {
        return this.#fetchAdvanced(this.#deleteGroceryURL(groceryID), {
            method: 'DELETE'
        }).then((responseJSON) => {
            // We always get an array of CustomerBOs.fromJSON
            let responseGroceryBOs = GroceryBO.fromJSON(responseJSON)[0];
            // console.info(accountBOs);
            return new Promise(function (resolve) {
                resolve(responseGroceryBOs);
            })
        })
    }

    addGrocery(groceryBO) {
        return this.#fetchAdvanced(this.#addGroceryURL(), {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain',
                'Content-type': 'application/json',
            },
            body: JSON.stringify(groceryBO)
        }).then((responseJSON) => {
            let responseGroceryBO = GroceryBO.fromJSON(responseJSON)[0];
            return new Promise(function (resolve) {
                resolve(responseGroceryBO);
            })
        })
    }

    updateGrocery(groceryBO) {
        return this.#fetchAdvanced(this.#updateGroceryURL(groceryBO.getID()), {
            method: 'PUT',
            headers: {
                'Accept': 'application/json, text/plain',
                'Content-type': 'application/json',
            },
            body: JSON.stringify(groceryBO)
        }).then((responseJSON) => {
            let responseGroceryBO = GroceryBO.fromJSON(responseJSON)[0];
            return new Promise(function (resolve) {
                resolve(responseGroceryBO);
            })
        })
    }

    /**  GroceryStatement related **/

    getGroceryStatement() {
        return this.#fetchAdvanced(this.#getGroceryStatementURL()).then((responseJSON) => {
            let GroceryStatementBOs = GroceryStatementBO.fromJSON(responseJSON);
            return new Promise(function (resolve) {
                resolve(GroceryStatementBOs);
            })
        })
    }

    getGroceryStatementById(groceryStatementID) {
        return this.#fetchAdvanced(this.#getGroceryStatementByIdURL(groceryStatementID)).then((responseJSON) => {
            let responseGroceryStatementBO = GroceryStatementBO.fromJSON(responseJSON);
            return new Promise(function (resolve) {
                resolve(responseGroceryStatementBO);
            })
        })
    }

    deleteGroceryStatement(groceryStatementID) {
        return this.#fetchAdvanced(this.#deleteGroceryStatementURL(groceryStatementID), {
            method: 'DELETE'
        }).then((responseJSON) => {
            // We always get an array of CustomerBOs.fromJSON
            let responseGroceryStatementBO = GroceryStatementBO.fromJSON(responseJSON)[0];
            // console.info(accountBOs);
            return new Promise(function (resolve) {
                resolve(responseGroceryStatementBO);
            })
        })
    }

    addGroceryStatement(groceryStatementBO) {
        return this.#fetchAdvanced(this.#addGroceryStatementURL(), {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain',
                'Content-type': 'application/json',
            },
            body: JSON.stringify(groceryStatementBO)
        }).then((responseJSON) => {
            let responseGroceryStatementBO = GroceryStatementBO.fromJSON(responseJSON)[0];
            return new Promise(function (resolve) {
                resolve(responseGroceryStatementBO);
            })
        })
    }

    updateGroceryStatement(groceryStatementBO) {
        return this.#fetchAdvanced(this.#updateGroceryStatementURL(groceryStatementBO.getID()), {
            method: 'PUT',
            headers: {
                'Accept': 'application/json, text/plain',
                'Content-type': 'application/json',
            },
            body: JSON.stringify(groceryStatementBO)
        }).then((responseJSON) => {
            let responseGroceryStatementBO = GroceryStatementBO.fromJSON(responseJSON)[0];
            return new Promise(function (resolve) {
                resolve(responseGroceryStatementBO);
            })
        })
    }

    /** Household related  **/

    getHousehold() {
        return this.#fetchAdvanced(this.#getHouseholdURL()).then((responseJSON) => {
            let HouseholdBOs = HouseholdBO.fromJSON(responseJSON);
            return new Promise(function (resolve) {
                resolve(HouseholdBOs);
            })
        })
    }

    getHouseholdById(householdID) {
        return this.#fetchAdvanced(this.#getHouseholdByIdURL(householdID)).then((responseJSON) => {
            let responseHouseholdBO = HouseholdBO.fromJSON(responseJSON);
            return new Promise(function (resolve) {
                resolve(responseHouseholdBO);
            })
        })
    }

    deleteHousehold(householdID) {
        return this.#fetchAdvanced(this.#deleteHouseholdURL(householdID), {
            method: 'DELETE'
        }).then((responseJSON) => {
            // We always get an array of CustomerBOs.fromJSON
            let responseHouseholdBO = HouseholdBO.fromJSON(responseJSON)[0];
            // console.info(accountBOs);
            return new Promise(function (resolve) {
                resolve(responseHouseholdBO);
            })
        })
    }

    addHouseHold(householdBO) {
        return this.#fetchAdvanced(this.#addHouseholdURL(), {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain',
                'Content-type': 'application/json',
            },
            body: JSON.stringify(householdBO)
        }).then((responseJSON) => {
            let responseHouseholdBO = HouseholdBO.fromJSON(responseJSON)[0];
            return new Promise(function (resolve) {
                resolve(responseHouseholdBO);
            })
        })
    }

    updateHousehold(householdBO) {
        return this.#fetchAdvanced(this.#updateHouseholdURL(householdBO.getID()), {
            method: 'PUT',
            headers: {
                'Accept': 'application/json, text/plain',
                'Content-type': 'application/json',
            },
            body: JSON.stringify(HouseholdBO)
        }).then((responseJSON) => {
            let responseGroceryStatementBO = GroceryStatementBO.fromJSON(responseJSON)[0];
            return new Promise(function (resolve) {
                resolve(responseGroceryStatementBO);
            })
        })
    }

    /** inhabitant related **/


    getInhabitant() {
        return this.#fetchAdvanced(this.#getInhabitantURL()).then((responseJSON) => {
            let inhabitantBOs = InhabitantBO.fromJSON(responseJSON);
            return new Promise(function (resolve) {
                resolve(inhabitantBOs);
            })
        })
    }


    addInhabitant(inhabitantBO) {
        return this.#fetchAdvanced(this.#addInhabitantURL(), {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain',
                'Content-type': 'application/json',
            },
            body: JSON.stringify(inhabitantBO)
        }).then((responseJSON) => {
            let responseInhabitantBO = InhabitantBO.fromJSON(responseJSON)[0];
            return new Promise(function (resolve) {
                resolve(responseInhabitantBO);
            })
        })
    }


    deleteInhabitant(inhabitantID) {
        return this.#fetchAdvanced(this.#deleteInhabitantURL(inhabitantID), {
            method: 'DELETE'
        }).then((responseJSON) => {
            let responseInhabitantBO = InhabitantBO.fromJSON(responseJSON)[0];
            return new Promise(function (resolve) {
                resolve(responseInhabitantBO);
            })
        })
    }




    /**
     * Returns a Promise, which resolves to an Array of AccountBOs
     *
     * @param {Number} customerID for which the the accounts should be retrieved
     * @public
     */
    getAllAccounts() {
        return this.#fetchAdvanced(this.#getAllAccountsURL())
            .then((responseJSON) => {
                let accountBOs = AccountBO.fromJSON(responseJSON);
                // console.info(accountBOs);
                return new Promise(function (resolve) {
                    resolve(accountBOs);
                })
            })
    }


    /**
     * Returns a Promise, which resolves to an Array of AccountBOs
     *
     * @param {Number} customerID for which the the accounts should be retrieved
     * @public
     */
    getAccountsForCustomer(customerID) {
        return this.#fetchAdvanced(this.#getAccountsForCustomerURL(customerID))
            .then((responseJSON) => {
                let accountBOs = AccountBO.fromJSON(responseJSON);
                // console.info(accountBOs);
                return new Promise(function (resolve) {
                    resolve(accountBOs);
                })
            })
    }

    /**
     * Deletes the given account and returns a Promise, which resolves to an AccountBO
     *
     * @param accountID to be deleted
     * @public
     */
    deleteAccount(accountID) {
        return this.#fetchAdvanced(this.#deleteAccountIdURL(accountID), {
            method: 'DELETE'
        })
            .then((responseJSON) => {
                // We always get an array of AccountBO.fromJSON, but only need one object
                let accountBOs = AccountBO.fromJSON(responseJSON)[0];
                // console.info(accountBOs);
                return new Promise(function (resolve) {
                    resolve(accountBOs);
                })
            })
    }

    /**
     * Returns a Promise, which resolves to an AccountBOs
     *
     * @param {Number} customerID for which the the accounts should be added to
     * @public
     */
    addAccountForCustomer(customerID) {
        return this.#fetchAdvanced(this.#addAccountsForCustomerURL(customerID), {
            method: 'POST'
        })
            .then((responseJSON) => {
                // We always get an array of AccountBO.fromJSON, but only need one object
                let accountBO = AccountBO.fromJSON(responseJSON)[0];
                // console.info(accountBO);
                return new Promise(function (resolve) {
                    // We expect only one new account
                    resolve(accountBO);
                })
            })
    }

    /**
     * Returns a Promise, which resolves to a balance
     *
     * @param {Number} accountID for which the balance should be retrieved
     * @public
     */
    getBalanceOfAccount(accountBO) {
        return this.#fetchAdvanced(this.#getBalanceForAccountURL(accountBO))
            .then(responseJSON => {
                // console.log(responseJSON)
                return new Promise(function (resolve) {
                    resolve(responseJSON);
                })
            })
    }

    /**
     * Returns a Promise, which resolves to an Array of TransactionBOs
     *
     * @param {Number} accountID for which the credit transactions should be retrieved
     * @public
     */
    getCreditsForAccount(accountID) {
        return this.#fetchAdvanced(this.#getCreditsForAccountIdURL(accountID))
            .then(responseJSON => {
                let transactionBOs = TransactionBO.fromJSON(responseJSON);
                // console.info(transactionBOs);
                return new Promise(function (resolve) {
                    resolve(transactionBOs);
                })
            })
    }

    /**
     * Returns a Promise, which resolves to an Array of TransactionBOs
     *
     * @param {Number} accountID for which the debit transactions should be retrieved
     * @public
     */
    getDebitsForAccount(accountID) {
        return this.#fetchAdvanced(this.#getDebitsForAccountIdURL(accountID))
            .then(responseJSON => {
                let transactionBOs = TransactionBO.fromJSON(responseJSON);
                // console.info(transactionBOs);
                return new Promise(function (resolve) {
                    resolve(transactionBOs);
                })
            })
    }

    /**
     * Returns a Promise, which resolves to the new TransactionBO
     *
     * @param {TransactionBO} transaction object
     * @public
     */
    addTransaction(transaction) {
        return this.#fetchAdvanced(this.#addTransactionURL(), {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain',
                'Content-type': 'application/json',
            },
            body: JSON.stringify(transaction)
        }).then((responseJSON) => {
            // We always get an array of TransactionBO.fromJSON, but only need one object
            let tansactionBO = TransactionBO.fromJSON(responseJSON)[0];
            // console.info(accountBO);
            return new Promise(function (resolve) {
                // We expect only one new account
                resolve(tansactionBO);
            })
        })
    }
}
