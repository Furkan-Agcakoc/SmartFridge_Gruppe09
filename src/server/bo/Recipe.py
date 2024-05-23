from server.bo import BusinessObject as bo

class Recipe (bo.BusinessObject):

    def __init__(self):
        super().__init__()
        self._recipe_name = ""
        self._portions = 0
        self._instruction = ""
        self._duration = ""
        self._user_id = 0
        self._groceriesstatement_id = 0


    def get_recipe_name(self):
        return self._recipe_name

    def set_recipe_name(self, new_recipe_name):
        self._recipe_name = new_recipe_name

    def get_portions(self):
        return self._portions

    def set_portions(self, new_portions):
        self._portions = new_portions

    def get_instruction(self):
        return self._instruction

    def set_instruction(self, new_instruction):
        self._instruction = new_instruction

    def get_duration(self):
        return self._duration

    def set_duration(self, new_duration):
        self._duration = new_duration

    def get_user_id(self):
        return self._user_id

    def set_user_id(self, user_id):
       self._user_id = user_id

    def get_groceriesstatement_id(self):
        return self._groceriesstatement_id

    def set_groceriesstatement_id(self, groceriesstatement_id):
       self._groceriesstatement_id = groceriesstatement_id



    @staticmethod
    @staticmethod
    def from_dict(dictionary=dict()):
        """Umwandeln eines Python dict() in ein Recipe()."""
        obj = Recipe()
        obj.set_id(dictionary["id"])  # eigentlich Teil von BusinessObject !
        obj.set_recipe_name(dictionary["recipe_name"])
        obj.set_portions(dictionary["portions"])
        obj.set_instruction(dictionary["instruction"])
        obj.set_duration(dictionary["duration"])
        obj.set_user_id(dictionary["user_id"])
        obj.set_groceriesstatement_id(dictionary["groceriesstatement_id"])



        return obj

