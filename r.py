import requests
from bs4 import BeautifulSoup
import re
from google_currency import convert

page = requests.get('https://www.google.com/search?q=2+brl+usd')
soup = BeautifulSoup(page.text, 'lxml')
# results = soup.findAll("div", {"data-exchange-rate" : True})
# results = soup.findAll("div", {"data-exchange-rate" : re.compile(r".*")})

results = soup.findAll("div")

print(convert('USD', 'BRL', 1)  )

# # part1 = soup.find(class_="ccOutputTrail").previous_sibling
# # part2 = soup.find(class_="ccOutputTrail").get_text(strip=True)
# # rate = "{}{}".format(part1,part2)

# # def gbp_to_usd(rate,gbp):
# #     dollars=gbp*rate
# #     return dollars

# # gbp = input("Enter GBP amount: ")
# # finalamt = gbp_to_usd(float(rate),float(gbp))
# # print(str(gbp)+" GBP is equvalent to "+"$"+str(finalamt)+" USD")


# # # data-exchange-rate

# from urllib.parse import urlencode, urlparse, parse_qs

# from lxml.html import fromstring
# from requests import get

# raw = get("https://www.google.com/search?q=StackOverflow").text
# page = fromstring(raw)

# for result in page.tagselect("div"):
#     print(result)

# # for result in page.cssselect(".r a"):
# #     url = result.get("href")
# #     if url.startswith("/url?"):
# #         url = parse_qs(urlparse(url).query)['q']
# #     print(url[0])