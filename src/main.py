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

#Hier kommt noch import secured

app = Flask(__name__)

CORS(app, resources=r'/Smartfridge/*')

api = Api(app, version='1.0', title='Smartfridge API',
          description='Eine rudimentäre Demo-API für einen Smartfridge.')

smartfridge = api.namespaces('Smartfridge',description='Funktion einer Smartfridge')

bo = api.model('BusinessObject', {
    'id': fields.Integer(attribute='_id', description='Der Unique Identifier eines Business Object'), #unique identifier = etwas eindeutiges?
})

user = api.inherit('User', bo, {
    'firstname': fields.String(attribute='_firstname', description='Vorname eines Benutzers'),
    'lastname': fields.String(attribute='_lasttname', description='Nachname eines Benutzers'),
    'nickname': fields.String(attribute='_nickname', description='Nickname eines Benutzers'),
    'email': fields.String(attribute='_email', description='E-Mail-Adresse eines Benutzers'),
    'user_id': fields.String(attribute='_user_id', description='Google User ID eines Benutzers')})

fridge = api.inherit('Fridge', bo, {
    'fridge_name': fields.String(attribute='_fridge_name', description='Name eines Kühlschranks'),
    'household': fields.Integer(attribute='_household', description='Haushalt Id in welchem der Kühlschrank ist.'),  # so richitg weil Fremdschlüssel?
})


recipe = api.inherit('Recipe', bo, {
    'recipename': fields.String(attribute='_recipename', description='Name eines Rezepts'),
    'portions': fields.Integer(attribute='_portions', description='Portionen eines Rezepts'),
    'instructions': fields.String(attribute='_instrctions', description='Anleitung eines Rezepts'),
    'duration': fields.String(attribute='_duration', description='Dauer eines Rezepts'),
})

groceries = api.inherit('Groceries', bo, {
    'groceries_name': fields.String(attribute='_groceries_name', description='Name eines Lebensmittels'),
})