class Config():
    DATABASE_PATH = "sqlite:///../infra/currencies.db"
    INITIAL_COINS = ["USD","BRL","EUR","BTC","ETH"]
    MAIN_CURRENCY = "USD"
    CELERY_BROKE_PATH = "redis://localhost:6379"
    CELERY_BACKEND_PATH = "rpc://"