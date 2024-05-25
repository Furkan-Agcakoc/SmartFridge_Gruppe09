from server.bo import BusinessObject as bo

class Household (bo.BusinessObject):


    def __init__(self):
        super().__init__()
        self._household_name = ""
        self._user_id = 0


    def get_household_name(self):
        return self._household_name

    def set_household_name(self,new_name):
        self._household_name = new_name

    def get_user_id(self):
        return self._user_id

    def set_user_id(self, user_id):
        self._user_id = user_id


    @staticmethod
    def from_dict (dictionary=dict()):
        obj = Household()
        obj.set_id(dictionary["id"])
        obj.set_household_name(dictionary["household_name"])
        obj.set_user_id(dictionary["user_id"])
        return obj