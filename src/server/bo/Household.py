from server.bo import BusinessObject as bo

class Household (bo.BusinessObject):


    def __init__(self):
        super().__init__()
        self._household_name = ""


    def get_household_name(self):
        return self._household_name

    def set_household_name(self,new_name):
        self._household_name = new_name



    @staticmethod
    def from_dict (dictionary=dict()):
        obj = Household()
        obj.set_id(dictionary["id"])
        obj.set_household_name(dictionary["household_name"])
        return obj