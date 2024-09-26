# Bravo Challenge

## Summary

The application consists of:
- Postgres
- Redis
- Currency API
    - Manages all operations related to authentication and user and currency functionalities
- Jobs API
    - Shares the same authentication, and you must be logged in to use the features.
    - By default, the job that updates the values ​​of coins in the database and cache runs every 12 hours, if you want to run it immediately after starting the application, you can do this via the **Run Task** endpoint available in the swagger that is cited below.

## Docs
To use endpoints that require authentication, you must use the **Auth Sign In** endpoint to take the returned token and insert it into Swagger's global authorization.


After running the application, we have a swagger available at the addresses below:

**Currency API**
```http
 http://localhost:8080/v1/swagger/index.html
```

**Jobs API**
```http
 http://localhost:8081/v1/swagger/index.html
```


## Running
```bash
 git clone https://github.com/wesleyfebarretos/challenge-bravo.git
 cd challenge-bravo && make start-services
```

## Testing
In the project **cwd** execute the command below:

```bash
 make app-integration-test
```

If you want test logs in verbose mode to see test-containers setup and logs execute this one: 

```bash
 make app-integration-test-verbose
```
