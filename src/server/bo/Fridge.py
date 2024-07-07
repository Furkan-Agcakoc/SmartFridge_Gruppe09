from server.bo import BusinessObject as bo

class Fridge (bo.BusinessObject):

    def __init__(self):
        super().__init__()
        self._household_id = 0
    def get_household_id(self):
        return self._household_id

    def set_household_id(self, household_id):
        self._household_id = household_id


    @staticmethod
    def from_dict(dictionary=dict()):
        obj = Fridge()
        obj.set_id(dictionary["id"])
        obj.set_household_id(dictionary["household_id"])
        return obj
