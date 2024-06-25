from server.bo import BusinessObject as bo

class Grocery (bo.BusinessObject):

    def __init__(self):
        super().__init__()
        self._grocery_name = ""
        self._fridge_id = 0

    def get_grocery_name(self):
        return self._grocery_name

    def set_grocery_name(self, new_grocery_name):
        self._grocery_name = new_grocery_name

    def get_fridge_id(self):
        return self._fridge_id

    def set_fridge_id(self, new_fridge_id):
        self._fridge_id = new_fridge_id

    @staticmethod
    def from_dict(dictionary=dict()):
        """Umwandeln eines Python dict() in ein Grocery()."""
        obj = Grocery()
        'obj.set_id(dictionary["id"])'
        obj.set_grocery_name(dictionary["grocery_name"])
        obj.set_fridge_id(dictionary["fridge_id"])


        return obj
