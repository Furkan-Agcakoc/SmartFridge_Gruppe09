from server.bo.Inhabitant import Inhabitant
from server.db.Mapper import Mapper

class Inhabitant(Mapper):

    def __init__(self):
        super().__init__()


    def find_all(self):
        result = []
        cursor = self._cnx.cursor()
        cursor.execute("SELECT * FROM users")
        tuples = cursor.fetchall()

        for (id, user_id, household_id) in tuples:
            inhabitant = Inhabitant()
            inhabitant.set_id(id)
            inhabitant.set_user_id(user_id)
            inhabitant.set_household_id(household_id)
            result.append(inhabitant)

        self._cnx.commit()
        cursor.close()

        return result

    def find_by_key(self, key):

        result = None
        cursor = self._cnx.cursor()
        command = "SELECT * from inhabitant WHERE id={}".format(key)
        cursor.execute(command)
        tuples = cursor.fetchall()

        try:
            (id,user_id,household_id) = tuples[0]
            inhabitant = Inhabitant()
            inhabitant.set_id(id)
            inhabitant.set_user_id(user_id)
            inhabitant.set_household_id(household_id)
            result.append(inhabitant)
            result = inhabitant

        except IndexError:
            result = None

        self._cnx.commit()
        cursor.cose()

        return result

    def insert(self, inhabitant):

        cursor = self._cnx.cursor()
        cursor.execute("SELECT MAX(id) AS maxid FROM inhabitant")
        tuples = cursor.fetchall()

        for (maxid) in tuples:
            if maxid[0] is not None:

                inhabitant.set_id(maxid[0] + 1)
            else:
                inhabitant.set_id(1)

        command = "INSERT INTO inhabitant (id, user_id,household_id) VALUES (%s,%s,%s)"
        data = (inhabitant.get_id(), inhabitant.get_user_id(),inhabitant.get_household_id)
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

    def update(self, inhabitant):

        cursor = self._cnx.cursor()

        command = "UPDATE inhabitant" + "SET user_id=%s, household_id=%s"
        data = (
        inhabitant.get_id(), inhabitant.get_user_id(),inhabitant.get_household_id)
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

    def delete(self, inhabitant):

        cursor = self._cnx.cursor()
        command = "DELETE FROM inhabitant WHERE id={}".format(inhabitant.get_user_id())
        cursor.execute(command)

        self._cnx.commit()
        cursor.close()

