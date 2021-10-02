from bs4 import BeautifulSoup
from urllib.request import urlopen, Request


def parsing_html(url: str) -> object:
    url = url
    headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:90.0) Gecko/20100101 Firefox/90.0'}
    req = Request(url=url, headers=headers)
    response = urlopen(url=req)
    html = response.read()
    soup = BeautifulSoup(html, "html.parser")
    return soup