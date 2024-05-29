from server.bo import BusinessObject as bo

class Grocery (bo.BusinessObject):

    def __init__(self):
        super().__init__()
        self._grocery_name = ""

    def get_grocery_name(self):
        return self._grocery_name

    def set_grocery_name(self, new_grocery_name):
        self._grocery_name = new_grocery_name

    @staticmethod
    def from_dict(dictionary=dict()):
        """Umwandeln eines Python dict() in ein Grocery()."""
        obj = Grocery()
        obj.set_id(dictionary["id"])  # eigentlich Teil von BusinessObject !
        obj.set_grocery_name(dictionary["grocery_name"])


        return obj