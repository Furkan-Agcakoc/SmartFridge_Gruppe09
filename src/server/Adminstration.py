from server.bo.Fridge import Fridge
from server.bo.Groceries import Groceries
from server.bo.GroceriesStatement import GroceriesStatement
from server.bo.Household import Household
from server.bo.Measure import Measure
from server.bo.Quantity import Quantity
from server.bo.Recipe import Recipe
from server.bo.User import User

from server.db.FridgeMapper import FridgeMapper
from server.db.GroceriesMapper import GroceriesMapper
from server.db.GroceriesStatementMapper import GroceriesStatementMapper
from server.db.HouseholdMapper import HouseholdMapper
from server.db.RecipeMapper import RecipeMapper
from server.db.UserMapper import UserMapper

class Adminstration (object):


    def __init__(self):
        pass


    """
    Fridge Spezifische Methoden
    """
    def create_fridge(self,fridge_name):

        fridge = Fridge()
        fridge.set_fridge_name(fridge_name)
        fridge.set_id(1)

        with FridgeMapper() as mapper:
            return mapper.insert(fridge)

    def get_fridge_by_name(self,fridge_name):

        with FridgeMapper() as mapper:
            return mapper.find_by_fride_name(fridge_name)

    def get_fridge_by_id(self, number):

        with FridgeMapper() as mapper:
            return mapper.find_by_key(number)


    '''  def get_fridge_of_household(self,household): #müssen die logik prüfen
            with FridgeMapper() as mapper:
                return mapper.find_by_household_id(household.get_id())'''


    def get_all_fridges(self):

        with FridgeMapper() as mapper:
            return mapper.find_all()


    def update_fridge(self,frdige):

        with FridgeMapper() as mapper:
            mapper.update(frdige)

    def delete_fridge(self,fridge):

        with FridgeMapper() as mapper:
            mapper.delete(fridge)



    """
    Haushalt Spezifische Methoden
    """

    def create_household(self,household_name):
        household = Household()
        household.set_household_name(household_name)
        household.set_id(1)

        with HouseholdMapper() as mapper:
            return mapper.insert(household)

    def get_household_by_name(self,household_name):

        with HouseholdMapper() as mapper:
           return mapper.find_by_household_name(household_name)


    def get_household_by_id(self,number):

        with HouseholdMapper() as mapper:
            return mapper.find_by_key(number)


    def get_all_householdes(self):

        with HouseholdMapper() as mapper:
            mapper.find_all()

    def update_household(self,household):

        with HouseholdMapper() as mapper:
            mapper.update(household)


   """ def delete_household(self,household):

        with HouseholdMapper() as mapper:
            fridge = self.get_fridge_of_household(household)

            if not(fridge is None):
                for a in fridge:
                    self.delete_fridge(a)

            mapper.delete(household)"""


    """Recipe Spezifische Methoden"""


    def create_recipe(self, recipe_name):
        recipe = Recipe()
        recipe.set_recipe_name(recipe_name)
        recipe.set_id(1)

        with RecipeMapper() as mapper:
            return mapper.insert(recipe)


    def get_recipe_by_name(self, recipe_name):
        with RecipeMapper() as mapper:
            return mapper.find_by_recipe_name(recipe_name)


    def get_recipe_by_id(self, number):
        with RecipeMapper() as mapper:
            return mapper.find_by_key(number)


    def get_all_recipes(self):
        with RecipeMapper() as mapper:
            return mapper.find_all()


    def update_recipe(self, recipe):
        with RecipeMapper() as mapper:
            mapper.update(recipe)

    def delete_recipe(self, recipe):
        with RecipeMapper() as mapper:
            mapper.delete(recipe)


"""Groceries Spezifische Methoden"""


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


