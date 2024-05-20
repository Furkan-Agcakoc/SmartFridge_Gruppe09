from server.bo.Groceries import Groceries
from server.db.Mapper import Mapper

class GroceriesMapper (Mapper):

    def __init__(self):
        super().__init__()

    def find_all(self):

        result = []
        cursor = self._cnx.cursor()
        cursor.execute("SELECT * FROM groceries")
        tuples = cursor.fetchall()

        for (id,groceries_name,user_id) in tuples:
            groceries = Groceries()
            groceries.set_id(id)
            groceries.set_groceries_name(groceries_name)
            groceries.set_user_id(user_id)
            result.append(groceries)

        self._cnx.commit()
        cursor.close()

        return result

    def find_by_groceries_name_id(self, groceries_name_id):
        result = []
        cursor = self._cnx.cursor()
        command = "SELECT id, groceries_name, user_id FROM groceries WHERE groceries_name={} ORDER BY id".format(groceries_name_id)
        cursor.execute(command)
        tuples = cursor.fetchall()

        for (id,groceries_name,user_id) in tuples:
            groceries = Groceries()
            groceries.set_id(id)
            groceries.set_groceries_name(groceries_name)
            groceries.set_user_id(user_id)
            result.append(groceries)

        self._cnx.commit()
        cursor.close()

        return result

    def find_by_key(self, key):

        result = None

        cursor = self._cnx.cursor()
        command = "SELECT id, groceries_name, user_id FROM groceries WHERE id={}".format(key)
        cursor.execute(command)
        tuples = cursor.fetchall()

        if tuples[0] is not None:
            (id, groceries_name,user_id) = tuples[0]
            groceries = Groceries()
            groceries.set_id(id)
            groceries.set_groceries_name(groceries_name)
            groceries.set_user_id(user_id)

        result = groceries

        self._cnx.commit()
        cursor.close()

        return result


    def insert(self, groceries):

        cursor = self._cnx.cursor()
        cursor.execute("SELECT MAX(id) AS maxid FROM groceries")
        tuples = cursor.fetchall()

        for (maxid) in tuples:
            groceries.set_id(maxid[0]+1)

        command = "INSERT INTO groceries (id,groceries_name,user_id) VALUES (%s,%s,%s)"
        data = (groceries.get_id(), groceries.get_groceries_name(),groceries.get_user_id())
        cursor.execute(command,data)

        self._cnx.commit()
        cursor.close
        return groceries

    def update(self, groceries):

        cursor = self._cnx.cursor()

        command = "UPDATE groceries " + "SET groceries_name=%s" + "SET user_id WHERE id=%s"
        data = (groceries.get_id(), groceries.get_groceries_name(),groceries.get_user_id())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

    def delete(self, groceries):
        """Löschen der Daten eines Account-Objekts aus der Datenbank.

        :param account das aus der DB zu löschende "Objekt"
        """
        cursor = self._cnx.cursor()

        command = "DELETE FROM groceries WHERE id={}".format(groceries.get_id())
        cursor.execute(command)

        self._cnx.commit()
        cursor.close()


if (__name__ == "__main__"):
    with GroceriesMapper() as mapper:
        result = mapper.find_all()
        for p in result:
            print(p)
