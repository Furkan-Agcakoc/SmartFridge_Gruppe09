from server.bo import BusinessObject as bo

class Recipe (bo.BusinessObject):

    def __int__(self):
        super().__init__()
        self._recipe_name = ""
        self._portions = 0
        self._instruction = ""
        self._duration = ""


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

    @staticmethod
    def from_dict(dictionary=dict()):
        obj = Recipe()
        obj.set_id(dictionary["id"]) #erbt von BusinessObjekt
        obj.set_recipe_name(dictionary["recipe_name"])
        obj.set_portions(dictionary["portions"])
        obj.set_instruction(dictionary["instruction"])
        obj.set_duration(dictionary["duration"])
        return obj

