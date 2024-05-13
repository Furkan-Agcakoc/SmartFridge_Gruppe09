from server.bo.Recipe import Recipe
from server.db.Mapper import Mapper

class RecipeMapper (Mapper):

    def __int__(self):
        super().__init__()

    def find_all (self):

        result = []

        cursor = self._cnx.cursor()
        cursor.execute("SELECT * from recipe")
        tuples = cursor.fetchall()

        for (id, recipe_name, duration, portions, instruction, user_id, groceriesstatement_id) in tuples:
            recipe = Recipe()
            recipe.set_id(id)
            recipe.set_recipe_name(recipe_name)
            recipe.set_duration(duration)
            recipe.set_portions(portions)
            recipe.set_instruction(instruction)
            #recipe.set_user_id(user_id)  Anschauen wegen fremschlüssel
            # recipe.set.groceriesstatement_id(groceriesstatement_id)
            result.append(recipe)


        self._cnx.commit()
        cursor.close()

        return result

    def find_by_recipe_name(self, recipe_name):

        result = []

        cursor = self._cnx.cursor()
        command = "SELECT id, recipe_name, duration, portions, instruction, user_id, groceriesstatement_id FROM " \
                  "customers WHERE recipe_name LIKE '{}' ORDER BY recipe_name".format(recipe_name)
        cursor.execute(command)
        tuples = cursor.fetchall()

        for (id, recipe_name, duration, portions, instruction, user_id, groceriesstatement_id) in tuples:
            recipe = Recipe()
            recipe.set_id(id)
            recipe.set_recipe_name(recipe_name)
            recipe.set_duration(duration)
            recipe.set_portions(portions)
            recipe.set_instruction(instruction)
            # recipe.set_user_id(user_id)  Anschauen wegen fremschlüssel
            # recipe.set.groceriesstatement_id(groceriesstatement_id)
            result.append(recipe)

        self._cnx.commit()
        cursor.close()

        return result

    def find_by_duration(self, duration):    #nochmal anschauen

        result = []

        cursor = self._cnx.cursor()
        command = "SELECT id, recipe_name, duration, portions, instruction, user_id, groceriesstatement_id FROM " \
                  "customers WHERE duration LIKE '{}' ORDER BY duration".format(duration)
        cursor.execute(command)
        tuples = cursor.fetchall()

        for (id, recipe_name, duration, portions, instruction, user_id, groceriesstatement_id) in tuples:
            recipe = Recipe()
            recipe.set_id(id)
            recipe.set_recipe_name(recipe_name)
            recipe.set_duration(duration)
            recipe.set_portions(portions)
            recipe.set_instruction(instruction)
            # recipe.set_user_id(user_id)  Anschauen wegen fremschlüssel
            # recipe.set.groceriesstatement_id(groceriesstatement_id)
            result.append(recipe)

        self._cnx.commit()
        cursor.close()

        return result

    def find_by_portions(self, portions):   #nochmal anschauen

        result = []

        cursor = self._cnx.cursor()
        command = "SELECT id, recipe_name, duration, portions, instruction, user_id, groceriesstatement_id FROM " \
                  "customers WHERE portions LIKE '{}' ORDER BY portions".format(portions)
        cursor.execute(command)
        tuples = cursor.fetchall()

        for (id, recipe_name, duration, portions, instruction, user_id, groceriesstatement_id) in tuples:
            recipe = Recipe()
            recipe.set_id(id)
            recipe.set_recipe_name(recipe_name)
            recipe.set_duration(duration)
            recipe.set_portions(portions)
            recipe.set_instruction(instruction)
            # recipe.set_user_id(user_id)  Anschauen wegen fremschlüssel
            # recipe.set.groceriesstatement_id(groceriesstatement_id)
            result.append(recipe)

        self._cnx.commit()
        cursor.close()

        return result

    def find_by_instruction(self, instruction):   #nochmal anschauen

        result = []

        cursor = self._cnx.cursor()
        command = "SELECT id, recipe_name, duration, portions, instruction, user_id, groceriesstatement_id FROM " \
                  "customers WHERE instruction LIKE '{}' ORDER BY instruction".format(instruction)
        cursor.execute(command)
        tuples = cursor.fetchall()

        for (id, recipe_name, duration, portions, instruction, user_id, groceriesstatement_id) in tuples:
            recipe = Recipe()
            recipe.set_id(id)
            recipe.set_recipe_name(recipe_name)
            recipe.set_duration(duration)
            recipe.set_portions(portions)
            recipe.set_instruction(instruction)
            # recipe.set_user_id(user_id)  Anschauen wegen fremschlüssel
            # recipe.set.groceriesstatement_id(groceriesstatement_id)
            result.append(recipe)

        self._cnx.commit()
        cursor.close()

        return result

    def find_by_key(self, key):

        result = None

        cursor = self._cnx.cursor()
        command = "SELECT * FROM recipe WHERE id={}".format(key)
        cursor.execute(command)
        tuples = cursor.fetchall()

        try:
            (id, recipe_name, duration, portions, instruction, user_id, groceriesstatement_id) = tuples[0]
            recipe = Recipe()
            recipe.set_id(id)
            recipe.set_recipe_name(recipe_name)
            recipe.set_duration(duration)
            recipe.set_portions(portions)
            recipe.set_instruction(instruction)
            # recipe.set_user_id(user_id)  Anschauen wegen fremschlüssel
            # recipe.set.groceriesstatement_id(groceriesstatement_id)
            result = recipe
        except IndexError:
            resukt = None

        self._cnx.commit()
        cursor.close()

        return result

    def find_by_user_id(self, user_id):

        result = None

        cursor = self._cnx.cursor()
        command = "SELECT id, recipe_name, duration, portions, instruction, user_id, groceriesstatement_id FROM " \
                  "customers WHERE user_id={}".format(user_id)
        cursor.execute(command)
        tuples = cursor.fetchall()

        try:
            (id, recipe_name, duration, portions, instruction, user_id, groceriesstatement_id) = tuples[0]
            recipe = Recipe()
            recipe.set_id(id)
            recipe.set_recipe_name(recipe_name)
            recipe.set_duration(duration)
            recipe.set_portions(portions)
            recipe.set_instruction(instruction)
            # recipe.set_user_id(user_id)  Anschauen wegen fremschlüssel
            # recipe.set.groceriesstatement_id(groceriesstatement_id)
            result = recipe
        except IndexError:
            resukt = None


        self._cnx.commit()
        cursor.close()

        return result

    def find_by_groceriesstatement_id(self, groceriesstatement_id):

        result = None

        cursor = self._cnx.cursor()
        command = "SELECT id, recipe_name, duration, portions, instruction, user_id, groceriesstatement_id FROM " \
                  "customers WHERE groceriesstatement_id={}".format(groceriesstatement_id)
        cursor.execute(command)
        tuples = cursor.fetchall()

        try:
            (id, recipe_name, duration, portions, instruction, user_id, groceriesstatement_id) = tuples[0]
            recipe = Recipe()
            recipe.set_id(id)
            recipe.set_recipe_name(recipe_name)
            recipe.set_duration(duration)
            recipe.set_portions(portions)
            recipe.set_instruction(instruction)
            # recipe.set_user_id(user_id)  Anschauen wegen fremschlüssel
            # recipe.set.groceriesstatement_id(groceriesstatement_id)
            result = recipe
        except IndexError:
            resukt = None

        self._cnx.commit()
        cursor.close()

        return result

    def insert(self, recipe):

        cursor = self._cnx.cursor()
        cursor.execute("SELECT MAX(id) AS maxid FROM recipe ")
        tuples = cursor.fetchall()

        for (maxid) in tuples:
            recipe.set_id(maxid[0]+1)

        command = "INSERT INTO recipe (id, recipe_name, duration, portions, instruction, user_id, " \
                  "groceriesstatement_id) VALUES (%s,%s,%s,%s,%s,%s,%s)"
        data = (recipe.get_id(), recipe.get_recipe_name(), recipe.get_duration(), recipe.set_portions(), recipe.get_instruction(), recipe.get_user_id, recipe.get_groceriesstatement_id)
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

        return recipe

    def update(self, recipe):

        cursor = self._cnx.cursor()

        command = "UPDATE recipe " + "SET recipe_name=%s, duration=%s, portions=%s, instruction=%s, user_id=%s, groceriesstatement_id=%s  WHERE id=%s"
        data = (recipe.get_id(), recipe.get_recipe_name(), recipe.get_duration(), recipe.set_portions(), recipe.get_instruction(), recipe.get_user_id, recipe.get_groceriesstatement_id)
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

    def delete(self, recipe):

        cursor = self._cnx.cursor()

        command = "DELETE FROM recipe WHERE id={}".format(recipe.get_id())
        cursor.execute(command)

        self._cnx.commit()
        cursor.close()

if (__name__ == "__main__"):     #testen
    with RecipeMapper() as mapper:
        result = mapper.find_all()
        for t in result:
            print(t)