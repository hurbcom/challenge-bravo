import random
import string


def randomic_letters_uppercase(length):
    letters = string.ascii_uppercase
    return ''.join(random.choice(letters) for i in range(length))


def random_float_number():
    return random.uniform(1, 100)