from sqlalchemy.orm import Query
from werkzeug.exceptions import NotFound


def filter_by_or_404(query: Query, criteria, description):
    register = query.filter_by(**criteria).first()
    if not register:
        raise NotFound(description)

    return register
