#!/usr/bin/python3
""" AirBnB v3 flask Api v1 entry point """
from os import getenv
from flask import Flask, jsonify, make_response
from flask_cors import CORS
from models import storage
from api.v1.views import app_views
from flasgger import Swagger
from flasgger.utils import swag_from

app = Flask(__name__)
app.config['JSONIFY_PRETTYPRINT_REGULAR'] = True
cors = CORS(app, resources={r"/api/v1/*": {"origins": "*"}})

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



app.config['SWAGGER'] = {
    'title': 'AirBnB clone Restful API',
    'uiversion': 3
}
Swagger(app)


if __name__ == "__main__":
    '''main app'''
    HOST = getenv('HBNB_API_HOST', '0.0.0.0')
    PORT = int(getenv('HBNB_API_PORT', 5000))
    app.run(host=HOST, port=PORT, threaded=True)
