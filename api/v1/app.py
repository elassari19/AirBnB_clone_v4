#!/usr/bin/python3
""" AirBnB v3 flask Api v1 entry point """
from os import getenv
from flask import Flask, jsonify
from flask_cors import CORS
from models import storage
from api.v1.views import app_views

app = Flask(__name__)

CORS(app, resources={r'/api/v1/*': {'origins': '0.0.0.0'}})

app.register_blueprint(app_views)
app.url_map.strict_slashes = False


@app.errorhandler(404)
def not_found(exception):
    """handles 400 global error handler fails"""
    response = {'error': 'Not found'}
    return jsonify(response), 404


@app.teardown_appcontext
def teardown(exception):
    """Cleanup operations"""
    storage.close()


if __name__ == "__main__":
    '''main app'''
    HOST = getenv('HBNB_API_HOST', '0.0.0.0')
    PORT = int(getenv('HBNB_API_PORT', 5000))
    app.run(host=HOST, port=PORT, threaded=True)
