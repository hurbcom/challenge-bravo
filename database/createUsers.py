from database.sharedConnector import db
from models.user import User
from server import app

with api.app_context():
    db.create_all()

    print('Creating users...')

    db.create_all()
    admin = User(password='HurB@2021#', email='rafael.pereira@hurb.com', is_active=True)
    db.session.add(admin)
    db.session.commit()

    usr = User.query.filter_by(email='rafael.pereira@hurb.com').first()
    print(usr)