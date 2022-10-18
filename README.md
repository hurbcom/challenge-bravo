# <img src="https://avatars1.githubusercontent.com/u/7063040?v=4&s=200.jpg" alt="Hurb" width="24" /> Bravo Challenge

[[Docs](README.md) | [Challenge](README.pt.md)]
## Description
Bravo challenge made using NodeJS, Express and MongoDB.

### My journey
First of all it was interesting deal with a "money api", to handle with imprecision of floating points i've used an amazining library called Big.js.
I decided to go with some DDD strategies to keep my domain cleanest as possible, perhaps i didn`t go all the way down avoiding acidental complexity.
I chosed mongo + prisma cause in this api we don't need relations at all, maybe my worst decision here, the chemistry between this two technologies is pretty awfull, because of limitations i've lost a bunch o time figuring out some configurations, btw all solved using Mongo Atlas cluster.
### Improvments
- Implement Errors filter
- Implement Logger
## Setting Up
I've left a .env file that keeps all information to run the app.

To run the application you can use Docker-compose:

- `docker-compose up --build`

At this point if you done everything correctly your server should be running on your
 
 `localhost:8080`.

## 🚀 Techs used
- TypeScript
- MongoDB Atlas 
- NodeJS
- Yarn
- Prisma
- Express
- Jest
- DDD strategies
- Docker & Docker-compose


# ![](https://cdn.discordapp.com/attachments/695442261877719050/836389514107682826/routes.png)Endpoints

**Create Currency**
----
  Create a currency in database using payload info.

* **URL**

  /currency/create

* **Method:**

  `POST`

* **Data Params**

  ```json
  {
    "code": "HURB",
    "unitCost": "2.5",
    "backingCurrency": "USD"
  }
  ```

* **Success Response:**

  * **Code:** 201 <br />
    **Content:**
    ```json
    {
	    "_code": "BENIN",
	    "_unitCost": "2.5",
	    "_backingCurrency": "USD"
    }
    ```

* **Error Response:**

  * **Code:** 400 BAD REQUEST <br />
    **Content:** `{ "message" : "Currency already exists" }`
----

**Delete Currency**
----
  Delete currency.

* **URL**

  /currency/delete?currencyCode=HURB

* **Method:**

  `DELETE`

*  **QUERY Params**

   **Required:**

   `currencyCode=[string]`


* **Success Response:**

  * **Code:** 200 <br />

* **Error Response:**

  * **Code:** 400 BAD REQUEST <br />
    **Content:** `{ "message": "Missing arguments" }`

----

**Convert Currency**
----
Convert currency amount.

* **URL**

  currency/convert?to=BENIN&from=HURB&amount=2.5

* **Method:**

  `GET`

*  **QUERY Params**

   **Required:**

   `to=[string]`

   `from=[string]`
   
   `amount=[string]`

* **Success Response:**

  * **Code:** 200 <br />
    **Content:**
    ```json
    {
        "value": "10"
    }
    ```

* **Error Response:**

  * **Code:** 400 BAD REQUEST <br />
    **Content:** `{ "message": "Missing arguments" }`

  OR

  * **Code:** 404 NOT FOUND <br />
    **Content:** `{ "message" : "Currency not found" }`

----