import hashlib
import os

def generate_hash(data: str):

    encoded_data = data.encode()

    hash_object = hashlib.sha256(
        encoded_data
    )

    return hash_object.hexdigest()
def generate_file_hash(file_path: str):

    if not os.path.exists(file_path):
        raise FileNotFoundError(
            f"File not found: {file_path}"
        )

    sha256 = hashlib.sha256()

    with open(file_path, "rb") as file:

        while True:
            chunk = file.read(4096)

            if not chunk:
                break

            sha256.update(chunk)

    return sha256.hexdigest()