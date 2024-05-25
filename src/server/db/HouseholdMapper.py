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
        command = "SELECT * FROM household WHERE household_name LIKE '{}' ORDER BY id".format(household_name)
        cursor.execute(command)
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

    def find_by_key(self, key):
        result = None
        cursor = self._cnx.cursor()
        command = "SELECT * FROM household WHERE id={}".format(key)
        cursor.execute(command)
        tuples = cursor.fetchall()

        if tuples:
            (id, household_name, user_id, fridge_id) = tuples[0]
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
        cursor.execute("SELECT MAX(id) AS maxid FROM household")
        tuples = cursor.fetchall()

        for (maxid,) in tuples:
            if maxid is not None:
                household.set_id(maxid + 1)
            else:
                household.set_id(1)

        command = "INSERT INTO household (id, household_name, user_id, fridge_id) VALUES (%s, %s, %s, %s)"
        data = (household.get_id(), household.get_household_name(), household.get_user_id(), household.get_fridge_id())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

        return household

    def update(self, household):
        cursor = self._cnx.cursor()

        command = "UPDATE household SET household_name=%s, user_id=%s, fridge_id=%s WHERE id=%s"
        data = (household.get_household_name(), household.get_user_id(), household.get_fridge_id(), household.get_id())
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
        cursor = self._cnx.cursor()
        command = "SELECT `user_id`, `group_id` FROM inhabitant WHERE `user_id` = %s AND `household_id` = %s"
        cursor.execute(command, (user_id, household_id))
        tuples = cursor.fetchall()
        cursor.close()
        return len(tuples) > 0

    def createInhabitant(self, user_id, household_id):
        if not self.checkInhabitant(user_id, household_id):
            cursor = self._cnx.cursor()
            command = "INSERT INTO inhabitant (user_id, household_id) VALUES (%s, %s)"
            cursor.execute(command, (user_id, household_id))
            self._cnx.commit()
            cursor.close()
            return f"added usernr. {user_id} to householdnr. {household_id}"
        else:
            print("inhabitance already exists")
            return "inhabitance already exists"

    def deleteInhabitant(self, user_id, household_id):
        cursor = self._cnx.cursor()
        command = "DELETE FROM inhabitant WHERE user_id = %s AND household_id = %s"
        cursor.execute(command, (user_id, household_id))
        self._cnx.commit()
        cursor.close()
        return f"deleted usernr. {user_id} from householdnr. {household_id}"

    def get_users_from_household_id(self, household_id):
        cursor = self._cnx.cursor()
        command = "SELECT user_id FROM inhabitant WHERE household_id = %s"
        cursor.execute(command, (household_id,))
        tuples = cursor.fetchall()
        cursor.close()
        return [i[0] for i in tuples]

if (__name__ == "__main__"):
    with HouseholdMapper() as mapper:
        result = mapper.find_all()
        for p in result:
            print(p)
