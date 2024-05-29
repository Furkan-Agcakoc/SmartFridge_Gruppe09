from server.bo.GroceryStatement import GroceryStatement
from server.db.Mapper import Mapper

class GroceryStatementMapper (Mapper):

    def __init__(self):
        super().__init__()

    def find_all(self):

        result = []
        cursor = self._cnx.cursor()
        cursor.execute("SELECT * FROM grocerystatement")
        tuples = cursor.fetchall()

        for (id, grocery_name, description, quantity) in tuples:
            grocerystatement = GroceryStatement()
            grocerystatement.set_id(id)
            grocerystatement.set_grocery_name(grocery_name)
            grocerystatement.set_description(description)
            grocerystatement.set_quantity(quantity)
            result.append(grocerystatement)

        self._cnx.commit()
        cursor.close()

        return result

    def find_by_grocery_name(self, grocery_name):
        result = []
        cursor = self._cnx.cursor()
        command = "SELECT id, grocery_name,description,quantity FROM grocerystatement WHERE grocery_name={} ORDER BY id".format(grocery_name)
        cursor.execute(command)
        tuples = cursor.fetchall()

        for (id,grocery_name,description,quantity) in tuples:
            grocerystatement = GroceryStatement()
            grocerystatement.set_id(id)
            grocerystatement.set_grocery_name(grocery_name)
            grocerystatement.set_description(description)
            grocerystatement.set_quantity(quantity)
            result.append(grocerystatement)

            self._cnx.commit()
            cursor.close()

            return result



    def find_by_key(self, key):
        result = None
        cursor = self._cnx.cursor()
        command = "SELECT id, grocery_name, description, quantity FROM grocerystatement WHERE id=%s"
        cursor.execute(command, (key,))
        tuples = cursor.fetchall()

        if tuples:
            (id, grocery_name, description, quantity) = tuples[0]
            grocerystatement = GroceryStatement()
            grocerystatement.set_id(id)
            grocerystatement.set_grocery_name(grocery_name)
            grocerystatement.set_description(description)
            grocerystatement.set_quantity(quantity)
            result = grocerystatement

        cursor.close()
        return result



    def insert(self, grocerysatement):

        cursor = self._cnx.cursor()
        cursor.execute("SELECT MAX(id) AS maxid FROM grocerystatement")
        tuples = cursor.fetchall()

        for (maxid) in tuples:
            if maxid[0] is not None:
                grocerysatement.set_id(maxid[0] + 1)
            else:
                grocerysatement.set_id(1)

        command = "INSERT INTO grocerystatement (id, grocery_name, quantity, description) VALUES (%s,%s,%s,%s)"
        data = (grocerysatement.get_id(), grocerysatement.get_grocery_name(),grocerysatement.get_quantity(),grocerysatement.get_description())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

        return grocerysatement

    def update(self, grocerystatement):
        cursor = self._cnx.cursor()

        command = "UPDATE grocerystatement SET grocery_name=%s, description=%s, quantity=%s WHERE id=%s"
        data = (grocerystatement.get_grocery_name(), grocerystatement.get_description(),
                grocerystatement.get_quantity(), grocerystatement.get_id())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

    def delete(self, grocerystatement):

        cursor = self._cnx.cursor()

        command = "DELETE FROM grocerystatement WHERE id={}".format(grocerystatement.get_id())
        cursor.execute(command)

        self._cnx.commit()
        cursor.close()


if (__name__ == "__main__"):
    with GroceryStatementMapper() as mapper:
        result = mapper.find_all()
        for p in result:
            print(p)