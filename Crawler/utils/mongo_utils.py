import pymongo as pym

def build_connection_string(mongo_user, mongo_password, mongo_address, mongo_port):
    connectionString = 'mongodb://' + str(mongo_user) + ':' + str(mongo_password) + '@' + str(mongo_address) + ':' + str(mongo_port)
    return connectionString


def create_client(host, port):
    return pym.MongoClient(host, port)


def get_database(client, database_name):
    return client[database_name]


def get_collection(db, collection_name):
    return db[str(collection_name)]


def open_mongo_connection(config): #type='read'
    res = True
    try:
        client = create_client(config['mongo_address'], int(config['mongo_port']))
        db     = get_database(client, config['mongo_database'])
        db.authenticate(config['mongo_user'], config['mongo_password'])
        col    = get_collection(db, config['mongo_collection'])
    except Exception as ex:
        res = False
    return col, res
