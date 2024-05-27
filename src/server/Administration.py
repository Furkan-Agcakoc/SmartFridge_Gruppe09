from server.bo.Fridge import Fridge
from server.bo.Groceries import Groceries
from server.bo.GroceriesStatement import GroceriesStatement
from server.bo.Household import Household
from server.bo.Recipe import Recipe
from server.bo.User import User

from server.db.FridgeMapper import FridgeMapper
from server.db.GroceriesMapper import GroceriesMapper
from server.db.GroceriesStatementMapper import GroceriesStatementMapper
from server.db.HouseholdMapper import HouseholdMapper
from server.db.RecipeMapper import RecipeMapper
from server.db.UserMapper import UserMapper


class Administration():

    def __init__(self):
        pass

    """
    Fridge Spezifische Methoden
    """


    def create_fridge(self, fridge_name, household_id):
        fridge = Fridge()
        fridge.set_fridge_name(fridge_name)
        fridge.set_household_id(household_id)
        fridge.set_id(1)

        with FridgeMapper() as mapper:
            return mapper.insert(fridge)

    def get_frdige_by_household_id(self, household_id):
        """  Wiedergabe des Kühlschranks eines Haushalts """
        with FridgeMapper() as mapper:
            return mapper.find_by_household_id(household_id)

    def get_fridge_by_id(self, number):
        with FridgeMapper() as mapper:
            return mapper.find_by_key(number)

    def get_fridge_of_household(self, household_id):  # müssen die logik prüfen
        with FridgeMapper() as mapper:
            return mapper.find_by_household_id(household_id) #prüfen

    def get_all_fridges(self):
        with FridgeMapper() as mapper:
            return mapper.find_all()

    def update_fridge(self, fridge):
        with FridgeMapper() as mapper:
            mapper.update(fridge)

    def delete_fridge(self, fridge):
        with FridgeMapper() as mapper:
            mapper.delete(fridge)

    """
    Haushalt Spezifische Methoden
    """

    def create_household(self, household_name):
        household = Household()
        household.set_household_name(household_name)
        household.set_id(1)

        with HouseholdMapper() as mapper:
            return mapper.insert(household)

    def get_household_by_name(self, household_name):
        with HouseholdMapper() as mapper:
            return mapper.find_by_household_name(household_name)

    def get_household_by_id(self, number):
        with HouseholdMapper() as mapper:
            return mapper.find_by_key(number)

    def get_all_householdes(self):
        with HouseholdMapper() as mapper:
            return mapper.find_all()

    def update_household(self, household):
        with HouseholdMapper() as mapper:
            mapper.update(household)

    def delete_household(self, household):
        with HouseholdMapper() as mapper:

            fridge = self.get_frdige_by_household_id(household.get_id())
            users = self.get_users_by_householdid(household.get_id())

            try:
                for i in fridge:
                    self.delete_fridge(i)

                if len(users) > 0:
                    for i in users:
                        self.delete_inhabitant(i.get_id(), household.get_id(), outercall=True)

                if i in fridge:
                    self.delete_fridge(i)

            except Exception as e:
                print("Error in delete_household in Administration: " + str(e))
                house = "Error in delete_household in Administration: " + str(e)

            try:
                house = mapper.delete(household)
            except Exception as e:
                house = str(e) + " error in del household"

            return house

    """
    def delete_household(self, household):  # prüfen
        with HouseholdMapper() as mapper:
            fridge = self.get_fridge_of_household(household)

            if not (fridge is None):
                for a in fridge:
                    self.delete_fridge(a)

            mapper.delete(household)

    """



    """
    Recipe Spezifische Methoden
    """

    def create_recipe(self, recipe_name, duration, portions, instruction, user_id, household_id):
        recipe = Recipe()
        recipe.set_recipe_name(recipe_name)
        recipe.set_portions(portions)
        recipe.set_instruction(instruction)
        recipe.set_duration(duration)
        recipe.set_user_id(user_id)
        recipe.set_household_id(household_id)
        recipe.set_id(1)

        with RecipeMapper() as mapper:
            return mapper.insert(recipe)

    def get_recipe_by_name(self, recipe_name):
        with RecipeMapper() as mapper:
            return mapper.find_by_recipe_name(recipe_name)

    def get_recipe_by_id(self, number):
        with RecipeMapper() as mapper:
            return mapper.find_by_key(number)


    def get_recipe_by_user_id(self, user_id):
        """  Wiedergabe deines Rezepts mit der User_Id """
        with RecipeMapper() as mapper:
            return mapper.find_by_user_id(user_id)

    def get_recipe_by_household_id(self, household_id):
        """  Wiedergabe deines Rezepts mit der Household_Id """
        with RecipeMapper() as mapper:
            return mapper.find_by_household_id(household_id)



    def get_all_recipe(self):
        with RecipeMapper() as mapper:
            return mapper.find_all()

    def update_recipe(self, recipe):
        with RecipeMapper() as mapper:
            mapper.update(recipe)

    def delete_recipe(self, recipe):
        with RecipeMapper() as mapper:
            mapper.delete(recipe)

   # def get_recipe_by_user(self, user_id):
   #    with RecipeMapper() as mapper:
      #      return mapper.find_by_user_id(user_id)


#recipe of user?

    """
    Groceries Spezifische Methoden
    """

    def create_groceries(self, groceries_name):
        groceries = Groceries()
        groceries.set_groceries_name(groceries_name)
        groceries.set_id(1)

        with GroceriesMapper() as mapper:
            return mapper.insert(groceries)

    def get_groceries_by_name(self, groceries_name):
        with GroceriesMapper() as mapper:
            return mapper.find_by_groceries_name(groceries_name)

    def get_groceries_by_id(self, number):
        with GroceriesMapper() as mapper:
            return mapper.find_by_key(number)

    def get_all_groceries(self):
        with GroceriesMapper() as mapper:
            return mapper.find_all()

    def update_groceries(self, groceries):
        with GroceriesMapper() as mapper:
            mapper.update(groceries)

    def delete_groceries(self, groceries):
        with GroceriesMapper() as mapper:
            mapper.delete(groceries)

    """
    Groceriesstatement Spezifische Methoden
    """

    def create_groceriesstatement(self, groceries_name, description, quantity):
        groceriesstatement = GroceriesStatement()  # anschauen
        groceriesstatement.set_groceries_name(groceries_name)
        groceriesstatement.set_description(description)
        groceriesstatement.set_quantity(quantity)

        with GroceriesStatementMapper() as mapper:
            return mapper.insert(groceriesstatement)

    def get_groceriesstatement_by_name(self, groceries_name):
        with GroceriesStatementMapper() as mapper:
            return mapper.find_by_groceries_name(groceries_name)

    def get_groceriesstatement_by_id(self, number):
        with GroceriesStatementMapper() as mapper:
            return mapper.find_by_key(number)

    def get_all_groceriesstatements(self):
        with GroceriesStatementMapper() as mapper:
            return mapper.find_all()

    def get_groceriesstatement_by_fridge(self,fridge):
        with GroceriesStatementMapper() as mapper:
            return mapper.find_by_fridge_id(fridge) #prüfen

    def update_groceriesstatement(self, groceriesstatement):
        with GroceriesStatementMapper() as mapper:
            mapper.update(groceriesstatement)

    def delete_groceriesstatement(self, groceriesstatement):
        with GroceriesStatementMapper() as mapper:
            mapper.delete(groceriesstatement)

    """
       User Spezifische Methoden
    """

    def create_user(self, firstname, lastname, nickname,email,google_user_id):
        user = User()
        user.set_firstname(firstname)
        user.set_lastname(lastname)
        user.set_nickname(nickname)
        user.set_email(email)
        user.set_google_user_id(google_user_id)
        user.set_id(1)
        with UserMapper() as mapper:
            return mapper.insert(user)

    #user of household

    def get_user_by_firstname(self, firstsname):
        with UserMapper() as mapper:
            return mapper.find_by_firstname(firstsname)

    def get_user_by_lastname(self, lastname):
        with UserMapper() as mapper:
            return mapper.find_by_lastname(lastname)

    def get_user_by_nickname(self, nickname):
        with UserMapper() as mapper:
            return mapper.find_by_nickname(nickname)

    def get_user_by_email(self, email):
        with UserMapper() as mapper:
            return mapper.find_by_email(email)


    def get_user_by_id(self,number):
        with UserMapper() as mapper:
            return mapper.find_by_key(number)

    def get_user_by_google_user_id(self, id):
        with UserMapper() as mapper:
            return mapper.find_by_google_user_id(id)


    def get_all_users(self):
        with UserMapper() as mapper:
            return mapper.find_all()

    def update_user(self, user):
        with UserMapper() as mapper:
            return mapper.update(user)

    def delete_user(self, user):
        with UserMapper() as mapper:

            recipe = self.get_recipe_by_user_id(user.get_id())

            try:
                for i in recipe:
                    self.delete_recipe(i)

            except Exception as e:
                print("Error in delete_user in Administration: " + str(e))
                u = "Error in delete_user in Administration: " + str(e)

            try:
                u = mapper.delete(user)
            except Exception as e:
                u = str(e) + " error in del user"

            return u



    '''
#inhabitent '''

    def create_inhabitant(self, user_id, household_id):

        with HouseholdMapper() as mapper:
            return mapper.createMembership(user_id, household_id)

    def delete_inhabitant(self, user_id, household_id, outercall=False):

        with HouseholdMapper() as mapper:
            a = mapper.deleteMembership(user_id, household_id)
            if outercall == False:
                if len(self.get_users_by_householdid(household_id)) < 1:
                    house = self.get_household_by_id(household_id)
                    self.delete_household(house)
                    print("deleted household {0} ".format(str(house)))
            return a

    def get_users_by_householdid(self, household_id):

        with HouseholdMapper() as mapper:
            user_ids = mapper.get_users_by_household_id(household_id)
            result = []

            # creating user objects from ids
            for i in user_ids:
                r = self.get_user_by_id(i)
                result.append(r)
            return result




