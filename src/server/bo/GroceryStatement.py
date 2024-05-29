from server.bo.BusinessObject import BusinessObject

class GroceryStatement(BusinessObject):
    def __init__(self):
        super().__init__()
        self.grocery_name = ""
        self.description = ""
        self.quantity = 0





    def get_grocery_name(self):
        return self._grocery_name

    def set_grocery_name(self, new_grocery_name):
        self._grocery_name = new_grocery_name

    def get_quantity(self):
        return self._quantity

    def set_quantity(self, new_quantity):
        self._quantity = new_quantity

    def get_description(self):
        return self._description

    def set_description(self, new_description):
        self._description = new_description


    @staticmethod
    def from_dict (dictionary=dict()):
        obj = GroceryStatement()
        obj.set_id(dictionary["id"])
        obj.set_grocery_name(dictionary["grocery_name"])
        obj.set_description(dictionary["description"])
        obj.set_quantity(dictionary["quantity"])
        return obj

    #