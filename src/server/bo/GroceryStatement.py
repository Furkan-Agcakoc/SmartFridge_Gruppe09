from server.bo.BusinessObject import BusinessObject

class GroceryStatement(BusinessObject):
    def __init__(self):
        super().__init__()
        self._grocery_id = 0
        self._unit_id = 0
        self.quantity = 0.0





    def get_grocery_id(self):
        return self._grocery_id

    def set_grocery_id(self, new_grocery_id):
        self._grocery_id = new_grocery_id

    def get_quantity(self):
        return self.quantity

    def set_quantity(self, new_quantity):
        self.quantity = new_quantity

    def get_unit_id(self):
        return self._unit_id

    def set_unit_id(self, new_unit_id):
        self._unit_id = new_unit_id


    @staticmethod
    def from_dict (dictionary=dict()):
        obj = GroceryStatement()
        obj.set_id(dictionary["id"])
        obj.set_grocery_id(dictionary["grocery_id"])
        obj.set_unit_id(dictionary["unit_id"])
        obj.set_quantity(dictionary["quantity"])
        return obj
