from flask import Blueprint, jsonify


blueprint = Blueprint('moeda', __name__)


@blueprint.route("/healthcheck", methods=['GET'], strict_slashes=False)
def healthcheck():
    return jsonify({'status': 'online'})
