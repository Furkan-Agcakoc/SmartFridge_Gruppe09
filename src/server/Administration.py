from server.bo.Fridge import Fridge
from server.bo.Grocery import Grocery
from server.bo.GroceryStatement import GroceryStatement
from server.bo.Household import Household
from server.bo.Recipe import Recipe
from server.bo.User import User
from server.bo.Measure import Measure

from server.db.FridgeMapper import FridgeMapper
from server.db.GroceryMapper import GroceryMapper
from server.db.GroceryStatementMapper import GroceryStatementMapper
from server.db.HouseholdMapper import HouseholdMapper
from server.db.RecipeMapper import RecipeMapper
from server.db.UserMapper import UserMapper
from server.db.MeasureMapper import MeasureMapper


class Administration():

    def __init__(self):
        pass

    """
    Fridge Spezifische Methoden
    """


    def create_fridge(self, household_id):
        fridge = Fridge()
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

    def get_households_by_user(self, user_id):
        with HouseholdMapper() as mapper:
            return mapper.find_by_user_id(user_id)

    def create_household(self, household_name, owner_id):
        household = Household()
        household.set_household_name(household_name)
        household.set_owner_id(owner_id)
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
            users = self.get_users_by_household_id(household.get_id())

            try:
                for i in fridge:
                    self.delete_fridge(i)

                if len(users) > 0:
                    for i in users:
                        self.delete_inhabitant(i.get_id(), household.get_id())

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

    def create_household_and_fridge(self, household_name, owner_id):
        household = self.create_household(household_name, owner_id)

        fridge = self.create_fridge(household.get_id())

        return household

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

    def create_recipe(self, recipe_name, duration, portion, instruction, user_id, fridge_id):
        recipe = Recipe()
        recipe.set_recipe_name(recipe_name)
        recipe.set_portion(portion)
        recipe.set_instruction(instruction)
        recipe.set_duration(duration)
        recipe.set_user_id(user_id)
        recipe.set_fridge_id(fridge_id)
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

    def get_recipe_by_fridge_id(self, fridge_id):
        """  Wiedergabe des Rezepts mit der Fridge_Id """
        with RecipeMapper() as mapper:
            return mapper.find_by_fridge_id(fridge_id)
    def get_recipe_by_user_id_and_household_id(self, user_id, fridge_id):
        with RecipeMapper() as mapper:
            return mapper.find_recipe_by_user_id_and_fridge_id(user_id, fridge_id)



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
    Grocery Spezifische Methoden
    """

    def create_grocery(self, grocery_name, fridge_id):
        grocery = Grocery()
        grocery.set_grocery_name(grocery_name)
        grocery.set_fridge_id(fridge_id)
        grocery.set_id(1)

        with GroceryMapper() as mapper:
            return mapper.insert(grocery)

    def get_grocery_by_name(self, grocery_name):
        with GroceryMapper() as mapper:
            return mapper.find_by_grocery_name(grocery_name)

    def get_grocery_by_id(self, number):
        with GroceryMapper() as mapper:
            return mapper.find_by_key(number)

    def get_grocery_by_fridge_id(self, fridge_id):
        with GroceryMapper() as mapper:
            return mapper.find_by_fridge_id(fridge_id)

    def get_all_grocery(self):
        with GroceryMapper() as mapper:
            return mapper.find_all()

    def update_grocery(self, grocery):
        with GroceryMapper() as mapper:
            mapper.update(grocery)

    def delete_grocery(self, grocery):
        with GroceryMapper() as mapper:
            if mapper.can_delete_grocery(grocery.get_id()):
                mapper.delete(grocery)
            else:
                return "Lebensmittel kann nicht gelöscht werden, da es im Kühlschrank/Rezept verwendet wird."

    def check_grocery(self, grocerystatement_id, fridge_id):
        with GroceryMapper() as mapper:
            return mapper.checkGroceryInFridge(grocerystatement_id, fridge_id)

    """
    Grocerystatement Spezifische Methoden
    """

    def create_grocerystatement(self, grocery_name, unit, quantity):
        grocerystatement = GroceryStatement()  # anschauen
        grocerystatement.set_grocery_id(grocery_name)
        grocerystatement.set_unit_id(unit)
        grocerystatement.set_quantity(quantity)

        with GroceryStatementMapper() as mapper:
            return mapper.insert(grocerystatement)

    def get_grocerystatement_by_name(self, grocery_name):
        with GroceryStatementMapper() as mapper:
            return mapper.find_by_grocery_name(grocery_name)

    def get_grocerystatement_by_id(self, number):
        with GroceryStatementMapper() as mapper:
            return mapper.find_by_key(number)

    def get_all_grocerystatements(self):
        with GroceryStatementMapper() as mapper:
            return mapper.find_all()

    def get_grocerystatement_by_fridge(self,fridge):
        with GroceryStatementMapper() as mapper:
            return mapper.find_by_fridge_id(fridge)

    def get_grocerystatement_by_recipe(self,recipe):
        with GroceryStatementMapper() as mapper:
            return mapper.find_by_recipe_id(recipe)

    def update_grocerystatement(self, grocerystatement):
        with GroceryStatementMapper() as mapper:
            mapper.update(grocerystatement)

    def delete_grocerystatement(self, grocerystatement):
        with GroceryStatementMapper() as mapper:
            mapper.delete(grocerystatement)




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
            # Check if the user is an owner of any households
            households = self.get_households_by_user(user.get_id())
            for household in households:
                if household.get_owner_id() == user.get_id():
                    self.delete_household(household)

            # Continue with the rest of the method
            recipe = self.get_recipe_by_user_id(user.get_id())
            inhabitants = self.get_inhabitant_by_user_id(user.get_id())

            try:
                for r in recipe:
                    self.delete_recipe(r)
            except Exception as e:
                print("Error in delete_user in Administration: " + str(e))
                u = "Error in delete_user in Administration: " + str(e)

            try:
                for i in inhabitants:
                    self.delete_inhabitant(i)
            except Exception as e:
                print("Error in delete_inhabitant in Administration: " + str(e))
                u = "Error in delete_inhabitant in Administration: " + str(e)

            try:
                u = mapper.delete(user)
            except Exception as e:
                u = str(e) + " error in del user"

            return u



    '''
    #inhabitent 
    '''

    def create_inhabitant(self, user_id, household_id):
        with HouseholdMapper() as mapper:
            return mapper.createInhabitant(user_id, household_id)


    def delete_inhabitant(self, user_id, household_id):
        with HouseholdMapper() as mapper:

            recipe = self.get_recipe_by_user_id_and_household_id(user_id, household_id)

            try:
                for r in recipe:
                    self.delete_recipe(r)
            except Exception as e:
                print("Error in delete_inhabitant in Administration: " + str(e))
                return "Error in delete_inhabitant in Administration: " + str(e)

            try:
                i = mapper.deleteInhabitant(user_id, household_id)
            except Exception as e:
                i = str(e) + " error in del user"

            return i


    def get_users_by_household_id(self, household_id):

        with HouseholdMapper() as mapper:
            user_ids = mapper.get_users_by_household_id(household_id)
            result = []

            for i in user_ids:
                r = self.get_user_by_id(i)
                result.append(r)
            return result

    def get_inhabitant_by_user_id(self, user_id):
        with UserMapper() as mapper:
            return mapper.find_by_user_id(user_id)

    """
    Grocery_In_Fridge Spezifische Methoden
    """
    def create_grocery_in_frige(self, grocerystatement_id, fridge_id):
        with GroceryStatementMapper() as mapper:
            return mapper.createGroceryInFridge(grocerystatement_id, fridge_id)


    def delete_grocery_in_frige(self, grocerystatement_id, fridge_id):
        with GroceryStatementMapper() as mapper:
            return mapper.deleteGroceryInFridge(grocerystatement_id, fridge_id)

    def get_grocery_in_fridge(self, fridge_id):
        with GroceryStatementMapper() as mapper:
            return mapper.find_by_fridge_id(fridge_id)


    """
    Grocery_in_Recipe Spezifische Methoden
    """

    def create_grocery_in_recipe(self, grocerystatement_id, recipe_id):
        with GroceryStatementMapper() as mapper:
            return mapper.createGroceryInRecipe(grocerystatement_id, recipe_id)

    def delete_grocery_in_recipe(self, grocerystatement_id, recipe_id):
        with GroceryStatementMapper() as mapper:
            return mapper.deleteGroceryInRecipe(grocerystatement_id, recipe_id)

    def get_grocery_in_recipe(self, recipe_id):
        with GroceryStatementMapper() as mapper:
            return mapper.find_by_recipe_id(recipe_id)


    """
    Measure Spezifische Methoden
    """

    def create_measure(self, unit, fridge_id):
        measure = Measure()
        measure.set_unit(unit)
        measure.set_fridge_id(fridge_id)
        measure.set_id(1)

        with MeasureMapper() as mapper:
            return mapper.insert(measure)

    def get_measure_by_id(self, number):
        with MeasureMapper() as mapper:
            return mapper.find_by_key(number)

    def get_all_measures(self):
        with MeasureMapper() as mapper:
            return mapper.find_all()

    def get_measure_by_unit(self, unit):
        with MeasureMapper() as mapper:
            return mapper.find_by_unit_name(unit)

    def get_measure_by_fridge_id(self,fridge_id):
        with MeasureMapper() as mapper:
            return mapper.find_measure_by_fridge_id(fridge_id)

    def update_measure(self, measure):
        with MeasureMapper() as mapper:
            mapper.update(measure)

    def delete_measure(self, measure):
        with MeasureMapper() as mapper:
            if mapper.can_delete_measure(measure.get_id()):
                mapper.delete(measure)
            else:
                return "Einheit kann nicht gelöscht werden, da es im Kühlschrank/Rezept verwendet wird."

    """
    Abgleichen Kühlschrank Rezept
    """
    def update_gs(self,gs):
        with GroceryStatementMapper() as mapper:
            mapper.update_grocerystatement_quantity(gs)

    def convert_unit(self, value, unit_from_id, unit_to_id):
        unit_from = self.get_measure_by_id(unit_from_id).get_unit().lower()
        unit_to = self.get_measure_by_id(unit_to_id).get_unit().lower()

        if (unit_from in ["g", "gramm"] and unit_to in ["kg", "kilogramm"]):
            return value / 1000
        elif (unit_from in ["kg", "kilogramm"] and unit_to in ["g", "gramm"]):
            return value * 1000
        elif (unit_from in ["ml", "milliliter"] and unit_to in ["l", "liter"]):
            return value / 1000
        elif (unit_from in ["l", "liter"] and unit_to in ["ml", "milliliter"]):
            return value * 1000
        else:
            return value

    def are_units_compatible(self, unit_from_id, unit_to_id):
        unit_from = self.get_measure_by_id(unit_from_id).get_unit().lower()
        unit_to = self.get_measure_by_id(unit_to_id).get_unit().lower()

        compatible_units = {
            'g': ['g', 'kg', 'kilogramm', 'gramm'],
            'kg': ['g', 'kg', 'kilogramm', 'gramm'],
            'kilogramm': ['g', 'kg', 'kilogramm', 'gramm'],
            'gramm': ['g', 'kg', 'kilogramm', 'gramm'],
            'ml': ['ml', 'l', 'liter', 'milliliter'],
            'l': ['ml', 'l', 'liter', 'milliliter'],
            'liter': ['ml', 'l', 'liter', 'milliliter'],
            'milliliter': ['ml', 'l', 'liter', 'milliliter']
        }

        if unit_from == unit_to:
            return True

        return unit_to in compatible_units.get(unit_from, [])

    def cook_recipe(self, recipe_id, fridge_id):
        recipe_content = self.get_grocerystatement_by_recipe(recipe_id)
        fridge_content = self.get_grocerystatement_by_fridge(fridge_id)
        response_messages = []
        can_cook = True

        # Überprüfung der Zutaten außer "Prise"
        for recipe_grocery in recipe_content:
            recipe_qty, recipe_unit_id = recipe_grocery.get_quantity(), recipe_grocery.get_unit_id()
            recipe_unit = self.get_measure_by_id(recipe_unit_id).get_unit()

            if recipe_unit.lower() == "prise":
                continue  # Ignoriert die Überprüfung für "Prise"

            item_matched = False
            total_fridge_qty = 0

            for fridge_grocery in fridge_content:
                if fridge_grocery.get_grocery_id() == recipe_grocery.get_grocery_id():
                    fridge_unit_id = fridge_grocery.get_unit_id()
                    grocery_name = self.get_grocery_by_id(recipe_grocery.get_grocery_id()).get_grocery_name()

                    if self.are_units_compatible(recipe_unit_id, fridge_unit_id):
                        fridge_qty = self.convert_unit(fridge_grocery.get_quantity(), fridge_unit_id, recipe_unit_id)
                        total_fridge_qty += fridge_qty
                    elif fridge_unit_id == recipe_unit_id:
                        total_fridge_qty += fridge_grocery.get_quantity()

                    item_matched = True  # Zutat wurde im Kühlschrank gefunden

            if not item_matched or total_fridge_qty < recipe_qty:
                grocery_name = self.get_grocery_by_id(recipe_grocery.get_grocery_id()).get_grocery_name()
                missing_qty = recipe_qty - total_fridge_qty
                response_messages.append(f"{missing_qty} {recipe_unit} {grocery_name}")
                can_cook = False

        # Wenn alle benötigten Zutaten vorhanden sind, dann Abzug aus dem Kühlschrank
        if can_cook:
            for recipe_grocery in recipe_content:
                recipe_qty, recipe_unit_id = recipe_grocery.get_quantity(), recipe_grocery.get_unit_id()
                recipe_unit = self.get_measure_by_id(recipe_unit_id).get_unit()

                if recipe_unit.lower() == "prise":
                    continue  # Ignoriert die Abzug für "Prise"

                for fridge_grocery in fridge_content:
                    if fridge_grocery.get_grocery_id() == recipe_grocery.get_grocery_id():
                        fridge_qty = self.convert_unit(fridge_grocery.get_quantity(), fridge_grocery.get_unit_id(),
                                                       recipe_unit_id)
                        new_value = fridge_qty - recipe_qty
                        new_value = max(0, new_value)  # Verhindert negative Werte
                        fridge_grocery.set_quantity(new_value)
                        self.update_gs(fridge_grocery)

            return "Rezept gekocht"
        else:
            return "Rezept kann nicht gekocht werden. Es fehlen: " + ", ".join(response_messages) + "."

    def check_recipes(self, fridge_id):
        recipes = self.get_recipe_by_fridge_id(fridge_id)
        fridge_content = self.get_grocery_in_fridge(fridge_id)

        response_messages = []

        for recipe in recipes:
            recipe_content = self.get_grocerystatement_by_recipe(recipe.get_id())
            missing_ingredients = []
            can_cook = True

            for recipe_grocery in recipe_content:
                recipe_qty, recipe_unit_id = recipe_grocery.get_quantity(), recipe_grocery.get_unit_id()
                recipe_unit = self.get_measure_by_id(recipe_unit_id).get_unit()
                grocery_name = self.get_grocery_by_id(recipe_grocery.get_grocery_id()).get_grocery_name()
                item_matched = False
                not_enough = False
                total_fridge_qty = 0  # Track total quantity available in fridge

                for fridge_grocery in fridge_content:
                    if fridge_grocery.get_grocery_id() == recipe_grocery.get_grocery_id():
                        fridge_unit_id = fridge_grocery.get_unit_id()
                        if recipe_unit.lower() == "prise":
                            fridge_qty = fridge_grocery.get_quantity()
                            if fridge_qty < recipe_qty:
                                not_enough = True
                                continue
                            else:
                                item_matched = True
                                break
                        elif self.are_units_compatible(recipe_unit_id, fridge_unit_id):
                            fridge_qty = self.convert_unit(fridge_grocery.get_quantity(), fridge_unit_id,
                                                           recipe_unit_id)
                            total_fridge_qty += fridge_qty
                            if total_fridge_qty < recipe_qty:
                                not_enough = True
                                continue
                            else:
                                item_matched = True
                                break
                        else:
                            if fridge_unit_id == recipe_unit_id:
                                continue

                if not item_matched and recipe_unit.lower() != "prise":
                    if not_enough:
                        missing_qty = recipe_qty - total_fridge_qty
                        missing_ingredients.append(f"Es fehlen {missing_qty} {recipe_unit} von '{grocery_name}'")
                    else:
                        missing_ingredients.append(f"Es fehlen {recipe_qty} {recipe_unit} von '{grocery_name}'")
                    can_cook = False

            if can_cook:
                response_message = f"{recipe.get_recipe_name()} kann gekocht werden."
            else:
                response_message = f"{recipe.get_recipe_name()} kann nicht gekocht werden. " + ", ".join(
                    missing_ingredients)

            response_messages.append(response_message)

        return response_messages