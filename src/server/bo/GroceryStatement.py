from server.bo.BusinessObject import BusinessObject

class GroceryStatement(BusinessObject):
    def __init__(self):
        super().__init__()
        self.grocery_name = ""
        self.unit = ""
        self.quantity = 0

    ''' Muss in die Admin Klasse verschoben werden
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
                
    '''

    def get_grocery_name(self):
        return self._grocery_name

    def set_grocery_name(self, new_grocery_name):
        self._grocery_name = new_grocery_name

    def get_quantity(self):
        return self._quantity

    def set_quantity(self, new_quantity):
        self._quantity = new_quantity

    def get_unit(self):
        return self._unit

    def set_unit(self, new_unit):
        self._unit = new_unit


    @staticmethod
    def from_dict (dictionary=dict()):
        obj = GroceryStatement()
        obj.set_id(dictionary["id"])
        obj.set_grocery_name(dictionary["grocery_name"])
        obj.set_unit(dictionary["unit"])
        obj.set_quantity(dictionary["quantity"])
        return obj