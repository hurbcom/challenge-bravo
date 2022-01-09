class Config():
    DATABASE_PATH = "sqlite:///../infra/currencies.db"
    INITIAL_COINS = ["USD","BRL","EUR","BTC","ETH"]
    MAIN_CURRENCY = "USD"
    UPDATE_TASK_TIMER = 60