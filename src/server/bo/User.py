from server.bo import BusinessObject as bo

class User (bo.BusinessObject):

    def __init__(self):
        super().__init__()
        self._firstname = ""
        self._lastname = ""
        self._nickname = ""
        self._email = ""
        self._google_user_id = ""

    def get_firstname(self):
        return self._firstname

    def set_firstname(self,new_firstname):
        self._firstname = new_firstname

    def get_lastname(self):
        return self._lastname

    def set_lastname(self,new_lastname):
        self._lastname = new_lastname

    def get_nickname(self):
        return self._nickname

    def set_nickname(self, new_nickname):
        self._nickname = new_nickname

    def get_email(self):
        return self._email

    def set_email(self,new_email):
        self._email = new_email

    def get_google_user_id(self):
        return self._google_user_id

    def set_google_user_id(self, google_user_id):
        self._google_user_id = google_user_id

    @staticmethod
    def from_dict(dictionary=dict()):
        obj = User()
        obj.set_firstname(dictionary["firstname"])
        obj.set_lastname(dictionary["lastname"])
        obj.set_nickname(dictionary["nickname"])
        obj.set_email(dictionary["email"])
        obj.set_google_user_id(dictionary["google_user_id"])
        return obj