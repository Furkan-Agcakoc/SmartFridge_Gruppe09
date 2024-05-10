"""from server.bo import BusinessObject as bo

class Shoppinglist (bo.BusinessObject):

    def __init__(self):
        super().__init__()
        self._list_name = ""
        self._food_list = ""
        self._is_checked = False


    def get_list_name(self):
        return self._list_name

    def set_list_name(self,new_name):
        self._list_name = new_name

    def get_food_list(self):
        return self._food_list

    def set_food_list(self,new_list):
        self._food_list = new_list

    def get_is_checked (self):
        return self._is_checked

    def set_is_checked(self,new_check):
        self._is_checked = new_check


    @staticmethod
    def from_dict(dictionary=dict()):
        obj = Shoppinglist()
        obj.set_id(dictionary["id"])
        obj.set_list_name(dictionary["list_name"])
        obj.set_food_list(dictionary["food_list"])
        obj.set_is_checked(dictionary["is_checked"])
        return obj
        """


