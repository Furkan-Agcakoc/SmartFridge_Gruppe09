from server.bo import BusinessObject as bo

class User (bo.BusinessObject):

    def __init__(self):
        super().__init__()
        self.__firstname = ""
        self.__lastname = ""
        self.__nickname = ""
        self.__email = ""
        self.__user_id = ""

    def get_firstname(self):
        return self.__firstname

    def set_firstname(self,new_firstname):
        self.__firstname = new_firstname

    def get_lastname(self):
        return self.__lastname

    def set_lastname(self,new_lastname):
        self.__lastname = new_lastname

    def get_nickname(self):
        return self._nickname

    def set_nickname(self,new_nickname):
        self.__nickname = new_nickname

    def get_email(self):
        return self._email

    def set_email(self,new_email):
        self.__email = new_email

    def get_user_id(self):
        return self.__user_id

    def set_user_id(self, new_user_id):
        self.__user_id = new_user_id


    @staticmethod
    def from_dict(dictionary=dict()):
        obj = User()
        obj.set_id(dictionary["id"])
        obj.set_firstname(dictionary["firstname"])
        obj.set_lastname(dictionary["lastname"])
        obj.set_nickname(dictionary["nickname"])
        obj.set_email(dictionary["email"])
        obj.set_user_id(dictionary["user_id"])
        return obj