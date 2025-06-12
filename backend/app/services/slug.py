import random
import string

alphabet = string.ascii_letters + string.digits


def generate_random_slug() -> str:
    return "".join(random.choices(alphabet, k=6))
