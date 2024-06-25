from server.bo import BusinessObject as bo

class Measure (bo.BusinessObject):

    def __init__(self):
        super().__init__()
        self._unit = ""
        self._fridge_id = 0

    def get_unit(self):
        return self._unit

    def set_unit(self, new_unit):
        self._unit = new_unit

    def get_fridge_id(self):
        return self._fridge_id

    def set_fridge_id(self, new_fridge_id):
        self._fridge_id = new_fridge_id

    @staticmethod
    def from_dict(dictionary=dict()):
        obj = Measure()
        'obj.set_id(dictionary["id"])'
        obj.set_unit(dictionary["unit"])
        obj.set_fridge_id(dictionary["fridge_id"])
        return obj