from os import environ

db_config = {
    "connections": {
        "default": {
            "engine": "tortoise.backends.asyncpg",
            "credentials": {
                "host": environ.get("DATABASE_HOST"),
                "port": "5432",
                "user": "hurb_trial",
                "password": "hurb_trial",
                "database": "currency_exchanger",
            },
        }
    },
    "apps": {
        "models": {
            "models": ["models"],
            # If no default_connection specified, defaults to 'default'
            "default_connection": "default",
        }
    },
}
