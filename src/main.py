# Unser Service basiert auf Flask
from flask import Flask, request, g
# Auf Flask aufbauend nutzen wir RestX
from flask_restx import Api, Resource, fields
# Wir benutzen noch eine Flask-Erweiterung für Cross-Origin Resource Sharing
from flask_cors import CORS

from server.Administration import Administration
from server.bo.Fridge import Fridge
from server.bo.Grocery import Grocery
from server.bo.GroceryStatement import GroceryStatement
from server.bo.Household import Household
from server.bo.Recipe import Recipe
from server.bo.User import User
from server.bo.Measure import Measure

from SecurityDecorater import secured

app = Flask(__name__)


# CORS(app)
# CORS(app, resources={r"/Smartfridge/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)
#CORS(app, resources=r'/Smartfridge/*', supports_credentials=True)
##Neu---
# CORS(app, resources={r"/Smartfridge/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)
#CORS(app, res)
# CORS(app, resources={r"/Smartfridge/*": {"origins": "*"}})
CORS(app, resources={r"/Smartfridge/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)



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
    'google_user_id': fields.String(attribute='_google_user_id', description='Google User ID eines Benutzers')
})

fridge = api.inherit('Fridge', bo, {
    'household_id': fields.Integer(attribute='_household_id', description='Haushalt Id in welchem der Kühlschrank ist.'),
})

recipe = api.inherit('Recipe', bo, {
    'recipe_name': fields.String(attribute='_recipe_name', description='Name eines Rezepts'),
    'portion': fields.Integer(attribute='_portion', description='Portion eines Rezepts'),
    'instruction': fields.String(attribute='_instruction', description='Anleitung eines Rezepts'),
    'duration': fields.String(attribute='_duration', description='Dauer eines Rezepts'),
    'user_id': fields.Integer(attribute='_user_id', description='Die Id eines Users'),
    'fridge_id': fields.Integer(attribute='_fridge_id', description='Die Id eines Kühlschrankes'),
})

grocery = api.inherit('Grocery', bo, {
    'grocery_name': fields.String(attribute='_grocery_name', description='Name eines Lebensmittels'),
    'fridge_id': fields.Integer(attribute='_fridge_id', description='Die Id eines Kühlschrankes')
})

household = api.inherit('Household', bo, {
    'household_name': fields.String(attribute='_household_name', description='Name des Haushalts'),
    'owner_id': fields.Integer(attribute='_owner_id', description='Die Id eines Users')
})

grocerystatement = api.inherit('GroceryStatement', bo, {
    'grocery_id': fields.Integer(attribute='_grocery_id', description='ID eines Lebensmittels'),
    'unit_id': fields.Integer(attribute='_unit_id', description='ID Maßeinheit eines Lebensmittel'),
    'quantity': fields.Float(attribut='_quantity', description='Die Mengeneinheit eines Lebensmittel'),
})

measure = api.inherit('Measure', bo, {
    'unit': fields.String(attribute='_unit', description='Einheit eines Lebensmittels'),
    'fridge_id': fields.Integer(attribute='_fridge_id', description='Die Id eines Kühlschrankes')
})

# Inhabitant

@smartfridge.route('/inhabitant')
@smartfridge.response(500, 'Wenn es zu einem Server Fehler kommt.')
class InhabitantOperations(Resource):

 #   @secured
    def post(self):

        'Erstellen eines Inhabitant Objekts.'

        user_id = api.payload["user_id"]
        household_id = api.payload["household_id"]

        adm = Administration()
        return adm.create_inhabitant(user_id, household_id)


@smartfridge.route('/inhabitant/<int:user_id>/<int:household_id>')
@smartfridge.response(500, 'Wenn es zu einem Server Fehler kommt.')
class InhabitantDeleteOperations(Resource):
    def delete(self, user_id, household_id):
        'Löschen eines Inhabitants aus dem Household'

        adm = Administration()
        adm.delete_inhabitant(user_id, household_id)
        return "", 200

@smartfridge.route('/inhabitant/<int:household_id>')
@smartfridge.response(500,'Wenn es zu einem Server Fehler kommt.')
@smartfridge.param('household_id', 'household_id')
class InhabitantOperations(Resource):
    @smartfridge.marshal_list_with(user)
    #@secured
    def get(self, household_id):

        'Wiedergabe von Users durch Household ID'

        adm = Administration()
        return adm.get_users_by_household_id(household_id)


# Grocery_in_Fridge

@smartfridge.route('/grocery_in_fridge')
@smartfridge.response(500, 'Wenn es zu einem Server Fehler kommt.')
class GroceryInFridgeOperations(Resource):

 #   @secured
    def post(self):

        'Erstellen eines GroceryInFridge Objekts.'

        grocerystatement_id = api.payload["grocerystatement_id"]
        frdige_id = api.payload["fridge_id"]

        adm = Administration()
        return adm.create_grocery_in_frige(grocerystatement_id, frdige_id)

@smartfridge.route('/grocery_in_fridge/<int:grocerystatement_id>/<int:fridge_id>')
@smartfridge.response(500, 'Wenn es zu einem Server Fehler kommt.')
class GroceryInFridgeOperations(Resource):
    def delete(self, grocerystatement_id, fridge_id):


        adm = Administration()
        adm.delete_grocery_in_frige(grocerystatement_id, fridge_id)
        return "", 200

@smartfridge.route('/grocery_in_fridge/<int:fridge_id>')
@smartfridge.response(500,'Wenn es zu einem Server Fehler kommt.')
@smartfridge.param('fridge_id', 'fridge_id')
class GroceryInFridgeOperations(Resource):
    @smartfridge.marshal_list_with(grocerystatement)
    #@secured
    def get(self, fridge_id):

        'Wiedergabe von Grocerystatement durch Fridge ID'

        adm = Administration()
        return adm.get_grocerystatement_by_fridge(fridge_id)


"""
Grocery in Recipe
"""
@smartfridge.route('/grocery_in_recipe')
@smartfridge.response(500, 'Wenn es zu einem Server Fehler kommt.')
class GroceryInRecipeOperations(Resource):

 #   @secured
    def post(self):

        'Erstellen eines GroceryInRecipe Objekts.'

        grocerystatement_id = api.payload["grocerystatement_id"]
        recipe_id = api.payload["recipe_id"]

        adm = Administration()
        return adm.create_grocery_in_recipe(grocerystatement_id, recipe_id)

@smartfridge.route('/grocery_in_recipe/<int:grocerystatement_id>/<int:recipe_id>')
@smartfridge.response(500, 'Wenn es zu einem Server Fehler kommt.')
class GroceryInFridgeOperations(Resource):
    def delete(self, grocerystatement_id, recipe_id):
        'Löschen eines Inhabitants aus dem Household'

        adm = Administration()
        adm.delete_grocery_in_recipe(grocerystatement_id, recipe_id)
        return "", 200

@smartfridge.route('/grocery_in_recipe/<int:recipe_id>')
@smartfridge.response(500,'Wenn es zu einem Server Fehler kommt.')
@smartfridge.param('recipe_id', 'recipe_id')
class GroceryInFridgeOperations(Resource):
    @smartfridge.marshal_list_with(grocerystatement)
    #@secured
    def get(self, recipe_id):

        'Wiedergabe von Grocerystatement durch Recipe ID'

        adm = Administration()
        gsr = adm.get_grocery_in_recipe(recipe_id)
        return gsr


'''
User
'''
@smartfridge.route('/user')
@smartfridge.response(500, 'Falls es zu einem Server Fehler kommt.')
class UserListOperations(Resource):
    @smartfridge.marshal_list_with(user)
   # @secured
    def get(self):
        "Wiedergabe der User Objekts"
        adm = Administration()
        user_list = adm.get_all_users()
        if len(user_list) == 0:
            return {'message': 'Liste ist leer'}
        return user_list

    @smartfridge.marshal_with(user, code=200)

    @smartfridge.expect(user)
    # @secured
    def post(self):
        """Erstellen eines User Objekts"""

        adm = Administration()

        proposal = User.from_dict(api.payload)

        if proposal is not None:
            u = adm.create_user(
                proposal.get_firstname(),proposal.get_lastname(),proposal.get_nickname(),proposal.get_email(),proposal.get_google_user_id())
            return u, 200
        else:
            # Wenn irgendetwas schiefgeht, dann geben wir nichts zurück und werfen einen Server-Fehler.
            return '', 500

@smartfridge.route('/user/<int:id>')
@smartfridge.response(500, 'Falls es zu einem Server Fehler kommt.')
@smartfridge.param('id', 'Die ID des User-Objekts')
class UserOperations(Resource):
    @smartfridge.marshal_with(user)
   # @secured
    def get(self, id):
        "Wiedergabe eines User Objekts durch ID"
        adm = Administration()
        user = adm.get_user_by_id(id)
        return user

   # @secured
    def delete(self, id):
        "Löschen eines User Objekts"
        adm = Administration()
        user = adm.get_user_by_id(id)
        adm.delete_user(user)
        return '', 200

    @smartfridge.marshal_with(user)
    @smartfridge.expect(user, validate=True)
   # @secured
    def put(self, id):
        "Updaten eines User Objekts"
        adm = Administration()
        u = User.from_dict(api.payload)
        if u is not None:
            u.set_id(id)
            adm.update_user(u)
            return '', 200
        else:
            return '', 500

@smartfridge.route('/user/google_user_id/<string:google_user_id>')
@smartfridge.response(500, 'Falls es zu einem Server Fehler kommt.')
@smartfridge.param('google_user_id', 'Die Google ID des User-Objekts')
class GoogleOperations(Resource):
    @smartfridge.marshal_with(user)
    def get(self, google_user_id):
        "Wiedergabe eines User Objekts durch GoogleID"
        adm = Administration()
        user = adm.get_user_by_google_user_id(google_user_id)
        return user

# Muss hier eventuell noch eine route mit Haushalt ? Create_Household_for_User

'''
Household
'''

@smartfridge.route('/household')
@smartfridge.response(500, 'Falls es zu einem Server Fehler kommt.')
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
            hh = adm.create_household_and_fridge(
                proposal.get_household_name(),
                proposal.get_owner_id()
                )
            return hh, 200
        else:
            # Wenn irgendetwas schiefgeht, dann geben wir nichts zurück und werfen einen Server-Fehler.
            return '', 500
@smartfridge.route('/household/<int:id>')
@smartfridge.response(500, 'Falls es zu einem Server Fehler kommt.')
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
            return house, 200
        else:
            return '', 500


@smartfridge.route('/household/user/<int:user_id>')
@smartfridge.response(500, 'Wenn es zu einem Server Fehler kommt.')
class HouseholdOperations(Resource):
    def get(self, user_id):
        'Wiedergabe der Households von einem User'
        print(user_id)
        adm = Administration()
        households = adm.get_households_by_user(user_id)
        return api.marshal(households, household), 200


'''
grocery
'''

@smartfridge.route('/grocery')
@smartfridge.response(500, 'Falls es zu einem Server Fehler kommt.')
class GroceryListOperations(Resource):
    @smartfridge.marshal_list_with(grocery)
    #@secured
    def get(self):
        """Wiedergebe eines Grocery Objekts"""
        adm = Administration()
        grocery_list = adm.get_all_grocery()
        return grocery_list

    @smartfridge.marshal_with(grocery, code=200)

    @smartfridge.expect(grocery)
    #@secured
    def post(self):
        """Erstellen eines Grocery Objekts"""

        adm = Administration()

        proposal = Grocery.from_dict(api.payload)

        if proposal is not None:
            g = adm.create_grocery(
                proposal.get_grocery_name(), proposal.get_fridge_id())
            return g, 200
        else:
            # Wenn irgendetwas schiefgeht, dann geben wir nichts zurück und werfen einen Server-Fehler.
            return '', 500






@smartfridge.route('/grocery/<int:id>')
@smartfridge.response(500, 'Falls es zu einem Server Fehler kommt.')
@smartfridge.param('id', 'Die ID des Grocery-Objekts')
class GroceryOperations(Resource):
    @smartfridge.marshal_with(grocery)
    #@secured
    def get(self, id):
        """Wiedergabe eines Grocery Objekts durch ID"""
        adm = Administration()
        grocery = adm.get_grocery_by_id(id)
        return grocery

    #@secured
    def delete(self, id):
        """Löschen eines Grocery Objekts"""
        adm = Administration()
        try:
            grocery = adm.get_grocery_by_id(id)
            adm.delete_grocery(grocery)
        except Exception:
            # Rückgabe einer Fehlermeldung, wenn während des Löschens ein Fehler auftritt
            return "Lebensmittel wird im Kühlschrank/Rezept verwendet, erst dort löschen.", 400
        return '', 200

    @smartfridge.marshal_with(grocery)
    @smartfridge.expect(grocery, validate=True)
    #@secured
    def put(self, id):
        """Updaten eines Grocery Objekts"""
        adm = Administration()
        g = Grocery.from_dict(api.payload)
        if g is not None:
            g.set_id(id)
            adm.update_grocery(g)
            return '', 200
        else:
            return '', 500

@smartfridge.route('/grocery/grocery_name/<string:grocery_name>')
@smartfridge.response(500, 'Falls es zu einem Server Fehler kommt.')
@smartfridge.param('grocery_name', 'Der name des grocery-Objekts')
class GroceryNameOperations(Resource):
    @smartfridge.marshal_with(grocery)
    def get(self, grocery_name):
        adm = Administration()
        grocery = adm.get_grocery_by_name(grocery_name)
        return grocery


@smartfridge.route('/grocery/fridge_id/<int:fridge_id>')
@smartfridge.response(500,'Wenn es zu einem Server Fehler kommt.')
@smartfridge.param('fridge_id', 'fridge_id')
class GroceryInFridgeOperations(Resource):
    @smartfridge.marshal_list_with(grocery)
    #@secured
    def get(self, fridge_id):

        'Wiedergabe von Grocerys durch Fridge ID'

        adm = Administration()
        grocery = adm.get_grocery_by_fridge_id(fridge_id)
        return grocery



'''
recipe
'''

@smartfridge.route('/recipe/')
@smartfridge.response(500, 'Falls es zu einem Server Fehler kommt.')
class RecipeOperations(Resource):
    @smartfridge.marshal_list_with(recipe)
    def get(self):
        """
        Wiedergabe von Rezepten
        """
        adm = Administration()
        return adm.get_all_recipe()


    @smartfridge.marshal_with(recipe, code=200)
    @smartfridge.expect(recipe)
    # @secured
    def post(self):
        "Erstellen eines Recipe Objekts"
        adm = Administration()

        proposal = Recipe.from_dict(api.payload)

        if proposal is not None:
            rec = adm.create_recipe(
                proposal.get_recipe_name(), proposal.get_duration(), proposal.get_portion(), proposal.get_instruction(), proposal.get_fridge_id(), proposal.get_user_id())
            return rec, 200
        else:
            # Wenn irgendetwas schiefgeht, dann geben wir nichts zurück und werfen einen Server-Fehler.
            return '', 500

@smartfridge.route('/recipe/<int:id>')
@smartfridge.response(500, 'Falls es zu einem Server Fehler kommt.')
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
        """Updaten eines Recipe Objekts"""
        adm = Administration()
        r = Recipe.from_dict(api.payload)
        if r is not None:
            r.set_id(id)
            adm.update_recipe(r)
            return '', 200
        else:
            return '', 500

@smartfridge.route('/recipe/recipe_name/<string:recipe_name>')
@smartfridge.response(500, 'Falls es zu einem Server Fehler kommt.')
@smartfridge.param('recipe_name', 'Der Name des Recipe-Objekts')
class RecipeNameOperations(Resource):
    @smartfridge.marshal_with(recipe)
    def get(self, recipe_name):
        """Wiedergabe eines Recipe Objekts durch Name"""
        adm = Administration()
        recipe = adm.get_recipe_by_name(recipe_name)
        return recipe


@smartfridge.route('/recipe/fridge_id/<int:fridge_id>')
@smartfridge.response(500, 'Falls es zu einem Server Fehler kommt.')
@smartfridge.param('fridge_id', 'Die FridgeID des Recipe-Objekts')
class RecipeFridgeOperations(Resource):

    @smartfridge.marshal_with(recipe)
    def get(self,fridge_id):
        """Wiedergabe eines Recipe Objekts durch FridgeID"""
        adm = Administration()
        recipe = adm.get_recipe_by_fridge_id(fridge_id)
        return recipe

"""
fridge
"""

@smartfridge.route('/fridge/')
@smartfridge.response(500, 'Falls es zu einem Server Fehler kommt.')
class FridgeOperations(Resource):
    @smartfridge.marshal_list_with(fridge)
    @smartfridge.param('household_id', 'ID von dem Haushalt, in dem der Kühlschrank ist.')
    # @secured
    def get(self):
        """
        Wiedergabe von einerm bestimmten Fridge Objekt.
.
        """
        household_id = request.args.get('household_id')
        adm = Administration()
        return adm.get_frdige_by_household_id(household_id)

    @smartfridge.marshal_with(fridge, code=200)
    @smartfridge.expect(fridge)
    # @secured
    def post(self):
        "Erstellen eines Fridge Objekts"
        adm = Administration()

        proposal = Fridge.from_dict(api.payload)

        if proposal is not None:
            fri = adm.create_fridge(
                proposal.get_household_id())
            return fri, 200
        else:
            # Wenn irgendetwas schiefgeht, dann geben wir nichts zurück und werfen einen Server-Fehler.
            return '', 500




@smartfridge.route('/fridge/<int:id>')
@smartfridge.response(500, 'Falls es zu einem Server Fehler kommt.')
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
        "Löschen des Inhalts eines Fridge Objekts"

        adm = Administration()
        fri = adm.get_fridge_by_id(id)
        adm.delete_fridge(fri)
        return '',200

    @smartfridge.marshal_with(fridge)
    @smartfridge.expect(fridge, validate=True)
   # @secured
    def put(self,id):
        "Updaten eines Fridge Objekts"

        adm = Administration()
        fri = Fridge.from_dict(api.payload)

        if fri is not None:
            fri.set_id(id)
            adm.update_fridge(fri)
            return '',200
        else:
            return '',500

''''
@smartfridge.route('/household/<int:id>/fridge')
@smartfridge.response(500, 'Falls es zu einem Server Fehler kommt.')
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
''''''

'''
#Hier noch das gleiche mit Grocerystatement related to fridge
'''
@smartfridge.route('/grocerystatement/<int:id>/fridge')
@smartfridge.response(500, 'Falls es zu einem Server Fehler kommt.')
@smartfridge.param('id', 'Die ID des Household-Objekts')
class GrocerystatementRelatedFridgeOperations(Resource):
    @smartfridge.marshal_with(fridge)
    @secured
    def get(self,id):
        adm = Administration()
        gst = adm.get_grocerystatement_by_id(id)

        if gst is not None:

            fridge_list = adm.get_grocerystatement_by_fridge(gst)
            return fridge_list
        else:
            return " Grocery not found", 500

    @smartfridge.marshal_with(fridge, code=201)
    @secured
    def post(self,id):
        adm = Administration()

        gst = adm.get_grocerystatement_by_id(id)

        if gst is not None:
            result = adm.create_grocerystatement_for_fridge(gst) #methode muss implementiert werden
            return result
        else:
            return "Grocery unkown", 500
'''
"""
grocerystatement
"""
@smartfridge.route('/grocerystatement')
@smartfridge.response(500,'Falls es zu einem Server Fehler kommt.')
class GrocerystatementListOperations(Resource):
    @smartfridge.marshal_list_with(grocerystatement)
    # @secured
    def get(self):
        "Wiedergabe der Grocerystatement Objekte"
        adm = Administration()
        grocerystatement_list = adm.get_all_grocerystatements()
        if len(grocerystatement_list) == 0:
            return {'message': 'Liste ist leer'}
        return grocerystatement_list
    @smartfridge.marshal_with(grocerystatement, code=200)
    @smartfridge.expect(grocerystatement)
    # @secured
    def post(self):
        "Erstellen eines Grocerystatement Objekts"
        adm = Administration()

        proposal = GroceryStatement.from_dict(api.payload)
        if proposal is not None:
            gs = adm.create_grocerystatement(
                proposal.get_grocery_id(), proposal.get_unit_id(),proposal.get_quantity())
            return gs, 200
        else:
            # Wenn irgendetwas schiefgeht, dann geben wir nichts zurück und werfen einen Server-Fehler.
            return '', 500

@smartfridge.route('/grocerystatement/<int:id>')
@smartfridge.response(500, 'Falls es zu einem Server Fehler kommt.')
@smartfridge.param('id', 'Die ID des Grocerystatement-Objekts')
class FridgeOperations(Resource):
    @smartfridge.marshal_list_with(grocerystatement)
   # @secured
    def get(self,id):
        "Wiedergabe eines Groceriesstatement Objekts durch ID"

        adm = Administration()
        gst = adm.get_grocerystatement_by_id(id)
        return gst

   # @secured
    def delete(self,id):
        "Löschen eines Groceriesstatement Objekts"

        adm = Administration()
        gst = adm.get_grocerystatement_by_id(id)
        adm.delete_grocerystatement(gst)
        return '',200

    @smartfridge.marshal_with(grocerystatement)
    @smartfridge.expect(grocerystatement, validate=True)
    #@secured
    def put(self, id):
        """Updaten eines Groceiresstatement Objekts"""
        adm = Administration()
        gst = GroceryStatement.from_dict(api.payload)
        if gst is not None:
            gst.set_id(id)
            adm.update_grocerystatement(gst)
            return '', 200
        else:
            return '', 500

'''
measure
'''

@smartfridge.route('/measure')
@smartfridge.response(500, 'Falls es zu einem Server Fehler kommt.')
class MeasureListOperations(Resource):
    @smartfridge.marshal_list_with(measure)
    #@secured
    def get(self):
        """Wiedergebe eines Measure Objekts"""
        adm = Administration()
        measure_list = adm.get_all_measures()
        return measure_list

    @smartfridge.marshal_with(measure, code=200)

    @smartfridge.expect(measure)
    #@secured
    def post(self):
        """Erstellen eines Measure Objekts"""

        adm = Administration()

        proposal = Measure.from_dict(api.payload)

        if proposal is not None:
            m = adm.create_measure(
                proposal.get_unit(), proposal.get_fridge_id())
            return m, 200
        else:
            # Wenn irgendetwas schiefgeht, dann geben wir nichts zurück und werfen einen Server-Fehler.
            return '', 500

@smartfridge.route('/measure/unit/<string:unit>')
@smartfridge.response(500, 'Falls es zu einem Server Fehler kommt.')
@smartfridge.param('unit', 'Die Unit des Measure-Objekts')
class MeasureNameOperations(Resource):
    @smartfridge.marshal_with(measure)
    def get(self, unit):
        """Wiedergabe des Measure durch Unit"""
        adm = Administration()
        unit = adm.get_measure_by_unit(unit)
        return unit






@smartfridge.route('/measure/<int:id>')
@smartfridge.response(500, 'Falls es zu einem Server Fehler kommt.')
@smartfridge.param('id', 'Die ID des Grocery-Objekts')
class MeasureOperations(Resource):
    @smartfridge.marshal_with(measure)
    #@secured
    def get(self, id):
        """Wiedergabe eines Grocery Objekts durch ID"""
        adm = Administration()
        measure = adm.get_measure_by_id(id)
        return measure

    #@secured
    def delete(self, id):
        """Löschen eines Measure Objekts"""
        adm = Administration()
        measure = adm.get_measure_by_id(id)
        adm.delete_measure(measure)
        return '', 200

    @smartfridge.marshal_with(measure)
    @smartfridge.expect(measure, validate=True)
    #@secured
    def put(self, id):
        """Updaten eines Measure Objekts"""
        adm = Administration()
        m = Measure.from_dict(api.payload)
        if m is not None:
            m.set_id(id)
            adm.update_measure(m)
            return '', 200
        else:
            return '', 500



@smartfridge.route('/measure/fridge_id/<int:fridge_id>')
@smartfridge.response(500,'Wenn es zu einem Server Fehler kommt.')
@smartfridge.param('fridge_id', 'fridge_id')
class GroceryInFridgeOperations(Resource):
    @smartfridge.marshal_list_with(measure)
    #@secured
    def get(self, fridge_id):

        'Wiedergabe von Grocerys durch Fridge ID'

        adm = Administration()
        measure = adm.get_measure_by_fridge_id(fridge_id)
        return measure

"""
@smartfridge.route('/convert')
@smartfridge.response(500, 'Falls es zu einem Server Fehler kommt.')
class UnitConversion(Resource):
    @smartfridge.expect(api.model('Conversion', {
        'value': fields.Float(required=True, description='Der Wert, der konvertiert werden soll'),
        'unit_from': fields.String(required=True, description='Die Ausgangseinheit'),
        'unit_to': fields.String(required=True, description='Die Zieleinheit')
    }))
    def post(self):
        "Konvertiert Einheiten"
        data = request.json
        value = data['value']
        unit_from = data['unit_from']
        unit_to = data['unit_to']

        adm = Administration()
        result = adm.convert_unit(value, unit_from, unit_to)

        if isinstance(result, str):
            return {'message': result}, 400
        return {'Konvertierter Wert': result}, 200
"""


@smartfridge.route('/recipe/<int:recipe_id>/<int:fridge_id>')
@smartfridge.response(500, 'Wenn es zu einem Server Fehler kommt.')
class CalculateRecipeFridge(Resource):
    def post(self, recipe_id, fridge_id):
        """ Rezepte Kochen"""
        # Instanz der Administrationsklasse erstellen
        adm = Administration()

        # Methode calculate_recipe_fridge aufrufen
        result = adm.cook_recipe(recipe_id, fridge_id)

        # Rückgabe des Ergebnisses
        return result, 200

@smartfridge.route('/fridge/<int:fridge_id>/recipes')
@smartfridge.response(500, 'Server Error')
@smartfridge.param('fridge_id', 'The ID of the Fridge')
class CheckRecipesContents(Resource):
    def get(self, fridge_id):
        """
        Retrieve recipes that can be made with the contents of the fridge within the specified household.
        It also lists ingredients that are missing to complete each recipe.
        """
        adm = Administration()
        try:
            results = adm.check_recipes(fridge_id)
            if not results:
                return {'message': 'No recipes could be fully or partially made with the current fridge contents.'}, 404
            return results, 200
        except Exception as e:
            return {'error': str(e)}, 500



if __name__ == '__main__':
    app.run(debug=True)

