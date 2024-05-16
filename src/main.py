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
    'description' : fields.String(attribut='_description', description='Die Maßeinheit eines Lebensmittel'),
    'quantity' : fields.Integer(attribut='_quantity', description='Die Mengeneinheit eines Lebensmittel')
})

household = api.inherit('Household',bo, {
    'household_name' : fields.String(attribut='_household_name', description='Name eines Haushaltes')
})

