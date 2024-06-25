from server.bo.Recipe import Recipe
from server.db.Mapper import Mapper

class RecipeMapper (Mapper):

    def __init__(self):
        super().__init__()

    def find_all (self):

        result = []

        cursor = self._cnx.cursor()
        cursor.execute("SELECT * from recipe")
        tuples = cursor.fetchall()

        for (id, recipe_name, duration, portion, instruction, user_id, fridge_id) in tuples:
            recipe = Recipe()
            recipe.set_id(id)
            recipe.set_recipe_name(recipe_name)
            recipe.set_duration(duration)
            recipe.set_portion(portion)
            recipe.set_instruction(instruction)
            recipe.set_user_id(user_id)
            recipe.set_fridge_id(fridge_id)
            result.append(recipe)


        self._cnx.commit()
        cursor.close()

        return result

    def find_by_recipe_name(self, recipe_name):
        result = None

        with self._cnx.cursor() as cursor:
            command = "SELECT * FROM recipe WHERE recipe_name = %s"
            cursor.execute(command, (recipe_name,))
            tuples = cursor.fetchall()

            if tuples:
                (id, recipe_name, duration, portion, instruction, user_id, fridge_id) = tuples[0]
                recipe = Recipe()
                recipe.set_id(id)
                recipe.set_recipe_name(recipe_name)
                recipe.set_duration(duration)
                recipe.set_portion(portion)
                recipe.set_instruction(instruction)
                recipe.set_user_id(user_id)
                recipe.set_fridge_id(fridge_id)
                result = recipe

        return result

    def find_by_duration(self, duration):    #nochmal anschauen

        result = []

        cursor = self._cnx.cursor()
        command = "SELECT id, recipe_name, duration, portion, instruction, user_id, fridge_id FROM " \
                  "recipe WHERE duration={}".format(duration)
        cursor.execute(command)
        tuples = cursor.fetchall()

        for (id, recipe_name, duration, portion, instruction, user_id, fridge_id) in tuples:
            recipe = Recipe()
            recipe.set_id(id)
            recipe.set_recipe_name(recipe_name)
            recipe.set_duration(duration)
            recipe.set_portion(portion)
            recipe.set_instruction(instruction)
            recipe.set_user_id(user_id)
            recipe.set_fridge_id(fridge_id)
            result.append(recipe)

        self._cnx.commit()
        cursor.close()

        return result

    def find_by_portion(self, portion):

        result = []

        cursor = self._cnx.cursor()
        command = "SELECT id, recipe_name, duration, portion, instruction, user_id, fridge_id FROM " \
                  "recipe WHERE portion={}".format(portion)
        cursor.execute(command)
        tuples = cursor.fetchall()

        for (id, recipe_name, duration, portion, instruction, user_id, fridge_id) in tuples:
            recipe = Recipe()
            recipe.set_id(id)
            recipe.set_recipe_name(recipe_name)
            recipe.set_duration(duration)
            recipe.set_portion(portion)
            recipe.set_instruction(instruction)
            recipe.set_user_id(user_id)
            recipe.set_fridge_id(fridge_id)
            result.append(recipe)

        self._cnx.commit()
        cursor.close()

        return result

    def find_by_instruction(self, instruction):   #nochmal anschauen

        result = []

        cursor = self._cnx.cursor()
        command = "SELECT id, recipe_name, duration, portion, instruction, user_id, fridge_id FROM " \
                  "recipe WHERE instruction LIKE '{}' ORDER BY instruction".format(instruction)
        cursor.execute(command)
        tuples = cursor.fetchall()

        for (id, recipe_name, duration, portion, instruction, user_id, fridge_id) in tuples:
            recipe = Recipe()
            recipe.set_id(id)
            recipe.set_recipe_name(recipe_name)
            recipe.set_duration(duration)
            recipe.set_portion(portion)
            recipe.set_instruction(instruction)
            recipe.set_user_id(user_id)
            recipe.set_fridge_id(fridge_id)

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
            (id, recipe_name, duration, portion, instruction, user_id, fridge_id) = tuples[0]
            recipe = Recipe()
            recipe.set_id(id)
            recipe.set_recipe_name(recipe_name)
            recipe.set_duration(duration)
            recipe.set_portion(portion)
            recipe.set_instruction(instruction)
            recipe.set_user_id(user_id)
            recipe.set_fridge_id(fridge_id)

            result = recipe

        except IndexError:
            result = None

        self._cnx.commit()
        cursor.close()

        return result

    def find_by_user_id(self,user_id):
        result = []
        cursor = self._cnx.cursor()
        command = "SELECT id, recipe_name, duration, portion, instruction, user_id, fridge_id FROM recipe WHERE user_id={}".format(user_id)
        cursor.execute(command)
        tuples = cursor.fetchall()

        for (id, recipe_name, duration, portion, instruction, user_id, fridge_id) in tuples:
            recipe = Recipe()
            recipe.set_id(id)
            recipe.set_recipe_name(recipe_name)
            recipe.set_duration(duration)
            recipe.set_portion(portion)
            recipe.set_instruction(instruction)
            recipe.set_user_id(user_id)
            recipe.set_fridge_id(fridge_id)
            result.append(recipe)


            self._cnx.commit()
            cursor.close()

            return result

    def find_by_fridge_id(self,fridge_id):
        result = []
        cursor = self._cnx.cursor()
        command = "SELECT id, recipe_name, duration, portion, instruction, user_id, fridge_id FROM recipe WHERE user_id={}".format(fridge_id)
        cursor.execute(command)
        tuples = cursor.fetchall()

        for (id, recipe_name, duration, portion, instruction, user_id, fridge_id) in tuples:
            recipe = Recipe()
            recipe.set_id(id)
            recipe.set_recipe_name(recipe_name)
            recipe.set_duration(duration)
            recipe.set_portion(portion)
            recipe.set_instruction(instruction)
            recipe.set_user_id(user_id)
            recipe.set_fridge_id(fridge_id)
            result.append(recipe)


            self._cnx.commit()
            cursor.close()

            return result

    def find_recipe_by_user_id_and_fridge_id(self, user_id, fridge_id):
        result = []
        cursor = self._cnx.cursor()
        command = """
        SELECT id, recipe_name, duration, portion, instruction, user_id, fridge_id
        FROM recipe
        WHERE user_id = {} AND fridge_id = {}
        """.format(user_id, fridge_id)
        cursor.execute(command)
        tuples = cursor.fetchall()

        for (id, recipe_name, duration, portion, instruction, user_id, fridge_id) in tuples:
            recipe = Recipe()
            recipe.set_id(id)
            recipe.set_recipe_name(recipe_name)
            recipe.set_duration(duration)
            recipe.set_portion(portion)
            recipe.set_instruction(instruction)
            recipe.set_user_id(user_id)
            recipe.set_fridge_id(fridge_id)
            result.append(recipe)

        cursor.close()
        self._cnx.commit()

        return result

    def insert(self, recipe):
        cursor = self._cnx.cursor()
        cursor.execute("SELECT MAX(id) AS maxid FROM recipe")
        tuples = cursor.fetchall()

        for (maxid) in tuples:
            if maxid[0] is not None:
                recipe.set_id(maxid[0] + 1)
            else:
                recipe.set_id(1)

        command = "INSERT INTO recipe (id, recipe_name, duration, portion, instruction, user_id, fridge_id) VALUES (%s,%s,%s,%s,%s,%s,%s)"
        data = (recipe.get_id(), recipe.get_recipe_name(), recipe.get_duration(), recipe.get_portion(),
                recipe.get_instruction(),recipe.get_fridge_id(), recipe.get_user_id())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

        return recipe

    def update(self, recipe):
        cursor = self._cnx.cursor()
        command = "UPDATE recipe SET recipe_name=%s, duration=%s, portion=%s, instruction=%s, user_id=%s, fridge_id=%s WHERE id=%s"
        data = (recipe.get_recipe_name(), recipe.get_duration(), recipe.get_portion(), recipe.get_instruction(),
                recipe.get_user_id(),recipe.get_fridge_id(), recipe.get_id())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

    def delete(self, recipe):
        cursor = self._cnx.cursor()
        command = "DELETE FROM recipe WHERE id=%s"
        cursor.execute(command, (recipe.get_id(),))

        self._cnx.commit()
        cursor.close()

if (__name__ == "__main__"):     #testen
    with RecipeMapper() as mapper:
        result = mapper.find_all()
        for t in result:
            print(t)
