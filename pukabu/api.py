import base64
import time
import requests

from hashlib import md5
from flask import(
    Blueprint, request
)

bp = Blueprint('api', __name__, url_prefix='/api')

pikabu_api_endpoint = 'https://api.pikabu.ru/v1/'
api_key = "kmq4!2cPl)peZ"

@bp.route('/key')
def get_apikey():
    return api_key