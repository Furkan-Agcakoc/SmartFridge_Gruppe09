from server.bo.Grocery import Grocery
from server.db.Mapper import Mapper
class GroceryMapper(Mapper):

    def __init__(self):
        super().__init__()

    def find_all(self):
        result = []
        cursor = self._cnx.cursor()
        cursor.execute("SELECT id, grocery_name FROM grocery")
        tuples = cursor.fetchall()

        for (id, grocery_name) in tuples:
            grocery = Grocery()
            grocery.set_id(id)
            grocery.set_grocery_name(grocery_name)
            result.append(grocery)

        cursor.close()
        return result

    def find_by_grocery_name_id(self, grocery_name_id):
        result = []
        cursor = self._cnx.cursor()
        command = "SELECT id, grocery_name FROM grocery WHERE grocery_name=%s ORDER BY id"
        cursor.execute(command, (grocery_name_id,))
        tuples = cursor.fetchall()

        for (id, grocery_name) in tuples:
            grocery = Grocery()
            grocery.set_id(id)
            grocery.set_grocery_name(grocery_name)
            result.append(grocery)

        cursor.close()
        return result

    def find_by_key(self, key):
        result = None
        cursor = self._cnx.cursor()
        command = "SELECT id, grocery_name FROM grocery WHERE id=%s"
        cursor.execute(command, (key,))
        tuples = cursor.fetchall()

        if tuples:
            (id, grocery_name) = tuples[0]
            grocery = Grocery()
            grocery.set_id(id)
            grocery.set_grocery_name(grocery_name)
            result = grocery

        cursor.close()
        return result

    def insert(self, grocery):

        cursor = self._cnx.cursor()
        cursor.execute("SELECT MAX(id) AS maxid FROM grocery")
        tuples = cursor.fetchall()

        for (maxid) in tuples:
            if maxid[0] is not None:
                grocery.set_id(maxid[0] + 1)
            else:
                grocery.set_id(1)

        command = "INSERT INTO grocery (id, grocery_name) VALUES (%s,%s)"
        data = (grocery.get_id(), grocery.get_grocery_name())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

        return grocery

    def update(self, grocery):
        cursor = self._cnx.cursor()
        command = "UPDATE grocery SET grocery_name=%s WHERE id=%s"
        data = (grocery.get_grocery_name(), grocery.get_id())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

    def delete(self, grocery):
        cursor = self._cnx.cursor()
        command = "DELETE FROM grocery WHERE id=%s"
        cursor.execute(command, (grocery.get_id(),))

        self._cnx.commit()
        cursor.close()


if __name__ == "__main__":
    with GroceryMapper() as mapper:
        result = mapper.find_all()
        for p in result:
            print(p)
