from server.bo import BusinessObject as bo

class Groceries (bo.BusinessObject):

    def __int__(self):
        super().__init__()
        self._groceries_name = ""

    def get_description(self):
        return self._groceries_name

    def set_desription(self, new_groceries_name):
        self._groceries_name = new_groceries_name

    @staticmethod
    def from_dict(dictionary=dict()):
        obj = Groceries()
        obj.set_id(dictionary["id"]) #erbt von BusinessObjekt
        obj.set_groceries_name(dictionary["groceries_name"])
        return obj