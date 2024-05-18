# Unser Service basiert auf Flask
from flask import Flask
# Auf Flask aufbauend nutzen wir RestX
from flask_restx import Api, Resource, fields
# Wir benutzen noch eine Flask-Erweiterung für Cross-Origin Resource Sharing
from flask_cors import CORS

from server.Adminstration import Adminstration
from server.bo.Fridge import Fridge
from server.bo.Groceries import Groceries
from server.bo.GroceriesStatement import GroceriesStatement
from server.bo.Household import Household
from server.bo.Measure import Measure
from server.bo.Quantity import Quantity
from server.bo.Recipe import Recipe
from server.bo.User import User

from SecurityDecorater import secured

app = Flask(__name__)

CORS(app, resources=r'/Smartfridge/*')

api = Api(app, version='1.0', title='Smartfridge API',
          description='Eine rudimentäre Demo-API für einen Smartfridge.')

smartfridge = api.namespace('Smartfridge', description='Funktion einer Smartfridge')

bo = api.model('BusinessObject', {
    'id': fields.Integer(attribute='_id', description='Der Unique Identifier eines Business Object') #unique identifier = etwas eindeutiges?
})

user = api.inherit('User', bo, {
    'firstname': fields.String(attribute='_firstname', description='Vorname eines Benutzers'),
    'lastname': fields.String(attribute='_lasttname', description='Nachname eines Benutzers'),
    'nickname': fields.String(attribute='_nickname', description='Nickname eines Benutzers'),
    'email': fields.String(attribute='_email', description='E-Mail-Adresse eines Benutzers'),
    'user_id': fields.String(attribute='_user_id', description='Google User ID eines Benutzers')
})

fridge = api.inherit('Fridge', bo, {
    'fridge_name': fields.String(attribute='_fridge_name', description='Name eines Kühlschranks'),
    'household': fields.Integer(attribute='_household', description='Haushalt Id in welchem der Kühlschrank ist.')  # so richitg weil Fremdschlüssel?
})


recipe = api.inherit('Recipe', bo, {
    'recipename': fields.String(attribute='_recipename', description='Name eines Rezepts'),
    'portions': fields.Integer(attribute='_portions', description='Portionen eines Rezepts'),
    'instructions': fields.String(attribute='_instrctions', description='Anleitung eines Rezepts'),
    'duration': fields.String(attribute='_duration', description='Dauer eines Rezepts')
})

groceries = api.inherit('Groceries', bo, {
    'groceries_name': fields.String(attribute='_groceries_name', description='Name eines Lebensmittels')
})

@smartfridge.route('/users')
@smartfridge.response(500,'Falls es zu einem Server-seitigen Fehler kommt.')
class UserListOperations(Resource):
    @smartfridge.marshal_list_with(user)
    @secured
    def get(self):

        adm = Adminstration()
        user_list = adm.get_all_users()
        return user_list
    @smartfridge.marshal_with(user, code=200)
    @smartfridge.expect(user)
    @secured
    def post(self):

        adm = Adminstration()

        user = User.from_dict(api.payload)

        if user is not None:

            u = adm.create_user()
            return u, 200
        else:
            return '', 500

@smartfridge.route('/user/<int:id>')
@smartfridge.response(500,'Falls es zu einem Server-seitigen Fehler kommt.')
@smartfridge.param('id', 'Die ID des User-Objekts')
class UserOperations(Resource):
    @smartfridge.marshal_list_with(user)
    @secured
    def get(self,id):

        adm = Adminstration()
        user = adm.get_user_by_id(id)

    @secured
    def delete(self,id):

        adm = Adminstration()
        user = adm.get_user_by_id(id)
        adm.delete_user(user)
        return '' , 200

    @smartfridge.marshal_with(user)
    @smartfridge.expect(user, validate=True)
    @secured
    def put(self, id):

        adm = Adminstration()
        u = User.from_dict(api.payload)

        if u is not None:
            u.set_id(id)
            adm.update_user(u)
            return '',200
        else:
            return '',500


# Muss hier eventuell noch eine route mit Haushalt ? Create_Household_for_User

'''''
@smartfridge.route('/user/google_user_id/<string:google_user_id>')
@smartfridge.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
@smartfridge.param('google_user_id', 'Die Google ID des User-Objekts')
class GoogleOperations(Resource):
    @smartfridge.marshal_with(user)
    def get(self, google_user_id):

        adm = Adminstration()
        user = adm.get_user_by_google_user_id(google_user_id)

        return user


@smartfridge.route('/household')
@smartfridge.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
class HouseholdListOperations(Resource):
    @smartfridge.marshal_list_with(Household)
    @secured
    def get(self):
        adm = Adminstration()
        household_list = adm.get_all_householdes()

        if len(household_list) == 0:
            return {'message': 'Liste ist leer'}

        return household_list

    @smartfridge.marshal_list_with(Household, code=200)
    @smartfridge.expect(Household)

    def post(self):

        adm = Adminstration()
        household = Household.from_dict(api.playload)

        if household is not None:

            house = adm.create_household(household)
            return '', 200

        else:
            return '', 500

@smartfridge.route('/household/<int:id>')
@smartfridge.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
@smartfridge.param('id', 'Die ID des Haushalts.')
class HouseholdOperations(Resource):
    @smartfridge.marshal_with(Household)
    @secured

    def get(self, id):

        adm = Adminstration()
        household = adm.get_household_by_id(id)

        if household is None:
            return "Haushalt mit der ID " + str(id) + "wurde nicht gefunden."

        return household, 200

    def delet(self, id):

        adm = Adminstration()
        household = adm.get_household_by_id(id)

        try:
            adm.delete_household(household)
            return '', 200
        except Exception as a:
            return  {'message': str(a)}, 500

    @smartfridge.marshal_with(Household)
    @smartfridge.expect(Household, validate=True)
    def put(self, id):

        adm = Adminstration()
        house = Household.from_dict(api.payload)

        if house is not None:
            house.set_id(id)
            adm.update_household(house)
            return '', 200
        else:
            return '', 500
'''  # Wenn man es ausführt kommt ein Fehler auf der API website??



if __name__ == '__main__':
    app.run(debug=True)