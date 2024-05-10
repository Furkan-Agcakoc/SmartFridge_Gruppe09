from server.bo import BusinessObject as bo
from server.bo import Quantity
from server.bo import Groceries
from server.bo import Measure
class GroceriesStatement(bo.BusinessObject,Quantity,Groceries,Measure):

    def __init__(self):
        super().__init__()
        self._groceries_name = ""
        self._description = ""
        self._quantity = 0.0

    def conversion(value,unit_from,unit_to):

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
