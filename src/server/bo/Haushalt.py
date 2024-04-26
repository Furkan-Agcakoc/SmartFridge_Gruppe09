from server.bo import BusinessObject as bo

class Haushalt (bo.BusinessObject):


    def __init__(self):
        super().__init__()
        self._haushalt_name = ""


    def get_haushalt_name(self):
        return self._haushalt_name

    def set_haushalt_name(self,neuer_name):
        self._haushalt_name = neuer_name



