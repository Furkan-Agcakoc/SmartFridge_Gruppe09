from server.bo.Household import Household
from server.db.Mapper import Mapper

class HouseholdMapper (Mapper):

    def __init__(self):
        super().__init__()

    def find_all(self):

        result = []
        cursor = self._cnx.cursor()
        cursor.execute("SELECT * FROM household")
        tuples = cursor.fetchall()

        for (id, household_name, user_id, fridge_id) in tuples:
            household = Household()
            household.set_id(id)
            household.set_household_name(household_name)
            household.set_user_id(user_id)
            household.set_fridge_id(fridge_id)

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

        for (id, household_name, user_id, fridge_id) in tuples:
            household = Household()
            household.set_id(id)
            household.set_household_name(household_name)
            household.set_user_id(user_id)
            household.set_fridge_id(fridge_id)

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
            (id,household_name, user_id, fridge_id) = tuples[0]
            household = Household()
            household.set_id(id)
            household.set_household_name(household_name)
            household.set_user_id(user_id)
            household.set_fridge_id(fridge_id)

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

        command = "INSERT INTO household (id,household_name,user_id,fridge_id) VALUES (%s,%s,%s,%s)"
        data = (household.get_id(), household.get_household_name(), household.get_user_id(), household.get_fridge_id())
        cursor.execute(command,data)

        self._cnx.commit()
        cursor.close
        return household

    def update(self, household):

        cursor = self._cnx.cursor()

        command = "UPDATE household" + "SET household_name=%s,user_id=%s,fridge_id=%s  WHERE id=%s"
        data = (household.get_id(), household.get_household_name(), household.get_user_id(), household.get_fridge_id())
        cursor.excecute(command, data)

        self._cnx.commit()
        cursor.close()

    def delete(self, household):


        cursor = self._cnx.cursor()

        command = "DELETE FROM household WHERE id={}".format(household.get_id())
        cursor.execute(command)

        self._cnx.commit()
        cursor.close()


'''
    def checkinhabitent(self, user_id, household_id):
        cursor = self._cnx.cursor()
        command = "SELECT `user_id`, `household_id` FROM household_members WHERE `user_id`={} AND `household_id`={}".format(user_id, household_id) #müssen dann hier neue datenbank mit household_members
        cursor.execute(command)
        tuples = cursor.fetchall()
        cursor.close()

        return len(tuples) > 0

    def createinhabitent(self, user_id, household_id):
        if not self.checkinhabitent(user_id, household_id):
            try:
                cursor = self._cnx.cursor()
                command = "INSERT INTO household_members (user_id, household_id) VALUES (%s, %s)"
                cursor.execute(command, (user_id, household_id))
                self._cnx.commit()
                cursor.close()
                return "Added user {} to household {}".format(user_id, household_id)
            except Exception as e:
                return str(e)
        else:
            return "Bewohner ist bereits drinnen"

'''
if (__name__ == "__main__"):
    with HouseholdMapper() as mapper:
        result = mapper.find_all()
        for p in result:
            print(p)