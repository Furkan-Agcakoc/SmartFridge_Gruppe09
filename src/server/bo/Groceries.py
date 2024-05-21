from server.bo import BusinessObject as bo

class Groceries (bo.BusinessObject):

    def __init__(self):
        super().__init__()
        self._groceries_name = ""

    def get_groceries_name(self):
        return self._groceries_name

    def set_groceries_name(self, new_groceries_name):
        self._groceries_name = new_groceries_name

    @staticmethod
    def from_dict(dictionary=dict()):
        """Umwandeln eines Python dict() in ein Groceries()."""
        obj = Groceries()
        obj.set_id(dictionary["id"])  # eigentlich Teil von BusinessObject !
        obj.set_groceries_name(dictionary["groceries_name"])


        return obj