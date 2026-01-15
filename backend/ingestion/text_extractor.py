import os
from pypdf import PdfReader
from docx import Document
from PIL import Image
import pytesseract


# Supported file extensions
PDF_EXTENSIONS = {".pdf"}
DOCX_EXTENSIONS = {".docx"}
TXT_EXTENSIONS = {".txt"}
IMAGE_EXTENSIONS = {".png", ".jpg", ".jpeg", ".tiff", ".bmp", ".gif"}


def extract_text(file_path: str) -> str:
    """
    Extract text from a file based on its extension.

    Args:
        file_path: Path to the file

    Returns:
        str: Extracted text content

    Raises:
        ValueError: If file type is not supported
    """
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"File not found: {file_path}")

    ext = os.path.splitext(file_path)[1].lower()

    if ext in PDF_EXTENSIONS:
        return extract_from_pdf(file_path)
    elif ext in DOCX_EXTENSIONS:
        return extract_from_docx(file_path)
    elif ext in TXT_EXTENSIONS:
        return extract_from_txt(file_path)
    elif ext in IMAGE_EXTENSIONS:
        return extract_from_image(file_path)
    else:
        raise ValueError(f"Unsupported file type: {ext}")


def extract_from_pdf(file_path: str) -> str:
    """Extract text from a PDF file."""
    reader = PdfReader(file_path)
    text_parts = []

    for page in reader.pages:
        page_text = page.extract_text()
        if page_text:
            text_parts.append(page_text)

    return "\n\n".join(text_parts)


def extract_from_docx(file_path: str) -> str:
    """Extract text from a DOCX file."""
    doc = Document(file_path)
    text_parts = []

    for paragraph in doc.paragraphs:
        if paragraph.text.strip():
            text_parts.append(paragraph.text)

    return "\n\n".join(text_parts)


def extract_from_txt(file_path: str) -> str:
    """Extract text from a TXT file."""
    with open(file_path, "r", encoding="utf-8") as f:
        return f.read()


def extract_from_image(file_path: str) -> str:
    """Extract text from an image using OCR (Tesseract)."""
    image = Image.open(file_path)
    text = pytesseract.image_to_string(image)
    return text.strip()
