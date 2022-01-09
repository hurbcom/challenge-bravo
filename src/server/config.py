class Config():
    DATABASE_PATH = "sqlite:///../infra/currencies.db?check_same_thread=False"

    #CURRENCY SERVER PARAMETERS
    INITIAL_COINS = ["USD","BRL","EUR","BTC","ETH"]
    MAIN_CURRENCY = "USD"

    #UPDATER CURRENCIES PARAMETERS
    UPDATE_TASK_TIMER = 60

    #CACHE PARAMETERS
    CACHE_SIZE = 5
    CACHE_TASK_TIMER = 5