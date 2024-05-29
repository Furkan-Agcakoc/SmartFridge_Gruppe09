# Unser Service basiert auf Flask
from flask import Flask, request
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
    'google_user_id': fields.String(attribute='_google_user_id', description='Google User ID eines Benutzers')
})

fridge = api.inherit('Fridge', bo, {
    'fridge_name': fields.String(attribute='_fridge_name', description='Name eines Kühlschranks'),
    'household_id': fields.Integer(attribute='_household_id', description='Haushalt Id in welchem der Kühlschrank ist.'),
})

recipe = api.inherit('Recipe', bo, {
    'recipe_name': fields.String(attribute='_recipe_name', description='Name eines Rezepts'),
    'portion': fields.Integer(attribute='_portion', description='Portion eines Rezepts'),
    'instruction': fields.String(attribute='_instruction', description='Anleitung eines Rezepts'),
    'duration': fields.String(attribute='_duration', description='Dauer eines Rezepts'),
    'user_id': fields.Integer(attribute='_user_id', description='Die Id eines Users'),
    'household_id': fields.Integer(attribute='_household_id', description='Die Id eines Haushalts'),
})

grocery = api.inherit('Grocery', bo, {
    'grocery_name': fields.String(attribute='_grocery_name', description='Name eines Lebensmittels')
})

household = api.inherit('Household', bo, {
    'household_name': fields.String(attribute='_household_name', description='Name des Haushalts')
})

grocerystatement = api.inherit('GroceryStatement', bo, {
    'grocery_name': fields.String(attribute='_grocery_name', description='Name eines Lebensmittels'),
    'description': fields.String(attribute='_description', description='Die Maßeinheit eines Lebensmittel'),
    'quantity': fields.Float(attribut='_quantity', description='Die Mengeneinheit eines Lebensmittel'),
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


'''
User
'''
@smartfridge.route('/user')
@smartfridge.response(500, 'Falls es zu einem Server Fehler kommt.')
class UserListOperations(Resource):
    @smartfridge.marshal_list_with(user)
   # @secured
    def get(self):
        "Wiedergabe der Household Objekts"
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
            hh = adm.create_household(proposal.get_household_name())
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
            return '', 200
        else:
            return '', 500

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
                proposal.get_grocery_name())
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
        grocery = adm.get_grocery_by_id(id)
        adm.delete_grocery(grocery)
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




'''
recipe
'''

@smartfridge.route('/recipe/')
@smartfridge.response(500, 'Falls es zu einem Server Fehler kommt.')
class RecipeOperations(Resource):
    @smartfridge.marshal_list_with(recipe)
    @smartfridge.param('user_id', 'ID des Users, der das Rezept erstellt hat')
    @smartfridge.param('household_id', 'ID des Haushalts, zu dem das Rezept gehört')
    def get(self):
        """
        Wiedergabe von Rezepten basierend auf User- und Haushalts-ID.
        """
        user_id = request.args.get('user_id')
        household_id = request.args.get('household_id')
        adm = Administration()
        return adm.get_recipe_by_user_id(user_id) and adm.get_recipe_by_household_id(household_id)


    @smartfridge.marshal_with(recipe, code=200)
    @smartfridge.expect(recipe)
    # @secured
    def post(self):
        "Erstellen eines Recipe Objekts"
        adm = Administration()

        proposal = Recipe.from_dict(api.payload)

        if proposal is not None:
            rec = adm.create_recipe(
                proposal.get_recipe_name(), proposal.get_duration(), proposal.get_portion(), proposal.get_instruction(), proposal.get_household_id(), proposal.get_user_id())
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
                proposal.get_fridge_name(), proposal.get_household_id())
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
        "Löschen eines Fridge Objekts"

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
        """Wiedergabe der Grocerystatement Objekte"""
        adm = Administration()
        grocerystatement_list = adm.get_all_grocerystatements()
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
                proposal.get_grocery_name(), proposal.get_description(), proposal.get_quantity()
            )
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




if __name__ == '__main__':
    app.run(debug=True)

#