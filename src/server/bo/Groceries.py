from server.bo import BusinessObject as bo

class Groceries (bo.BusinessObject):

    def __init__(self):
        super().__init__()
        self._groceries_name = ""
        self._user_id = 0 #fremdschlüssel

    def get_groceries_name(self):
        return self._groceries_name

    def set_groceries_name(self, new_groceries_name):
        self._groceries_name = new_groceries_name

    def get_user_id(self):
        return self._user_id

    def set_user_id(self, user_id):
        self._user_id = user_id

    @staticmethod
    def from_dict(dictionary=dict()):
        obj = Groceries()
        obj.set_id(dictionary["id"]) #erbt von BusinessObjekt
        obj.set_groceries_name(dictionary["groceries_name"])
        obj.set_user_id((dictionary["user_id"]))
        return obj