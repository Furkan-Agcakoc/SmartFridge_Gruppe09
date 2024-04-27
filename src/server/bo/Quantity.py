from server.bo import BusinessObject as bo

class Quantity (bo.BusinessObject):

    def __init__(self):
        super().__init__()
        self._quantity = 0.0

    def get_quantity(self):
        return self._quantity

    def set_quantity(self,new_quantity):
        self._quantity = new_quantity

    @staticmethod
    def from_dict(dictionary=dict()):
        obj = Quantity()
        obj.set_id(dictionary["id"])
        obj.set_quantity(dictionary["quantity"])
        return obj

