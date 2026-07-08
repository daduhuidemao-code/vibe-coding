import hashlib


def generate_hash(text: str) -> str:
    return hashlib.md5(text.encode()).hexdigest()