from server.bo import BusinessObject as bo

class Fridge (bo.BusinessObject):

    def __init__(self):
        super().__init__()
        self._fridge_name = ""
        self._household = "" #fremdschlüsselbeziehung
        self._groceriesstatement_id = 0

    def get_fridge_name(self):
        return self._fridge_name

    def set_fridge_name(self,new_name):
        self._fridge_name = new_name

    def get_household(self):
        return self._household

    def set_household(self,household):
        self._household = household

    def get_groceriesstatement_id(self):
        return self._groceriesstatement_id

    def set_groceriesstatement_id(self, groceriesstatement_id):
        self._groceriesstatement_id = groceriesstatement_id

    @staticmethod
    def from_dict(dictionary=dict()):
        obj = Fridge()
        obj.set_id(dictionary["id"])
        obj.set_fridge_name(dictionary["fidge_name"])
        obj.set_groceriesstatement_id(dictionary["groceriesstatement_id"])
        return obj