from server.bo import BusinessObject as bo

class Household (bo.BusinessObject):
    def __init__(self):
        super().__init__()
        self._household_name = ""
        self._owner_id = 0

    def get_household_name(self):
        return self._household_name

    def get_owner_id(self):
        return self._owner_id

    def set_household_name(self,new_name):
        self._household_name = new_name

    def set_owner_id(self, owner_id):
        self._owner_id = owner_id


    @staticmethod
    def from_dict (dictionary=dict()):
        obj = Household()
        obj.set_id(dictionary["id"])
        obj.set_household_name(dictionary["household_name"])
        obj.set_owner_id(dictionary["owner_id"])
        return obj
