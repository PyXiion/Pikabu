import os

from flask import Flask

from . import app

def create_app(test_config=None):
    # create and configure app
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        SECRET_KEY='dev'
    )

    if test_config is None:
        app.config.from_pyfile('config.py', silent=True)
    else:
        app.config.from_mapping(test_config)

    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    # import blueprints
    from . import api, app as _app
    app.register_blueprint(_app.bp)
    app.register_blueprint(api.bp)
    
    return app