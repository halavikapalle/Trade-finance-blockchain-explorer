import hashlib


def generate_hash(data: str):

    encoded_data = data.encode()

    hash_object = hashlib.sha256(
        encoded_data
    )

    return hash_object.hexdigest()
def generate_file_hash(file_path: str):

    sha256 = hashlib.sha256()

    with open(file_path, "rb") as file:

        while True:

            chunk = file.read(4096)

            if not chunk:
                break

            sha256.update(chunk)

    return sha256.hexdigest()