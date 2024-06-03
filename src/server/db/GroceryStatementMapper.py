from server.bo.GroceryStatement import GroceryStatement
from server.db.Mapper import Mapper

class GroceryStatementMapper (Mapper):

    def __init__(self):
        super().__init__()

    def find_all(self):

        result = []
        cursor = self._cnx.cursor()
        cursor.execute("SELECT * FROM grocerystatement")
        tuples = cursor.fetchall()

        for (id, grocery_name, unit, quantity) in tuples:
            grocerystatement = GroceryStatement()
            grocerystatement.set_id(id)
            grocerystatement.set_grocery_name(grocery_name)
            grocerystatement.set_unit(unit)
            grocerystatement.set_quantity(quantity)
            result.append(grocerystatement)

        self._cnx.commit()
        cursor.close()

        return result

    def find_by_grocery_name(self, grocery_name):
        result = []
        cursor = self._cnx.cursor()
        command = "SELECT id, grocery_name,unit,quantity FROM grocerystatement WHERE grocery_name={} ORDER BY id".format(grocery_name)
        cursor.execute(command)
        tuples = cursor.fetchall()

        for (id,grocery_name,unit,quantity) in tuples:
            grocerystatement = GroceryStatement()
            grocerystatement.set_id(id)
            grocerystatement.set_grocery_name(grocery_name)
            grocerystatement.set_unit(unit)
            grocerystatement.set_quantity(quantity)
            result.append(grocerystatement)

            self._cnx.commit()
            cursor.close()

            return result



    def find_by_key(self, key):
        result = None
        cursor = self._cnx.cursor()
        command = "SELECT id, grocery_name, unit, quantity FROM grocerystatement WHERE id=%s"
        cursor.execute(command, (key,))
        tuples = cursor.fetchall()

        if tuples:
            (id, grocery_name, unit, quantity) = tuples[0]
            grocerystatement = GroceryStatement()
            grocerystatement.set_id(id)
            grocerystatement.set_grocery_name(grocery_name)
            grocerystatement.set_unit(unit)
            grocerystatement.set_quantity(quantity)
            result = grocerystatement

        cursor.close()
        return result

    def find_by_fridge_id(self, fridge_id):

        result = []
        cursor = self._cnx.cursor()
        command = """
            SELECT grocerystatement.id, grocerystatement.grocery_name, grocerystatement.unit, grocerystatement.quantity 
            FROM grocerystatement
            JOIN grocery_in_fridge ON grocerystatement.id = grocery_in_fridge.grocerystatement_id
            WHERE grocery_in_fridge.fridge_id = {}
            ORDER BY grocerystatement.id
            """.format(fridge_id)
        cursor.execute(command)
        tuples = cursor.fetchall()

        for (id, grocery_name, unit, quantity) in tuples:
            grocerystatement = GroceryStatement()
            grocerystatement.set_id(id)
            grocerystatement.set_grocery_name(grocery_name)
            grocerystatement.set_unit(unit)
            grocerystatement.set_quantity(quantity)
            result.append(grocerystatement)

            self._cnx.commit()
            cursor.close()

            return result

    def find_by_recipe_id(self, recipe_id):

        result = []
        cursor = self._cnx.cursor()
        command = """
            SELECT grocerystatement.id, grocerystatement.grocery_name, grocerystatement.unit, grocerystatement.quantity 
            FROM grocerystatement
            JOIN grocery_in_recipe ON grocerystatement.id = grocery_in_recipe.grocerystatement_id
            WHERE grocery_in_recipe.recipe_id = {}
            ORDER BY grocerystatement.id
            """.format(recipe_id)
        cursor.execute(command)
        tuples = cursor.fetchall()

        for (id, grocery_name, unit, quantity) in tuples:
            grocerystatement = GroceryStatement()
            grocerystatement.set_id(id)
            grocerystatement.set_grocery_name(grocery_name)
            grocerystatement.set_unit(unit)
            grocerystatement.set_quantity(quantity)
            result.append(grocerystatement)

            self._cnx.commit()
            cursor.close()

            return result


    def checkGroceryInFridge(self, grocerysatement_id, fridge_id):  #anschauen
        try:
            cursor = self._cnx.cursor()
            command = "SELECT `grocerystatement_id`,`fridge_id` FROM grocery_in_fridge WHERE `grocerystatement_id`={0} AND `fridge_id`={1}".format(
                grocerysatement_id, fridge_id)
            cursor.execute(command)
            tuples = cursor.fetchall()

            if len(tuples) < 1:
                return False
            else:
                return True

        except Exception as e:
            print("exception in checkGroceryInFridge", e)
            return None

    def createGroceryInFridge(self, grocerystatement_id, fridge_id):

            cursor = self._cnx.cursor()
            command = "INSERT INTO grocery_in_fridge (grocerystatement_id, fridge_id) VALUES ('{0}', '{1}')".format(grocerystatement_id, fridge_id)
            cursor.execute(command)
            self._cnx.commit()
            cursor.close()
            return "added grocerysatement. {0} to fridge. {1}".format(grocerystatement_id, fridge_id)
    def deleteGroceryInFridge(self, grocerystatement_id, fridge_id):

        try:
            cursor = self._cnx.cursor()
            command = "DELETE FROM grocery_in_fridge WHERE grocerystatement_id = {0} AND fridge_id =  {1}".format(
                grocerystatement_id, fridge_id)
            cursor.execute(command)
            self._cnx.commit()
            cursor.close()
            return "deleted grocerysatement. {0} from fridge. {1}".format(grocerystatement_id, fridge_id)

        except Exception as e:
            return str(e)


    def checkGroceryInRecipe(self, grocerysatement_id, recipe_id):  #anschauen
        try:
            cursor = self._cnx.cursor()
            command = "SELECT `grocerystatement_id`,`recipe_id` FROM grocery_in_recipe WHERE `grocerystatement_id`={0} AND `recipe_id`={1}".format(
                grocerysatement_id, recipe_id)
            cursor.execute(command)
            tuples = cursor.fetchall()

            if len(tuples) < 1:
                return False
            else:
                return True

        except Exception as e:
            print("exception in checkGroceryInRecipe", e)
            return None

    def createGroceryInRecipe(self, grocerystatement_id, recipe_id):

            cursor = self._cnx.cursor()
            command = "INSERT INTO grocery_in_recipe (grocerystatement_id, recipe_id) VALUES ('{0}', '{1}')".format(grocerystatement_id, recipe_id)
            cursor.execute(command)
            self._cnx.commit()
            cursor.close()
            return "added grocerysatement. {0} to recipe. {1}".format(grocerystatement_id, recipe_id)



    def deleteGroceryInRecipe(self, grocerystatement_id, recipe_id):

        try:
            cursor = self._cnx.cursor()
            command = "DELETE FROM grocery_in_recipe WHERE grocerystatement_id = {0} AND recipe_id =  {1}".format(
                grocerystatement_id, recipe_id)
            cursor.execute(command)
            self._cnx.commit()
            cursor.close()
            return "deleted grocerysatement. {0} from fridge. {1}".format(grocerystatement_id, recipe_id)

        except Exception as e:
            return str(e)




    def insert(self, grocerysatement):

        cursor = self._cnx.cursor()
        cursor.execute("SELECT MAX(id) AS maxid FROM grocerystatement")
        tuples = cursor.fetchall()

        for (maxid) in tuples:
            if maxid[0] is not None:
                grocerysatement.set_id(maxid[0] + 1)
            else:
                grocerysatement.set_id(1)

        command = "INSERT INTO grocerystatement (id, grocery_name, quantity, unit) VALUES (%s,%s,%s,%s)"
        data = (grocerysatement.get_id(), grocerysatement.get_grocery_name(),grocerysatement.get_quantity(),grocerysatement.get_unit())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

        return grocerysatement

    def update(self, grocerystatement):
        cursor = self._cnx.cursor()

        command = "UPDATE grocerystatement SET grocery_name=%s, unit=%s, quantity=%s WHERE id=%s"
        data = (grocerystatement.get_grocery_name(), grocerystatement.get_unit(),
                grocerystatement.get_quantity(), grocerystatement.get_id())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

    def delete(self, grocerystatement):

        cursor = self._cnx.cursor()

        command = "DELETE FROM grocerystatement WHERE id={}".format(grocerystatement.get_id())
        cursor.execute(command)

        self._cnx.commit()
        cursor.close()


if (__name__ == "__main__"):
    with GroceryStatementMapper() as mapper:
        result = mapper.find_all()
        for p in result:
            print(p)