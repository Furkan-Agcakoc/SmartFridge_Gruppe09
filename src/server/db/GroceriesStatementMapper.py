from server.bo.GroceriesStatement import GroceriesStatement
from server.db.Mapper import Mapper

class GroceriesStatementMapper (Mapper):

    def __init__(self):
        super().__init__()

    def find_all(self):

        result = []
        cursor = self._cnx.cursor()
        cursor.execute("SELECT * FROM groceriesstatement")
        tuples = cursor.fetchall()

        for (id, groceries_name, description, quantity) in tuples:
            groceriesstatement = GroceriesStatement()
            groceriesstatement.set_id(id)
            groceriesstatement.set_groceries_name(groceries_name)
            groceriesstatement.set_description(description)
            groceriesstatement.set_quantity(quantity)
            result.append(groceriesstatement)

        self._cnx.commit()
        cursor.close()

        return result

    def find_by_groceries_name(self, groceries_name):
        result = []
        cursor = self._cnx.cursor()
        command = "SELECT id, groceries_name,description,quantity  FROM groceriesstatement WHERE groceries_name={} ORDER BY id".format(groceries_name)
        cursor.execute(command)
        tuples = cursor.fetchall()

        for (id,groceries_name,description,quantity, user_id) in tuples:
            groceriesstatement = GroceriesStatement()
            groceriesstatement.set_id(id)
            groceriesstatement.set_groceries_name(groceries_name)
            groceriesstatement.set_description(description)
            groceriesstatement.set_quantity(quantity)
            result.append(groceriesstatement)

            self._cnx.commit()
            cursor.close()

            return result

    def find_by_fridge_id(self, fridge):
        result = []
        cursor = self._cnx.cursor()
        command = "SELECT id, groceries_name, description, quantity FROM fridge WHERE fridge={} ORDER BY id".format(fridge)
        cursor.execute(command)
        tuples = cursor.fetchall()

        for (id,groceries_name,description,quantity) in tuples:
            groceriesstatement = GroceriesStatement()
            groceriesstatement.set_id(id)
            groceriesstatement.set_groceries_name(groceries_name)
            groceriesstatement.set_description(description)
            groceriesstatement.set_quantity(quantity)
            result.append(groceriesstatement)

            self._cnx.commit()
            cursor.close()

            return result

    def find_by_key(self, key):
        result = None
        cursor = self._cnx.cursor()
        command = "SELECT id, groceries_name, description, quantity  FROM groceriesstatement WHERE id=%s"
        cursor.execute(command, (key,))
        tuples = cursor.fetchall()

        if tuples:
            (id, groceries_name, description, quantity) = tuples[0]
            groceriesstatement = GroceriesStatement()
            groceriesstatement.set_id(id)
            groceriesstatement.set_groceries_name(groceries_name)
            groceriesstatement.set_description(description)
            groceriesstatement.set_quantity(quantity)
            result = groceriesstatement

        cursor.close()
        return result



    def insert(self, groceriessatement):

        cursor = self._cnx.cursor()
        cursor.execute("SELECT MAX(id) AS maxid FROM groceriesstatement")
        tuples = cursor.fetchall()

        for (maxid) in tuples:
            if maxid[0] is not None:
                groceriessatement.set_id(maxid[0] + 1)
            else:
                groceriessatement.set_id(1)

        command = "INSERT INTO groceriesstatement (id, groceries_name, quantity, description) VALUES (%s,%s,%s,%s)"
        data = (groceriessatement.get_id(), groceriessatement.get_groceries_name(),groceriessatement.get_quantity(),groceriessatement.get_description())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

        return groceriessatement

    def update(self, groceriesstatement):
        cursor = self._cnx.cursor()

        command = "UPDATE groceriesstatement SET groceries_name=%s, description=%s, quantity=%s WHERE id=%s"
        data = (groceriesstatement.get_groceries_name(), groceriesstatement.get_description(),
                groceriesstatement.get_quantity(), groceriesstatement.get_id())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

    def delete(self, groceriesstatement):

        cursor = self._cnx.cursor()

        command = "DELETE FROM groceriesstatement WHERE id={}".format(groceriesstatement.get_id())
        cursor.execute(command)

        self._cnx.commit()
        cursor.close()


if (__name__ == "__main__"):
    with GroceriesStatementMapper() as mapper:
        result = mapper.find_all()
        for p in result:
            print(p)
