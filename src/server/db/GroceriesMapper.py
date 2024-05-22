from server.bo.Groceries import Groceries
from server.db.Mapper import Mapper
class GroceriesMapper(Mapper):

    def __init__(self):
        super().__init__()

    def find_all(self):
        result = []
        cursor = self._cnx.cursor()
        cursor.execute("SELECT id, groceries_name FROM groceries")
        tuples = cursor.fetchall()

        for (id, groceries_name) in tuples:
            groceries = Groceries()
            groceries.set_id(id)
            groceries.set_groceries_name(groceries_name)
            result.append(groceries)

        cursor.close()
        return result

    def find_by_groceries_name_id(self, groceries_name_id):
        result = []
        cursor = self._cnx.cursor()
        command = "SELECT id, groceries_name FROM groceries WHERE groceries_name=%s ORDER BY id"
        cursor.execute(command, (groceries_name_id,))
        tuples = cursor.fetchall()

        for (id, groceries_name) in tuples:
            groceries = Groceries()
            groceries.set_id(id)
            groceries.set_groceries_name(groceries_name)
            result.append(groceries)

        cursor.close()
        return result

    def find_by_key(self, key):
        result = None
        cursor = self._cnx.cursor()
        command = "SELECT id, groceries_name FROM groceries WHERE id=%s"
        cursor.execute(command, (key,))
        tuples = cursor.fetchall()

        if tuples:
            (id, groceries_name) = tuples[0]
            groceries = Groceries()
            groceries.set_id(id)
            groceries.set_groceries_name(groceries_name)
            result = groceries

        cursor.close()
        return result

    def insert(self, groceries):

        cursor = self._cnx.cursor()
        cursor.execute("SELECT MAX(id) AS maxid FROM groceries")
        tuples = cursor.fetchall()

        for (maxid) in tuples:
            if maxid[0] is not None:
                groceries.set_id(maxid[0] + 1)
            else:
                groceries.set_id(1)

        command = "INSERT INTO groceries (id, groceries_name) VALUES (%s,%s)"
        data = (groceries.get_id(), groceries.get_groceries_name())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

        return groceries

    def update(self, groceries):
        cursor = self._cnx.cursor()
        command = "UPDATE groceries SET groceries_name=%s WHERE id=%s"
        data = (groceries.get_groceries_name(), groceries.get_id())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

    def delete(self, groceries):
        cursor = self._cnx.cursor()
        command = "DELETE FROM groceries WHERE id=%s"
        cursor.execute(command, (groceries.get_id(),))

        self._cnx.commit()
        cursor.close()


if __name__ == "__main__":
    with GroceriesMapper() as mapper:
        result = mapper.find_all()
        for p in result:
            print(p)
