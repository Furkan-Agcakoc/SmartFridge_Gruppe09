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

CORS(app,resources=r'/Smartfridge/*')

api = Api(app, version='1.0', title='Smartfridge API',
          description='Eine rudimentäre Demo-API für einen Smartfridge.')

smartfridge = api.namespaces('Smartfridge',description='Funktion einer Smartfridge')

bo = api.model('BusinessObject', {
    'id' : fields.Integer(attribut='_id', description='Eindeutige Zuordnung von BusinessObjects')
})

fridge = api.inherit('Fridge',bo, {
    'fridge_name' : fields.String(attribut='_fridge_name', description='Name eines Kühlschranks'),
    'household' : fields.Integer(attribut='_household', description='Eindeutige Zuordnung des Kühlschrankes zu einem Haushalt')
})

groceries = api.inherit('Groceries',bo, {
    'groceries_name' : fields.String(attribut='_groceries_name', description='Name eines Lebensmitells'),
})

groceriesstatement = api.inherit('Groceriesstatement',bo, {
    'groceries_name' : fields.String(attribut='_groceries_name', description='Name eines Lebensmitells'),
    'description' : fields.String(attribut='_description', description='Die Maßeinheit eines Lebensmittels'),
    'quantity' : fields.Integer(attribut='_quantity', description='Die Mengenangabe eines Lebensmittels')
})

household = api.inherit('Household',bo, {
    'household_name' : fields.String(attribut='_household_name', description='Name eines Haushaltes')
})

measure = api.inherit('Measure',bo, {
    'description' : fields.string(attribut='_description', description='Die Maßeinheit eines Lebensmittels')
})

quantity = api.inherit('Quantity',bo, {
    'quantity' : fields.string(attribut='_quantity', description='Die Mengenangabe eines Lebensmittels')
})

recipe = api.inherit('Recipe',bo, {
    'recipe_name' : fields.string(attribut='_recipe_name', description='Name des Rezepts'),
    'portions' : fields.string(attribut='_portions', description='Anzahl der Portionen'),
    'instruction' : fields.string(attribut='_instruction', description='Anweisung zum Rezept'),
    'duration' : fields.string(attribut='_duration', description='Dauer des Rezepts')
})

user = api.inherit('User',bo, {
    'first_name' : fields.String(attribut='__first_name', description='Vorname des Users'),
    'last_name' : fields.String(attribut='__last_name', description='Nachname des Users'),
    'nickname' : fields.String(attribut='__nickname', description='Nickname des Users'),
    'email' : fields.String(attribut='__email', description='Email des Users'),
    'user_id' : fields.Integer(attribut='__user_id', description='Google-ID des Users')
})
