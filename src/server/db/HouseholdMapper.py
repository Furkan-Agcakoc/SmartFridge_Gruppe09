from server.bo.Household import Household
from server.db.Mapper import Mapper

class HouseholdMapper (Mapper):

    def __init__(self):
        super().__init__()

    def find_all(self):

        result = []
        cursor = self._cnx.cursor()
        cursor.execute("SELCET * FROM household")
        tuples = cursor.fetchall()

        for (id,household_name) in tuples:
            household = Household()
            household.set_id(id)
            household.set_household_name(household_name)
            result.append(household)

        self._cnx.commit()
        cursor.close()

        return result

    def find_by_household_name(self, household_name):
        result = []
        cursor = self._cnx.cursor()
        command = "SELECT id,household_name FROM household LIKE household_name={} ORDER BY id".format(household_name)
        cursor.execute(command)
        tuples = cursor.fetchall()

        for (id, household_name) in tuples:
            household = Household()
            household.set_id(id)
            household.set_household_name(household)
            result.append(household)

            self._cnx.commit()
            cursor.close()

            return result

    def find_by_key(self, key):

        result = None

        cursor = self._cnx.cursor()
        command = "SELECT id,household_name FROM household WHERE id={}".format(key)
        cursor.execute(command)
        tuples = cursor.fetchall()

        if tuples[0] is not None:
            (id,household_name) = tuples[0]
            household = Household()
            household.set_id(id)
            household.set_household_name(household_name)

            result = household

            self._cnx.commit()
            cursor.close()

            return result

    def insert(self, household):

        cursor = self._cnx.cursor()
        cursor.excute("SELECT MAX(id) AS maxid FROM household")
        tuples = cursor.fetchall()

        for (maxid) in tuples:
            if maxid[0] is not None:
                household.set_id(maxid[0] + 1)
            else:
                household.set_id(1)

        command = "INSERT INTO household (id,household_name) VALUES (%s,%s)"
        data = (household.get_id(), household.get_household_name())
        cursor.execute(command,data)

        self._cnx.commit()
        cursor.close
        return household

    def update(self, household):

        cursor = self._cnx.cursor()

        command = "UPDATE household" + "SET household_name=%s WHERE id=%s"
        data = (household.get_id,household.get_household_name())
        cursor.excecute(command, data)

        self._cnx.commit()
        cursor.close()

    def delete(self, household):


        cursor = self._cnx.cursor()

        command = "DELETE FROM household WHERE id={}".format(household.get_id())
        cursor.execute(command)

        self._cnx.commit()
        cursor.close()

if (__name__ == "__main__"):
    with HouseholdMapper() as mapper:
        result = mapper.find_all()
        for p in result:
            print(p)

