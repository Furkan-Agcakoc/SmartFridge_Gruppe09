from server.bo import BusinessObject as bo

class GroceriesStatement(bo.BusinessObject):
    def __init__(self):
        super().__init__()
        self._groceries_name = ""
        self._description = ""
        self._quantity = 0.0


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
                return "Ihre EInheit ist ungültig oder die Umrechnung ist nicht möglich."


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