import pymongo as pym

def build_connection_string(mongo_user, mongo_password, mongo_address, mongo_port):
    connectionString = 'mongodb://' + str(mongo_user) + ':' + str(mongo_password.replace('@','%40')) + '@' + str(mongo_address) + ':' + str(mongo_port)
    return connectionString


def create_client(connection_string):
    return pym.MongoClient(connection_string, connect=False)


def get_database(client, database_name):
    return client[str(database_name)]


def get_collection(db, collection_name):
    return db[str(collection_name)]


def open_mongo_connection(config): #type='read'
    db  = None
    col = None
    res = True
    try:
        #field = 'read_data' if type == 'read' else 'write_data'
        connection_string = build_connection_string(config['mongo_user'], config['mongo_password'], config['mongo_address'], config['mongo_port'])
        client            = create_client(connection_string)
        db                = get_database(client, config['mongo_database'])
        col               = get_collection(db, config['mongo_collection'])
    except:
        res = False
    return col, res
