from server.bo.Measure import Measure
from server.bo.Quantity import Quantity
from server.bo.Groceries import Groceries

class GroceriesStatement(Measure, Quantity, Groceries):
    def __init__(self, groceries_name,description, quantity):
        super().__init__()
        self.groceries_name = groceries_name
        self.description = description
        self.quantity = quantity


    def conversion(self, value, unit_from, unit_to):

            if unit_from == "g" and unit_to == "kg":
                return value / 1000

            elif unit_from == "kg" and unit_to == "g":
                return value * 1000

            elif unit_from == "ml" and unit_to == "l":
                return value / 1000

            elif unit_from == "l" and unit_to == "ml":
                return value * 1000


            else:
                return "Ihre EInheit ist Ungültig oder die Umrechnung ist nicht Möglich."


    def get_groceries_name(self):
        return self._groceries_name

    def set_groceries_name(self, new_groceries_name):
        self._groceries_name = new_groceries_name


    def get_quantity(self):
        return self._quantity

    def set_quantity(self,new_quantity):
        self._quantity = new_quantity


    def get_description(self):
        return self._description

    def set_description(self, new_description):
        self._description = new_description

    @staticmethod
    def from_dict (dictionary=dict()):
        obj = GroceriesStatement()
        obj.set_id(dictionary["id"])
        obj.set_groceries_name(dictionary["groceries_name"])
        obj.set_description(dictionary["description"])
        obj.set_quantity(dictionary["quantity"])
        return obj