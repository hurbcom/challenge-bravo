# drag-n_drop_beverage

## Steps to start this project:
### Go to the root folder: challange-bravo and perform the tasks below:
- `npm setup`: to setup initial project's configuration (If you don't have nvm installed follow this instructions: https://github.com/nvm-sh/nvm)
- run `npm run start`

or, if you want to run using docker container:

- npm run docker:build
- npm run docker:run

### Project's Layers:
- controllers: User to convert data in the most accessible format for it to be processed by the deeper layers.
- use-cases: It is the layer that contains the business logic to perform the actions
- entities: Layer that encapsulates the main entities of the system, e.g: users, customers, purchase, etc. 

### **What was contemplated** ?
- A server was setup to ingest the data to a front-end.
  - The back end was made having clean code architecture in mind. Read more about it: https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html
  - In short, it is an architecture to make components independent from each other. It is defined using layers for (entities, use-cases, controllers, web/frameworks/dbs)
  - The inner layer cannot have access to the outer one, encapsulating each reponsability in a single context. Also, dependencies are always Injected and not imported into the files making it more concise for testing purposes.
