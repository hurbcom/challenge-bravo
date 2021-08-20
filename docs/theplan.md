# The plan
> Timespan: from 18/08 to 27/08 @ 23:59 (10 days)
> - 2 days (18, 19): Documentation, requirements, technical decisions, POCs;
> - 6 days (20 to 25): Development;
> - 2 days (26, 27): Final testing, review and delivery  
> ##### *MVP should be reached by the end of 25/08 by completing all mandatory requirements
> ##### **Due to the volatility of software development, the plan may be updated even after days 18 and 19
> ##### ***If MVP is reached way before deadline, try to implement as many bonuses as possible
---
## Observed requirements
### Mandatory:
1. API must respond using in JSON format;
2. USD must be the base currency for conversions;
3. Must perform conversions using up-to-date and real rates;
4. Must have these five currencies working by default: USD, BRL, EUR, BTC and ETH;
5. Conversion API path must receive parameters that represent the following values: **original currency**, **target currency** and **value to convert**;
6. Must have an endpoint for performing CRUD operations on fictitious currencies (user defined);
7. Must support convertion between real and fictitious currencies;
8. Project must run on macOS or Ubuntu;
9. Project must be executed by means of up to 4 commands: clone -> change into project directory -> dependency installation -> launch;
10. API must pass a stress test of 1000 requests per second;
11. API must use real convertion rates provided by other public convertion rate APIs;
### Optional:
1. API runs using Docker;
--- 
## Technical specs
Predominant language: Python  

Production libs:
- Bottle or Sanic;  
- sqlite3;
- redis;

Development libs:  
- locust (relates #10);
- coverage;
- unittest;

Persistance:
- SQLite (development - relates #06, #07);
- Redis (? - relates #10);

Others:
- GNU Make (relates #09);
- Docker (relates optional #01);
- Public API: https://openexchangerates.org (relates #02, #03, #04, #11);
- Insomnia;
---
## Bonuses/nice-to-haves
- Simple frontend to showcase the whole thing, from client to backend to database;
- Simple auth system for extra API security;
- 100% code coverage;
- Get Travis working for the CI! :rocket: ;
- Get it integrated with Heroku for the CD! :speedboat: ;  
<p align="center">
  <img src="https://i.giphy.com/media/W5WwFpEtd5Tvq/giphy.webp" alt="lets get rambling" />
</p>