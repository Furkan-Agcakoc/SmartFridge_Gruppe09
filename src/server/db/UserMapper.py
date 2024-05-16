from server.bo.User import User
from server.db.Mapper import Mapper


class UserMapper (Mapper):

    def __init__(self):
        super().__init__()

    def find_all(self):

        result = []
        cursor = self._cnx.cursor()
        cursor.execute("SELECT * FROM users")
        tuples = cursor.fetchall()

        for (id, firstname, lastname, nickname, email, user_id) in tuples:
            user = User()
            user.set_id(id)
            user.set_firstname(firstname)
            user.set_lastname(lastname)
            user.set_nickname(nickname)
            user.set_email(email)
            user.set_user_id(user_id)
            result.append(user)

        self._cnx.commit()
        cursor.close()

        return result

    def find_by_firstname(self, firstname):

        result = []
        cursor = self._cnx.cursor()
        command = "SELECT * from users WHERE firstname LIKE '{}' ORDER BY firstname".format(firstname)
        cursor.excecute(command)
        tuples = cursor.fetchall()

        for (id, firstname, lastname, nickname, email, user_id) in tuples:
            user = User()
            user.set_id(id)
            user.set_firstname(firstname)
            user.set_lastname(lastname)
            user.set_nickname(nickname)
            user.set_email(email)
            user.set_user_id(user_id)
            result.append(user)

        self._cnx.commit()
        cursor.cose()

        return result

    def find_by_lastname(self, lastname):

        result = []
        cursor = self._cnx.cursor()
        command = "SELECT * from users WHERE lastname LIKE '{}' ORDER BY lastname".format(lastname)
        cursor.execute(command)
        tuples = cursor.fetchall()

        for (id, firstname, lastname, nickname, email, user_id) in tuples:
            user = User()
            user.set_id(id)
            user.set_firstname(firstname)
            user.set_lastname(lastname)
            user.set_nickname(nickname)
            user.set_email(email)
            user.set_user_id(user_id)
            result.append(user)

        self._cnx.commit()
        cursor.cose()

        return result

    def find_by_nickname(self, nickname):

        result = None
        cursor = self._cnx.cursor()
        command = "SELECT * from users WHERE nickname={}".format(nickname)
        cursor.execute(command)
        tuples = cursor.fetchall()

        try:
            (id, firstname, lastname, nickname, email, user_id) = tuples=[0]
            user = User()
            user.set_id(id)
            user.set_firstname(firstname)
            user.set_lastname(lastname)
            user.set_nickname(nickname)
            user.set_email(email)
            user.set_user_id(user_id)
            result = user
        except IndexError:
            result = None

        self._cnx.commit()
        cursor.cose()

        return result

    def find_by_email(self, email):

        result = None
        cursor = self._cnx.cursor()
        command = "SELECT * from users WHERE email={}".format(email)
        cursor.execute(command)
        tuples = cursor.fetchall()

        try:
            (id, firstname, lastname, nickname, email, user_id) = tuples[0]
            user = User()
            user.set_id(id)
            user.set_firstname(firstname)
            user.set_lastname(lastname)
            user.set_nickname(nickname)
            user.set_email(email)
            user.set_user_id(user_id)
            result = None
        except IndexError:
            result = None

        self._cnx.commit()
        cursor.cose()

        return result

    def find_by_google_user_id(self, user_id):

        result = None
        cursor = self._cnx.cursor()
        command = "SELECT * from users WHERE google_user_id={}".format(user_id)
        cursor.execute(command)
        tuples = cursor.fetchall()

        try:
            (id, firstname, lastname, nickname, email, user_id) = tuples[0]
            user = User()
            user.set_id(id)
            user.set_firstname(firstname)
            user.set_lastname(lastname)
            user.set_nickname(nickname)
            user.set_email(email)
            user.set_user_id(user_id)
            result = user

        except IndexError:
            result = None

        self._cnx.commit()
        cursor.cose()

        return result

    def find_by_key(self, key):

        result = None
        cursor = self._cnx.cursor()
        command = "SELECT * from users WHERE id={}".format(key)
        cursor.execute(command)
        tuples = cursor.fetchall()

        try:
            (id, firstname, lastname, nickname, email, user_id) = tuples[0]
            user = User()
            user.set_id(id)
            user.set_firstname(firstname)
            user.set_lastname(lastname)
            user.set_nickname(nickname)
            user.set_email(email)
            user.set_user_id(user_id)
            result = user

        except IndexError:
            result = None

        self._cnx.commit()
        cursor.cose()

        return result

    def insert(self, user):

        cursor = self._cnx.cursor()
        cursor.execute("SELECT MAX(id) AS maxid FROM users")
        tuples = cursor.fetchall()

        for (maxid) in tuples:
            if maxid[0] is not None:

                user.set_id(maxid[0] + 1)
            else:
                user.set_id(1)

        command = "INSERT INTO users (id, firstname, lastname, nickname, email, google_user_id) VALUES (%s,%s,%s,%s,%s,%s)"
        data = (user.get_id(), user.get_firstname(),user.get_lastname(), user.get_nickname(), user.get_email(), user.get_user_id())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

    def update(self, user):

        cursor = self._cnx.cursor()

        command = "UPDATE users" + "SET firstname=%s, lastname=%s, nickname=%s, email=%s WHERE google_user_id=%s"
        data = (user.get_firstname(), user.get_lastname(), user.get_nickname(), user.get_email(), user.get_user_id())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

    def delete(self, user):

        cursor = self._cnx.cursor()
        command = "DELETE FROM users WHERE id={}".format(user.get_user_id())
        cursor.execute(command)

        self._cnx.commit()
        cursor.close()


if (__name__ == "__main__"):   #testen
    with UserMapper() as mapper:
        result = mapper.find_all()
        for t in result:
            print(t)
