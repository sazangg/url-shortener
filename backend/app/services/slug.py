import random
import string

alphabet = string.ascii_letters + string.digits


def generate_random_slug() -> str:
    """
    Generates a random 6-character base-62 slug.
    """
    return "".join(random.choices(alphabet, k=6))
