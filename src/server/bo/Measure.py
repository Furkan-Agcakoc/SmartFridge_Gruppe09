from server.bo import BusinessObject as bo

class Measure (bo.BusinessObject):

    def __init__(self):
        super().__init__()
        self._unit = ""

    def get_unit(self):
        return self._unit

    def set_unit(self, new_unit):
        self._unit = new_unit

    @staticmethod
    def from_dict(dictionary=dict()):
        obj = Measure()
        obj.set_id(dictionary["id"])
        obj.set_unit(dictionary["unit"])
        return obj