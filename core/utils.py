from django.http import HttpResponse, Http404
from rest_framework.renderers import JSONRenderer
from . import settings
import requests
import hashlib

def JSONResponse(conteudo, status):
	
	content = JSONRenderer().render(conteudo)
	response = HttpResponse(content, content_type='application/json', status=status)
	response['Etag'] = "W/\""+hashlib.md5(content).hexdigest()+ "\""
	
	return response    

def Normalize(request):    
    data = {
        "from" : request.GET.get('from').upper(),
        "to" : request.GET.get('to').upper(),
        "amount" : round(float(request.GET.get('amount').replace(",",".")), 2)
    }
    return data

def CryptoCompare(data):
    headers = {'authorization': 'Apikey %s' % (settings.API_KEY)}
    r = requests.get(settings.API_URL + "?fsym=%s&tsyms=%s" % (data['from'],data['to']), headers=headers)
    
    price = r.json()[data['to']]
    result = data['amount'] * price
    
    return {
        "price": price,
        "result" : round(result, 2)
    }

def CryptoCompareTest(data):
    if 'symbol' not in data:
        return False
    
    headers = {'authorization': 'Apikey %s' % (settings.API_KEY)}
    r = requests.get(settings.API_URL + "?fsym=USD&tsyms=%s" % (data['symbol']), headers=headers)
    if 'Response' in r.json():
        return False
    
    return True