from server.bo.Grocery import Grocery
from server.db.Mapper import Mapper
class GroceryMapper(Mapper):

    def __init__(self):
        super().__init__()

    def find_all(self):
        result = []
        cursor = self._cnx.cursor()
        cursor.execute("SELECT id, grocery_name, fridge_id FROM grocery")
        tuples = cursor.fetchall()

        for (id, grocery_name, fridge_id) in tuples:
            grocery = Grocery()
            grocery.set_id(id)
            grocery.set_grocery_name(grocery_name)
            grocery.set_fridge_id(fridge_id)
            result.append(grocery)

        cursor.close()
        return result

    def find_by_grocery_name(self, grocery_name):
        result = None
        cursor = self._cnx.cursor()
        command = "SELECT id, grocery_name, fridge_id FROM grocery WHERE grocery_name=%s"
        cursor.execute(command, (grocery_name,))
        tuples = cursor.fetchall()

        if tuples:
            (id, grocery_name, fridge_id) = tuples[0]
            grocery = Grocery()
            grocery.set_id(id)
            grocery.set_grocery_name(grocery_name)
            grocery.set_fridge_id(fridge_id)
            result = grocery

        cursor.close()
        return result

    def find_by_key(self, key):
        result = None
        cursor = self._cnx.cursor()
        command = "SELECT id, grocery_name, fridge_id FROM grocery WHERE id=%s"
        cursor.execute(command, (key,))
        tuples = cursor.fetchall()

        if tuples:
            (id, grocery_name, fridge_id) = tuples[0]
            grocery = Grocery()
            grocery.set_id(id)
            grocery.set_grocery_name(grocery_name)
            grocery.set_fridge_id(fridge_id)
            result = grocery

        cursor.close()
        return result

    def find_by_fridge_id(self, fridge_id):
        result = []
        cursor = self._cnx.cursor()
        command = "SELECT id, grocery_name, fridge_id FROM grocery WHERE fridge_id=%s"
        cursor.execute(command, (fridge_id,))
        tuples = cursor.fetchall()

        for (id, grocery_name, fridge_id) in tuples:
            grocery = Grocery()
            grocery.set_id(id)
            grocery.set_grocery_name(grocery_name)
            grocery.set_fridge_id(fridge_id)
            result.append(grocery)

        return result

    def checkGroceryInFridge(self, grocerystatement_id, fridge_id):
        try:
            cursor = self._cnx.cursor()
            command = "SELECT `grocerystatement_id`,`fridge_id` FROM grocery_in_fridge WHERE `grocerystatement_id`={0} AND `fridge_id`={1}".format(
                grocerystatement_id, fridge_id)
            cursor.execute(command)
            tuples = cursor.fetchall()

            if len(tuples) < 1:
                return False
            else:
                return True

        except Exception as e:
            print("exception in checkInhabitant", e)
            return None

    def insert(self, grocery):
        cursor = self._cnx.cursor()
        cursor.execute("SELECT MAX(id) AS maxid FROM grocery")
        tuples = cursor.fetchall()

        for (maxid) in tuples:
            if maxid[0] is not None:
                grocery.set_id(maxid[0] + 1)
            else:
                grocery.set_id(1)

        command = "INSERT INTO grocery (id, grocery_name,fridge_id) VALUES (%s,%s,%s)"
        data = (grocery.get_id(), grocery.get_grocery_name(), grocery.get_fridge_id())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

        return grocery

    def update(self, grocery):
        cursor = self._cnx.cursor()
        command = "UPDATE grocery SET grocery_name=%s, fridge_id=%s WHERE id=%s"
        data = (grocery.get_grocery_name(), grocery.get_fridge_id(), grocery.get_id())
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