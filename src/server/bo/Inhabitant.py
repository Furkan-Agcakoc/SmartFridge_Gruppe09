from server.bo import BusinessObject as bo

class Inhabitant (bo.BusinessObject):

    def __init__(self):
        super().__init__()
        self._user_id = 0
        self._household_id = 0

    def get_user_id(self):
        return self._user_id

    def set_user_id(self, new_user_id):
        self._user_id = new_user_id

    def get_household_id(self):
        return self._household_id

    def set_household_id(self, new_household_id):
        self._household_id = new_household_id


    @staticmethod
    def from_dict(dictionary=dict()):
        obj = Inhabitant()
        obj.set_id(dictionary["id"])
        obj.set_user_id(dictionary["user_id"])
        obj.set_household_id(dictionary["household_id"])

        return obj