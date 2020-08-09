from datetime import datetime
from pymongo import MongoClient
from bson import ObjectId
from configparser import ConfigParser

class Database(object):
    def __init__(self, filename = 'database.ini', section = 'mongo_dev'):
        parser = ConfigParser()
        parser.read(filename)

        params = parser.items(section)
    
        self.client = MongoClient(params[0][1])
        self.db = self.client[params[1][1]]


    def insert(self, element, collection_name):
        element["created_at"] = datetime.now()
        element["updated_at"] = datetime.now()
        inserted = self.db[collection_name].insert_one(element)
        return str(inserted.inserted_id)

    def find(self, criteria, collection_name, projection = None, sort = None, limit = 0, cursor = False):
        if "_id" in criteria:
            criteria["_id"] = ObjectId(criteria["_id"])

        found = self.db[collection_name].find(filter = criteria, projection = projection, limit = limit, sort = sort)

        if cursor:
            return found

        found = list(found)

        for i in range(len(found)): 
            if "_id" in found[i]:
                found[i]["_id"] = str(found[i]["_id"])

        return found

    def find_by_id(self, id, collection_name):
        found = self.db[collection_name].find_one({"_id": ObjectId(id)})
        
        if found is None:
            return found
        
        if "_id" in found:
             found["_id"] = str(found["_id"])

        return found

    
    def find_by_symbol(self, symbol, collection_name):
        found = self.db[collection_name].find_one({"symbol": symbol})
        
        if found is None:
            return found
        
        if "_id" in found:
             found["_id"] = str(found["_id"])

        return found


    def update(self, id, element, collection_name):
        criteria = {"_id": ObjectId(id)}

        element["updated_at"] = datetime.now()
        set_obj = {"$set": element}  # update value

        updated = self.db[collection_name].update_one(criteria, set_obj)
        if updated.matched_count == 1:
            return "Record on " + collection_name + " successfully updated"

    def delete(self, id, collection_name):
        deleted = self.db[collection_name].delete_one({"_id": ObjectId(id)})
        return bool(deleted.deleted_count)
    
    
    def delete_by_symbol(self, symbol, collection_name):
        deleted = self.db[collection_name].delete_one({"symbol": symbol})
        return bool(deleted.deleted_count)



