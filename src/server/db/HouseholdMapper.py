from server.bo.Household import Household
from server.db.Mapper import Mapper

class HouseholdMapper(Mapper):

    def __init__(self):
        super().__init__()

    def find_all(self):
        result = []
        cursor = self._cnx.cursor()
        cursor.execute("SELECT * FROM household")
        tuples = cursor.fetchall()

        for (id, household_name, user_id) in tuples:
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
        command = "SELECT * FROM household WHERE household_name LIKE '{}' ORDER BY id".format(household_name)
        cursor.execute(command)
        tuples = cursor.fetchall()

        for (id, household_name) in tuples:
            household = Household()
            household.set_id(id)
            household.set_household_name(household_name)
            result.append(household)

        self._cnx.commit()
        cursor.close()

        return result

    def find_by_key(self, key):
        result = None
        cursor = self._cnx.cursor()
        command = "SELECT * FROM household WHERE id={}".format(key)
        cursor.execute(command)
        tuples = cursor.fetchall()

        if tuples:
            (id, household_name) = tuples[0]
            household = Household()
            household.set_id(id)
            household.set_household_name(household_name)
            result = household

        self._cnx.commit()
        cursor.close()

        return result

    def insert(self, household):
        cursor = self._cnx.cursor()
        cursor.execute("SELECT MAX(id) AS maxid FROM household")
        tuples = cursor.fetchall()

        for (maxid,) in tuples:
            if maxid is not None:
                household.set_id(maxid + 1)
            else:
                household.set_id(1)

        command = "INSERT INTO household (id, household_name) VALUES (%s, %s)"
        data = (household.get_id(), household.get_household_name())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

        return household

    def update(self, household):
        cursor = self._cnx.cursor()

        command = "UPDATE household SET household_name=%s WHERE id=%s"
        data = (household.get_household_name(), household.get_id())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

    def delete(self, household):
        cursor = self._cnx.cursor()

        command = "DELETE FROM household WHERE id={}".format(household.get_id())
        cursor.execute(command)

        self._cnx.commit()
        cursor.close()

    def checkInhabitant(self, user_id, household_id):
        try:
            cursor = self._cnx.cursor()
            command = "SELECT `user_id`,`household_id` FROM inhabitant WHERE `user_id`={0} AND `household_id`={1}".format(
                user_id, household_id)
            cursor.execute(command)
            tuples = cursor.fetchall()

            if len(tuples) < 1:
                return False
            else:
                return True


        except Exception as e:
            print("exception in checkInhabitant", e)
            return None

    def createInhabitant(self, user_id, household_id):

        if self.checkInhabitant(user_id, household_id) == False:
            try:
                cursor = self._cnx.cursor()
                command = "INSERT INTO inhabitant (user_id, household_id) VALUES ('{0}', '{1}')".format(user_id, household_id)
                cursor.execute(command)
                self._cnx.commit()
                cursor.close()
                return "added userid. {0} to household_id. {1}".format(user_id, household_id)

            except Exception as e:
                return str(e)
        else:
            print("user already in this household")
            return "user already in this household"

    def deleteInhabitant(self, user_id, household_id):

        try:
            cursor = self._cnx.cursor()
            command = "DELETE FROM inhabitant WHERE user_id = {0} AND household_id =  {1}".format(
                user_id, household_id)
            cursor.execute(command)
            self._cnx.commit()
            cursor.close()
            return "deleted user_id. {0} to household_id. {1}".format(user_id, household_id)

        except Exception as e:
            return str(e)

    def get_users_by_household_id(self, household_id):

        try:
            cursor = self._cnx.cursor()
            command = "SELECT user_id from inhabitant WHERE household_id = {0}".format(household_id)
            cursor.execute(command)
            tuples = cursor.fetchall()
            re = []
            result =[]
            for i in tuples:
                re.append(i[0])

            self._cnx.commit()
            cursor.close()
            user_ids = re


            return re

        except Exception as e:
            print(e)

            return None

if (__name__ == "__main__"):
    with HouseholdMapper() as mapper:
        result = mapper.find_all()
        for p in result:
            print(p)
