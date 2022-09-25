# Bravo Challenge
## An API to currency conversion

Descprition in challenge bravo repository [link](https://github.com/hurbcom/challenge-bravo)

### Sumary

1. Tecnologies
2. Architecture Used
3. How to Use on Your Machine
    - Cloning
    - Runing
4. Tests
    - Unit / Integeration
    - Stress
5. API Routes
6. Improvements

### **1. Tecnologies**
1. PHP 8
2. Laravel 9
3. Composer
4. Redis
5. Docker

### **2. Architecture Used**
The architecture is based on Clean Architecture, but with some changes!

1. The first to point is on the Interface Layer and Frameworks and Drives:
This layer was merged into one, because the project is small plus apply YAGNI.

2. The second to point is the Enterprise Bussines Rules and Application Business Rules kept same.

In the image bellow, taken by Guilherme Biff Zarelli post [link](https://medium.com/luizalabs/descomplicando-a-clean-architecture-cf4dfc4a1ac6), shows how the architecture is:
<br>
<img src="https://miro.medium.com/max/720/0*J8pxLe88qYFN7wUf.png" width="70%">

And in the folder structure, using laravel default, has been added some more to attendant the architecture:
```
.
├── app                     # Already exists as default
│   ├── Domain              # Created to encapsulate challenge rules
│       ├── Entity          # Entity representations
│       ├── UseCases        # use cases representation
│   ├── Console             # Already exists as default and where crontab script is defined.
│   ├── Adpaters            # implementation repositories from domain and consume API
│       ├── Apis
│       ├── Repository
│   └── Http                # Already exists as default
│       ├── Controllers     # Where the connection to REST be consumed plus use cases be implemented
│   └── ...                
├── ...
├── routes                  # Already exists as default to open API end points
└── ...
```

### **3. How to Use on Your Machine**

#### Cloning
- Install Docker locally [Docker site](https://docs.docker.com/desktop/).
- Clone this repository.

#### Runing
```
Notice: It's not needed to run command to install dependencies because there is a configuration to do it automatially.
```

- Run command `docker compose up` in root folder (where docker-compose.yaml file is).
- Use the routes describred in the API Routes Implementation.

### **4. Tests**
Soon

### **5. API Routes**

### Currencies

- POST /currency/create

    Create Currency

    **Body Params Explation**

    - indentificationName = string | size = 3 
    - isFictional = boolean
    - baseCurrencyForFictionalType = string | size = 3
    -  valueBasedOnRealCurrency = float

    **Exemple body**

    ```
    {
        "indentificationName": "FKE",
        "isFictional": true,
        "baseCurrencyForFictionalType": "BRL",
        "valueBasedOnRealCurrency": 0.50
    }
    ```

    **Responses**

    In Success
    ```
    {
        data: {
            status: "success",
            message: "Insertion with success"
        }
    }
    ```

    In Error

    `Notice: In Error responses, the message param can be error with database integrations, etc.`
    ```
    {
        data: {
            status: "error",
            message: "currency already exists"
        }
    }
    ```

- GET /currency/show

    Show Currencies

    **Body Params Explation**

    No Body params is needed.

    **Exemple body**

    No body exemple is needed.

    **Responses**

    In Success
    ```
    {
        data: {
            status: "success",
            message: [
                "FKE",
                "ABD",
                "TEF"
            ]
        }
    }
    ```

    In Error

    `Notice: In Error responses, the message param can be error with database integrations, etc. But status param will be always "error".`
    ```
    {
        data: {
            status: "error",
            message: "a error has occured while list the currencies"
        }
    }
    ```
- GET /currency/conversion

    Convert a currency

    **Body Params Explation**

    - currencyFrom = string | size = 3 
    - currencyTo = string | size = 3 
    - amount = float

    **Exemple body**

    ```
    {
        "currencyFrom": "BRL",
	    "currencyTo": "EUR",
	    "amount": 100.00
    }
    ```

     **Responses**

    In Success
    ```
    {
        "data": {
            "status": "success",
            "message": "conversion made with success",
            "valueConverted": 506.7704407836381
        }
    }
    ```

    In Error

    `Notice: In Error responses, the errorMessage param can be error with database integrations, etc.`
    ```
    {
        data: {
            status: "error",
            errorMessage: "invalid amount value"
        }
    }
    ```

- DELETE /currency/delete/{indenttificationName}

    Delete currency

    **Body Params Explation**

    No Body params is needed.

    **Query params**

    - indenttificationName = string | size = 3

    **Exemple body**

    No body exemple is needed.

    **Responses**

    In Success
    ```
    {
        "data": {
            "status": "success",
            "errorMessage": "currency deleted with success"
        }
    }
    ```

    In Error

    `Notice: In Error responses, the errorMessage param can be error with database integrations, etc.`

    ```
    {
        data: {
            status: "error",
            errorMessage: "not possible to delete given value"
        }
    }
    ```

### **6. Improvements**
Soon