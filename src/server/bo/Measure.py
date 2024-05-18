from server.bo import BusinessObject as bo

class Measure (bo.BusinessObject):

    def __int__(self):
        super().__init__()
        self._description = ""

    def get_description(self):
        return self._description

    def set_desription(self, new_description):
        self._description = new_description

    @staticmethod
    def from_dict(dictionary=dict()):
        obj = Measure()
        obj.set_id(dictionary["id"]) #erbt von BusinessObjekt
        obj.set_desription(dictionary["description"])
        return obj