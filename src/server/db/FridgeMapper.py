from server.bo.Fridge import Fridge
from server.db.Mapper import Mapper

class FridgeMapper (Mapper):

    def __init__(self):
        super().__init__()

    def find_all(self):

        result = []
        cursor = self._cnx.cursor()
        cursor.execute("SELECT * FROM fridge")
        tuples = cursor.fetchall()

        for (id, fridge_name, household_id, groceriesstatement_id) in tuples:
            fridge = Fridge()
            fridge.set_id(id)
            fridge.set_fridge_name(fridge_name)
            fridge.set_household_id(household_id)
            fridge.set_groceriesstatement_id(groceriesstatement_id)
            result.append(fridge)

        self._cnx.commit() #alle änderungen wurden dauerhaft gemacht
        cursor.close()

        return result

    def find_by_fride_name(self, fride_name,household_id, groceriesstatement_id):
        result = []
        cursor = self._cnx.cursor()
        command = "SELECT id, fridge_name, household_id FROM fridge LIKE fridge_name={} ORDER BY id".format(fride_name)
        cursor.execute(command)
        tuples = cursor.fetchall()

        for (id, fridge_name, household_id, groceriesstatement_id) in tuples:
            fridge = Fridge()
            fridge.set_id(id)
            fridge.set_fridge_name(fridge_name)
            fridge.set_household_id(household_id)
            fridge.set_groceriesstatement_id(groceriesstatement_id)
            result.append(fridge)

            self._cnx.commit()
            cursor.close()

            return result


    def find_by_household_id(self,household):
        result = []
        cursor = self._cnx.cursor()
        command = "SELECT id, fridge_name, household_id FROM fridge WHERE household_id={} ORDER BY household_id".format(household)
        cursor.execute(command)
        tuples = cursor.fetchall()

        for (id, fridge_name, household_id, ) in tuples:
            fridge = Fridge()
            fridge.set_id(id)
            fridge.set_fridge_name(fridge_name)
            fridge.set_household_id(household_id)
            result.append(fridge)

            self._cnx.commit()
            cursor.close()

            return result

    def find_by_key(self, key):

        result = None

        cursor = self._cnx.cursor()
        command = "SELECT id, fridge_name, household_id, groceriesstatement_id FROM fridge WHERE id={}".format(key)
        cursor.execute(command)
        tuples = cursor.fetchall()

        if tuples[0] is not None:
            (id, fridge_name, household_id, groceriesstatement_id) = tuples[0]
            fridge = Fridge()
            fridge.set_id(id)
            fridge.set_fridge_name(fridge_name)
            fridge.set_household_id(household_id)
            fridge.set_groceriesstatement_id(groceriesstatement_id)


        result = fridge

        self._cnx.commit()
        cursor.close()

        return result


    def insert(self, fridge):

        cursor = self._cnx.cursor()
        cursor.execute("SELECT MAX(id) AS maxid FROM fridge")
        tuples = cursor.fetchall()

        for (maxid) in tuples:
            fridge.set_id(maxid[0]+1)

        command = "INSERT INTO fridge (id,fridge_name,household_id, groceriesstatement_id) VALUES (%s,%s)"
        data = (fridge.get_id(), fridge.get_fridge_name())
        cursor.execute(command,data)

        self._cnx.commit()
        cursor.close
        return fridge

    def update(self, fridge):

        cursor = self._cnx.cursor()

        command = "UPDATE fridge " + "SET fridge_name=%s, household_id = %s, groceriesstatement_id = %s WHERE id=%s"
        data = (fridge.get_id(), fridge.get_fridge_name(), fridge.get_household_id(), fridge.get_groceriesstatement_id())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

    def delete(self, fridge):
        """Löschen der Daten eines Account-Objekts aus der Datenbank.

        :param account das aus der DB zu löschende "Objekt"
        """
        cursor = self._cnx.cursor()

        command = "DELETE FROM fridge WHERE id={}".format(fridge.get_id())
        cursor.execute(command)

        self._cnx.commit()
        cursor.close()


if (__name__ == "__main__"):
    with FridgeMapper() as mapper:
        result = mapper.find_all()
        for p in result:
            print(p)
