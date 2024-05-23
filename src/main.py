# Unser Service basiert auf Flask
from flask import Flask
# Auf Flask aufbauend nutzen wir RestX
from flask_restx import Api, Resource, fields
# Wir benutzen noch eine Flask-Erweiterung für Cross-Origin Resource Sharing
from flask_cors import CORS

from server.Administration import Administration
from server.bo.Fridge import Fridge
from server.bo.Groceries import Groceries
from server.bo.GroceriesStatement import GroceriesStatement
from server.bo.Household import Household
from server.bo.Recipe import Recipe
from server.bo.User import User

from SecurityDecorater import secured

app = Flask(__name__)

CORS(app, resources=r'/Smartfridge/*')

api = Api(app, version='1.0', title='Smartfridge API',
          description='Eine rudimentäre Demo-API für einen Smartfridge.')

smartfridge = api.namespace('Smartfridge', description='Funktion einer Smartfridge')

bo = api.model('BusinessObject', {
    'id': fields.Integer(attribute='_id', description='Der Unique Identifier eines Business Object')
})

user = api.inherit('User', bo, {
    'firstname': fields.String(attribute='_firstname', description='Vorname eines Benutzers'),
    'lastname': fields.String(attribute='_lastname', description='Nachname eines Benutzers'),  # korrigiert '_lasttname'
    'nickname': fields.String(attribute='_nickname', description='Nickname eines Benutzers'),
    'email': fields.String(attribute='_email', description='E-Mail-Adresse eines Benutzers'),
    'user_id': fields.String(attribute='_user_id', description='Google User ID eines Benutzers')
})

fridge = api.inherit('Fridge', bo, {
    'fridge_name': fields.String(attribute='_fridge_name', description='Name eines Kühlschranks'),
    'household_id': fields.Integer(attribute='_household_id', description='Haushalt Id in welchem der Kühlschrank ist.'),
    'groceriesstatement_id': fields.Integer(attribute='_groceriesstatement_id', description='Groceriesstatement Id in welchem der Kühlschrank ist.')
})

recipe = api.inherit('Recipe', bo, {
    'recipe_name': fields.String(attribute='_recipe_name', description='Name eines Rezepts'),
    'portions': fields.Integer(attribute='_portions', description='Portionen eines Rezepts'),
    'instruction': fields.String(attribute='_instruction', description='Anleitung eines Rezepts'),  # korrigiert '_instrctions'
    'duration': fields.String(attribute='_duration', description='Dauer eines Rezepts'),
    'user_id': fields.Integer(attribute='_user_id', description='Die Id eines Users'),
    'groceriesstatement_id': fields.Integer(attribute='_groceriesstatement_id', description='Die Id eines Groceriesstatement')
})

groceries = api.inherit('Groceries', bo, {
    'groceries_name': fields.String(attribute='_groceries_name', description='Name eines Lebensmittels')
})

household = api.inherit('Household', bo, {
    'household_name': fields.String(attribute='_household_name', description='Name des Haushalts'),
    'user_id' :fields.Integer(attribute='_user_id', description='Die Id eines Users'),
    'fridge_id' :fields.Integer(attribute='_fridge_id', description='Die Id eines Fridges'),
})

groceriesstatement = api.inherit('GroceriesStatement', bo, {
    'groceries_name': fields.String(attribute='_groceries_name', description='Name eines Lebensmittels'),
    'description' : fields.String(attribut='_description', description='Die Maßeinheit eines Lebensmittel'),
    'quantity' : fields.Integer(attribut='_quantity', description='Die Mengeneinheit eines Lebensmittel')
})

'''
User
'''
@smartfridge.route('/user')
@smartfridge.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
class UserListOperations(Resource):
    @smartfridge.marshal_list_with(user)
   # @secured
    def get(self):
        adm = Administration()
        user_list = adm.get_all_users()
        return user_list

    @smartfridge.marshal_with(user, code=200)
    @smartfridge.expect(user)
    #@secured
    def post(self):
        adm = Administration()
        user = User.from_dict(api.payload)
        if user is not None:
            u = adm.create_user(user)
            return u, 200
        else:
            return '', 500

@smartfridge.route('/user/<int:id>')
@smartfridge.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
@smartfridge.param('id', 'Die ID des User-Objekts')
class UserOperations(Resource):
    @smartfridge.marshal_with(user)
   # @secured
    def get(self, id):
        adm = Administration()
        user = adm.get_user_by_id(id)
        return user

   # @secured
    def delete(self, id):
        adm = Administration()
        user = adm.get_user_by_id(id)
        adm.delete_user(user)
        return '', 200

    @smartfridge.marshal_with(user)
    @smartfridge.expect(user, validate=True)
   # @secured
    def put(self, id):
        adm = Administration()
        u = User.from_dict(api.payload)
        if u is not None:
            u.set_id(id)
            adm.update_user(u)
            return '', 200
        else:
            return '', 500

@smartfridge.route('/user/google_user_id/<string:google_user_id>')
@smartfridge.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
@smartfridge.param('google_user_id', 'Die Google ID des User-Objekts')
class GoogleOperations(Resource):
    @smartfridge.marshal_with(user)
    def get(self, google_user_id):
        adm = Administration()
        user = adm.get_user_by_google_user_id(google_user_id)
        return user

# Muss hier eventuell noch eine route mit Haushalt ? Create_Household_for_User

'''
Household
'''

@smartfridge.route('/household')
@smartfridge.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
class HouseholdListOperations(Resource):
    @smartfridge.marshal_list_with(household)
   # @secured
    def get(self):
        "Wiedergabe der Household Objekts"
        adm = Administration()
        household_list = adm.get_all_householdes()
        if len(household_list) == 0:
            return {'message': 'Liste ist leer'}
        return household_list

    @smartfridge.marshal_with(household, code=200)

    @smartfridge.expect(household)
    # @secured
    def post(self):
        """Erstellen eines Household Objekts"""

        adm = Administration()

        proposal = Household.from_dict(api.payload)

        if proposal is not None:
            hh = adm.create_household(
                proposal.get_household_name(), proposal.get_user_id(),proposal.get_fridge_id())
            return hh, 200
        else:
            # Wenn irgendetwas schiefgeht, dann geben wir nichts zurück und werfen einen Server-Fehler.
            return '', 500

@smartfridge.route('/household/<int:id>')
@smartfridge.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
@smartfridge.param('id', 'Die ID des Haushalts.')
class HouseholdOperations(Resource):
    @smartfridge.marshal_with(household)
   # @secured
    def get(self, id):
        """Wiedergeben von Household ID"""
        adm = Administration()
        household = adm.get_household_by_id(id)
        if household is None:
            return "Haushalt mit der ID " + str(id) + " wurde nicht gefunden.", 404
        return household, 200

   # @secured
    def delete(self, id):
        """Löschen eines Household Objekts"""
        adm = Administration()
        household = adm.get_household_by_id(id)
        try:
            adm.delete_household(household)
            return '', 200
        except Exception as e:
            return {'message': str(e)}, 500

    @smartfridge.marshal_with(household)
    @smartfridge.expect(household, validate=True)
   # @secured
    def put(self, id):
        """Updaten eines Household Objekts"""
        adm = Administration()
        house = Household.from_dict(api.payload)
        if house is not None:
            house.set_id(id)
            adm.update_household(house)
            return '', 200
        else:
            return '', 500

'''
groceries
'''

@smartfridge.route('/groceries')
@smartfridge.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
class GroceriesListOperations(Resource):
    @smartfridge.marshal_list_with(groceries)
    #@secured
    def get(self):
        """Wiedergebe eines Groceries Objekts"""
        adm = Administration()
        groceries_list = adm.get_all_groceries()
        return groceries_list

    @smartfridge.marshal_with(groceries, code=200)

    @smartfridge.expect(groceries)
    #@secured
    def post(self):
        """Erstellen eines Groceries Objekts"""

        adm = Administration()

        proposal = Groceries.from_dict(api.payload)

        if proposal is not None:
            g = adm.create_groceries(
                proposal.get_groceries_name())
            return g, 200
        else:
            # Wenn irgendetwas schiefgeht, dann geben wir nichts zurück und werfen einen Server-Fehler.
            return '', 500






@smartfridge.route('/groceries/<int:id>')
@smartfridge.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
@smartfridge.param('id', 'Die ID des Groceries-Objekts')
class GroceriesOperations(Resource):
    @smartfridge.marshal_with(groceries)
    #@secured
    def get(self, id):
        """Wiedergabe eines Groceries Objekts durch ID"""
        adm = Administration()
        groceries = adm.get_groceries_by_id(id)
        return groceries

    #@secured
    def delete(self, id):
        """Löschen eines Groceries Objekts"""
        adm = Administration()
        groceries = adm.get_groceries_by_id(id)
        adm.delete_groceries(groceries)
        return '', 200

    @smartfridge.marshal_with(groceries)
    @smartfridge.expect(groceries, validate=True)
    #@secured
    def put(self, id):
        """Updaten eines Household Objekts"""
        adm = Administration()
        g = Groceries.from_dict(api.payload)
        if g is not None:
            g.set_id(id)
            adm.update_groceries(g)
            return '', 200
        else:
            return '', 500

@smartfridge.route('/groceries/groceries_name/<string:groceries_name>')
@smartfridge.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
@smartfridge.param('groceries_name', 'Der name des grocerie-Objekts')
class GroceriesNameOperations(Resource):
    @smartfridge.marshal_with(groceries)
    def get(self, groceries_name):
        adm = Administration()
        groceries = adm.get_groceries_by_name(groceries_name)
        return groceries




'''
recipe
'''

@smartfridge.route('/recipe')
@smartfridge.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
class RecipeListOperations(Resource):
    @smartfridge.marshal_list_with(recipe)
    #@secured
    def get(self):
        """Wiedergebe eines Recipe Objekts"""
        adm = Administration()
        recipe_list = adm.get_all_recipe()
        return recipe_list

    @smartfridge.marshal_with(recipe, code=200)

    @smartfridge.expect(recipe)
    #@secured
    def post(self):
        """Erstellen eines Recipe Objekts"""

        adm = Administration()

        proposal = Recipe.from_dict(api.payload)

        if proposal is not None:
            r = adm.create_recipe(
                proposal.get_recipe_name(), proposal.get_portions(), proposal.get_instruction(), proposal.get_duration(), proposal.get_user_id(), proposal.get_groceriesstatement_id())


            return r, 200
        else:
            # Wenn irgendetwas schiefgeht, dann geben wir nichts zurück und werfen einen Server-Fehler.
            return '', 500

@smartfridge.route('/recipe/<int:id>')
@smartfridge.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
@smartfridge.param('id', 'Die ID des Recipe-Objekts')
class RecipeOperations(Resource):
    @smartfridge.marshal_with(recipe)
    #@secured
    def get(self, id):
        """Wiedergabe eines Recipe Objekts durch ID"""
        adm = Administration()
        recipe = adm.get_recipe_by_id(id)
        return recipe

    #@secured
    def delete(self, id):
        """Löschen eines Recipe Objekts"""
        adm = Administration()
        recipe = adm.get_recipe_by_id(id)
        adm.delete_recipe(recipe)
        return '', 200

    @smartfridge.marshal_with(recipe)
    @smartfridge.expect(recipe, validate=True)
    #@secured
    def put(self, id):
        """Updaten eines Household Objekts"""
        adm = Administration()
        r = Recipe.from_dict(api.payload)
        if r is not None:
            r.set_id(id)
            adm.update_recipe(r)
            return '', 200
        else:
            return '', 500

@smartfridge.route('/recipe/recipe_name/<string:recipe_name>')
@smartfridge.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
@smartfridge.param('recipe_name', 'Der Name des Recipe-Objekts')
class RecipeNameOperations(Resource):
    @smartfridge.marshal_with(recipe)
    def get(self, recipe_name):
        adm = Administration()
        recipe = adm.get_groceries_by_name(recipe_name)
        return recipe

"""
fridge
"""

@smartfridge.route('/fridge')
@smartfridge.response(500,'Falls es zu einem Server-seitigen Fehler kommt.')
class FridgeListOperations(Resource):
    @smartfridge.marshal_list_with(fridge)
    # @secured
    def get(self):
        "Wiedergabe eines Fridge Objekts"
        adm = Administration()
        fridge_list = adm.get_all_fridges()
        return fridge_list

    @smartfridge.marshal_with(fridge, code=200)
    @smartfridge.expect(fridge)
    # @secured
    def post(self):
        "Erstellen eines Fridge Objekts"
        adm = Administration()

        proposal = Fridge.from_dict(api.payload)

        if proposal is not None:
            fri = adm.create_fridge_of_household(
                proposal.get_fridge_name(), proposal.get_household_id(), proposal.get_groceriesstatement_id())
            return fri, 200
        else:
            # Wenn irgendetwas schiefgeht, dann geben wir nichts zurück und werfen einen Server-Fehler.
            return '', 500




@smartfridge.route('/fridge/<int:id>')
@smartfridge.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
@smartfridge.param('id', 'Die ID des Fridge-Objekts')
class FridgeOperations(Resource):
    @smartfridge.marshal_list_with(fridge)
   # @secured
    def get(self,id):
        "Wiedergabe eines Fridge Objekts durch ID"

        adm = Administration()
        fri = adm.get_fridge_by_id(id)
        return fri

   # @secured
    def delete(self,id):

        adm = Administration()
        fri = adm.get_fridge_by_id(id)
        adm.delete_fridge(fri)
        return '',200

    @smartfridge.marshal_with(fridge)
   # @secured
    def put(self,id):

        adm = Administration()
        fri = Fridge.from_dict(api.payload)

        if fri is not None:
            fri.set_id(id)
            adm.update_fridge(fri)
            return '',200
        else:
            return '',500

@smartfridge.route('/household/<int:id>/fridge')
@smartfridge.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
@smartfridge.param('id', 'Die ID des Household-Objekts')
class HouseholdRelatedFridgeOperations(Resource):
    @smartfridge.marshal_with(fridge)
   # @secured
    def get(self,id):
        adm = Administration()
        house = adm.get_household_by_id(id)

        if house is not None:

            fridge_list = adm.get_fridge_of_household(house)
            return fridge_list
        else:
            return " Household not found", 500

    @smartfridge.marshal_with(fridge, code=201)
   # @secured
    def post(self,id):
        adm = Administration()

        house = adm.get_household_by_id(id)

        if house is not None:
            result = adm.create_fridge_of_household(house)
            return result
        else:
            return "Household unkown", 500

#Hier noch das gleiche mit Groceriesstatement related to fridge
'''
@smartfridge.route('/groceriesstatement/<int:id>/fridge')
@smartfridge.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
@smartfridge.param('id', 'Die ID des Household-Objekts')
class GroceriesstatementRelatedFridgeOperations(Resource):
    @smartfridge.marshal_with(fridge)
    @secured
    def get(self,id):
        adm = Administration()
        gst = adm.get_groceriesstatement_by_id(id)

        if gst is not None:

            fridge_list = adm.get_groceriesstatement_by_fridge(gst)
            return fridge_list
        else:
            return " Grocerie not found", 500

    @smartfridge.marshal_with(fridge, code=201)
    @secured
    def post(self,id):
        adm = Administration()

        gst = adm.get_groceriesstatement_by_id(id)

        if gst is not None:
            result = adm.create_groceriesstatement_for_fridge(gst) #methode muss implementiert werden
            return result
        else:
            return "Grocerie unkown", 500
'''
"""
groceriesstatement
"""
@smartfridge.route('/groceriesstatement')
@smartfridge.response(500,'Falls es zu einem Server-seitigen Fehler kommt.')
class GroceriesstatementListOperations(Resource):
    @smartfridge.marshal_list_with(groceriesstatement)
   # @secured
    def get(self):
        adm = Administration()
        fridge_list = adm.get_all_fridges()
        return fridge_list


@smartfridge.route('/groceriesstatement/<int:id>')
@smartfridge.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
@smartfridge.param('id', 'Die ID des Groceriesstatement-Objekts')
class FridgeOperations(Resource):
    @smartfridge.marshal_list_with(groceriesstatement)
   # @secured
    def get(self,id):

        adm = Administration()
        gst = adm.get_groceriesstatement_by_id(id)
        return gst

   # @secured
    def delete(self,id):

        adm = Administration()
        gst = adm.get_groceriesstatement_by_id(id)
        adm.delete_groceriesstatement(gst)
        return '',200

    @smartfridge.marshal_with(groceriesstatement)
   # @secured
    def put(self,id):

        adm = Administration()
        gst = GroceriesStatement.from_dict(api.payload)

        if gst is not None:
            gst.set_id(id)
            adm.update_groceriesstatement(gst)
            return '',200
        else:
            return '',500



if __name__ == '__main__':
    app.run(debug=True)
