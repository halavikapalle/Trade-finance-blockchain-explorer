import os
import cloudinary
import cloudinary.uploader
import tempfile

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET")
)

def upload_file(upload_file):

    with tempfile.NamedTemporaryFile(delete=False) as temp:

        temp.write(upload_file.file.read())

        temp.flush()

        result = cloudinary.uploader.upload(
            temp.name,
            resource_type="raw"
        )

    print(result)
    
    return result["secure_url"], result["public_id"]