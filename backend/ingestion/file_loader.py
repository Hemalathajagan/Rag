import os
from werkzeug.utils import secure_filename

# Define uploads directory relative to backend folder
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads")


def save_file(file) -> str:
    """
    Save an uploaded file to the uploads directory.

    Args:
        file: Flask FileStorage object from request.files

    Returns:
        str: Absolute path to the saved file
    """
    # Create uploads directory if it doesn't exist
    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)

    # Secure the filename to prevent directory traversal attacks
    filename = secure_filename(file.filename)

    # Handle empty filename
    if not filename:
        raise ValueError("Invalid filename")

    # Create full path
    file_path = os.path.join(UPLOAD_FOLDER, filename)

    # Save the file
    file.save(file_path)

    return file_path
