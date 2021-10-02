import random
import string


def randomic_letters_uppercase(length: int) -> str:
    """
    This method do a randomic letter with uppercase. You can choise a quantity of letters to create it.

    :lenth: The lenght to create a quantity of letters.
    :return: It will return a STRING will all random letters.
    """
    letters = string.ascii_uppercase
    return ''.join(random.choice(letters) for i in range(length))


def random_float_number() -> float:
    """
    This method create a random float number.

    :return: it return a float.
    """
    return random.uniform(1, 100)
