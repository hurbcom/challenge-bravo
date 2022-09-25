# Bravo Challenge
## An API to currency conversion

[[English](README.md) | [Portuguese](README.pt.md)]

### Sumary

1. Documentation in External Apps
2. Tecnologies
3. Architecture Used
4. How to Use on Your Machine
    - Cloning
    - Runing
5. Automated Tests
6. API Routes
7. Improvements

### **1. Documentation in External Apps**
Down bellow is listed the documentations title, explation and link:

- API Routes Implementation: Documentantion using Swagger framework [link](soon).

### **2. Tecnologies**
1. PHP 8
2. Laravel 9
3. Composer
4. Redis
5. Docker

### **3. Architecture Used**
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

### **4. How to Use on Your Machine**

#### Cloning
- Install Docker locally [Docker site](https://docs.docker.com/desktop/).
- Clone this repository.

#### Runing
`Notice: It's not needed to run command to install dependencies because there is a configuration to do it automatially.`

- Run command `docker compose up` in root folder (where docker-compose.yaml file is).
- Use the routes describred in the API Routes Implementation.

### **5. API Routes**
Soon

### **6. Improvements**
Soon