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

        for (id, household_id) in tuples:
            fridge = Fridge()
            fridge.set_id(id)
            fridge.set_household_id(household_id)
            result.append(fridge)

        self._cnx.commit() #alle Ã¤nderungen wurden dauerhaft gemacht
        cursor.close()

        return result


    def find_by_household_id(self,household_id):
        result = []
        cursor = self._cnx.cursor()
        command = "SELECT id, household_id FROM fridge WHERE household_id={} ORDER BY household_id".format(household_id)
        cursor.execute(command)
        tuples = cursor.fetchall()

        for (id, household_id, ) in tuples:
            fridge = Fridge()
            fridge.set_id(id)
            fridge.set_household_id(household_id)
            result.append(fridge)

            self._cnx.commit()
            cursor.close()

            return result

    def find_by_key(self, key):

        result = None

        cursor = self._cnx.cursor()
        command = "SELECT id, household_id FROM fridge WHERE id={}".format(key)
        cursor.execute(command,)
        tuples = cursor.fetchall()

        if tuples[0] is not None:
            (id, household_id) = tuples[0]
            fridge = Fridge()
            fridge.set_id(id)
            fridge.set_household_id(household_id)


        result = fridge

        self._cnx.commit()
        cursor.close()

        return result


    def insert(self, fridge):
        cursor = self._cnx.cursor()

        cursor.execute("SELECT MAX(id) AS maxid FROM fridge")
        tuples = cursor.fetchall()

        for (maxid) in tuples:
            if maxid[0] is not None:
                fridge.set_id(maxid[0] + 1)
            else:
                fridge.set_id(1)

        insert_command = "INSERT INTO fridge (id, household_id) VALUES (%s, %s)"
        insert_data = (fridge.get_id(), fridge.get_household_id())
        cursor.execute(insert_command, insert_data)

        default_measures = [
            ('g', fridge.get_id()),
            ('Gramm', fridge.get_id()),
            ('kg', fridge.get_id()),
            ('Kilogramm', fridge.get_id()),
            ('ml', fridge.get_id()),
            ('Milliliter', fridge.get_id()),
            ('l', fridge.get_id()),
            ('Liter', fridge.get_id()),
            ('Teelöffel', fridge.get_id()),
            ('Esslöffel', fridge.get_id()),
            ('Prise', fridge.get_id()),
        ]

        for unit, fridge_id in default_measures:
            measure_insert_command = "INSERT INTO measure (unit, fridge_id) VALUES (%s, %s)"
            measure_insert_data = (unit, fridge_id)
            cursor.execute(measure_insert_command, measure_insert_data)

        default_groceries = ['Salz', 'Zucker', 'Pfeffer', 'Mehl', 'Ei', 'Milch', 'Butter', 'Brot', 'Käse', 'Kartoffel', 'Apfel', 'Reis', 'Nudel']


        for grocery in default_groceries:
            grocery_insert_command = "INSERT INTO grocery (grocery_name, fridge_id) VALUES (%s, %s)"
            grocery_insert_data = (grocery, fridge.get_id())
            cursor.execute(grocery_insert_command, grocery_insert_data)

        self._cnx.commit()
        cursor.close()

        return fridge

    def update(self, fridge):

        cursor = self._cnx.cursor()

        command = "UPDATE fridge " + "SET household_id=%s WHERE id=%s"
        data = (fridge.get_household_id(),fridge.get_id())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

    def delete(self, fridge):
        cursor = self._cnx.cursor()
        command = "DELETE FROM grocery_in_fridge WHERE fridge_id=%s"
        cursor.execute(command, (fridge.get_id(),))

        self._cnx.commit()
        cursor.close()


if (__name__ == "__main__"):
    with FridgeMapper() as mapper:
        result = mapper.find_all()
        for p in result:
            print(p)