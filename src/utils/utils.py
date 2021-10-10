import os
from json import loads

def getEnv(key):
    try:
        path = os.path.abspath('env.json')
        arq = open(path,'r')
        j = loads(arq.read())
        return str(j[key])
    except:
        try:
            return os.environ[key]
        except:
            raise Exception(f'Environment variable {key} not found')
