from server.bo import BusinessObject as bo

class fridge (bo.BusinessObject):


    def __init__(self):
        super().__init__()
        self._fridge_name = ""


    def get_fridge_name(self):
        return self._haushalt_name

    def set_fridge_name(self,new_name):
        self._fridge_name = new_name


    @staticmethod
    def from_dict (dictionary=dict()):
        obj = fridge()
        obj.set_id(dictionary["id"])
        obj.set_fridge_name(dictionary["fridge_name"])
        return obj


