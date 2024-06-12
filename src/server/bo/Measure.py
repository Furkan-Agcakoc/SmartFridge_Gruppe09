from server.bo import BusinessObject as bo

class Measure (bo.BusinessObject):

    def __init__(self):
        super().__init__()
        self._unit = ""
        self._household_id = 0

    def get_unit(self):
        return self._unit

    def set_unit(self, new_unit):
        self._unit = new_unit

    def get_household_id(self):
        return self._household_id

    def set_household_id(self, new_household_id):
        self._household_id = new_household_id

    @staticmethod
    def from_dict(dictionary=dict()):
        obj = Measure()
        obj.set_id(dictionary["id"])
        obj.set_unit(dictionary["unit"])
        obj.set_household_id(dictionary["household_id"])
        return obj