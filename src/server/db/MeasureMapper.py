from server.bo.Measure import Measure
from server.db.Mapper import Mapper
class MeasureMapper(Mapper):

    def __init__(self):
        super().__init__()

    def find_all(self):
        result = []
        cursor = self._cnx.cursor()
        cursor.execute("SELECT id, unit, fridge_id FROM measure")
        tuples = cursor.fetchall()

        for (id, unit, fridge_id) in tuples:
            measure = Measure()
            measure.set_id(id)
            measure.set_unit(unit)
            measure.set_fridge_id(fridge_id)
            result.append(measure)

        cursor.close()
        return result

    def find_by_unit_id(self, unit_id):
        result = []
        cursor = self._cnx.cursor()
        command = "SELECT id, unit, fridge_id FROM measure WHERE measure=%s ORDER BY id"
        cursor.execute(command, (unit_id,))
        tuples = cursor.fetchall()

        for (id, unit, fridge_id) in tuples:
            measure = Measure()
            measure.set_id(id)
            measure.set_unit(unit)
            measure.set_fridge_id(fridge_id)
            result.append(measure)

        cursor.close()
        return result

    def find_by_key(self, key):
        result = None
        cursor = self._cnx.cursor()
        command = "SELECT id, unit, fridge_id FROM measure WHERE id=%s"
        cursor.execute(command, (key,))
        tuples = cursor.fetchall()

        if tuples:
            (id, unit, fridge_id) = tuples[0]
            measure = Measure()
            measure.set_id(id)
            measure.set_unit(unit)
            measure.set_fridge_id(fridge_id)
            result = measure

        cursor.close()
        return result

    def find_by_unit_name(self, unit):
        result = []
        cursor = self._cnx.cursor()
        command = "SELECT * FROM measure WHERE unit LIKE '{}' ORDER BY id".format(unit)
        cursor.execute(command)
        tuples = cursor.fetchall()

        for (id, unit, fridge_id) in tuples:
            measure = Measure()
            measure.set_id(id)
            measure.set_unit(unit)
            measure.set_fridge_id(fridge_id)
            result.append(measure)

        self._cnx.commit()
        cursor.close()

        return result


    def insert(self, measure):

        cursor = self._cnx.cursor()
        cursor.execute("SELECT MAX(id) AS maxid FROM measure")
        tuples = cursor.fetchall()

        for (maxid) in tuples:
            if maxid[0] is not None:
                measure.set_id(maxid[0] + 1)
            else:
                measure.set_id(1)

        command = "INSERT INTO measure (id, unit, fridge_id) VALUES (%s,%s,%s)"
        data = (measure.get_id(), measure.get_unit(), measure.get_fridge_id())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

        return measure

    def update(self, measure):
        cursor = self._cnx.cursor()
        command = "UPDATE measure SET unit=%s, fridge_id=%s WHERE id=%s"
        data = (measure.get_unit(), measure.get_id(), measure.get_fridge_id())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

    def delete(self, measure):
        cursor = self._cnx.cursor()
        command = "DELETE FROM measure WHERE id=%s"
        cursor.execute(command, (measure.get_id(),))

        self._cnx.commit()
        cursor.close()


if __name__ == "__main__":
    with MeasureMapper() as mapper:
        result = mapper.find_all()
        for p in result:
            print(p)