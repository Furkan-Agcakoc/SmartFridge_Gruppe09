from server.bo.BusinessObject import BusinessObject

class GroceryStatement(BusinessObject):
    def __init__(self):
        super().__init__()
        self.grocery_name = ""
        self.description = ""
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