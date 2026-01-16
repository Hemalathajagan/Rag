from config import CHUNK_SIZE, CHUNK_OVERLAP, MAX_CHUNKS


def chunk_text(text: str) -> list:
    """
    Split text into overlapping chunks.

    Uses CHUNK_SIZE and CHUNK_OVERLAP from config.

    Args:
        text: The text to split into chunks

    Returns:
        list: List of text chunks
    """
    if not text or not text.strip():
        return []

    # Clean the text
    text = text.strip()

    # If text is smaller than chunk size, return as single chunk
    if len(text) <= CHUNK_SIZE:
        return [text]

    chunks = []
    start = 0

    while start < len(text):
        # Calculate end position
        end = start + CHUNK_SIZE

        # If this isn't the last chunk, try to break at a sentence or word boundary
        if end < len(text):
            # Look for sentence boundary (. ! ?) within the last 100 characters
            chunk_text_segment = text[start:end]
            last_period = max(
                chunk_text_segment.rfind(". "),
                chunk_text_segment.rfind("! "),
                chunk_text_segment.rfind("? "),
                chunk_text_segment.rfind(".\n"),
            )

            if last_period > CHUNK_SIZE // 2:
                # Found a good sentence boundary
                end = start + last_period + 1
            else:
                # Fall back to word boundary
                last_space = chunk_text_segment.rfind(" ")
                if last_space > CHUNK_SIZE // 2:
                    end = start + last_space

        # Extract the chunk
        chunk = text[start:end].strip()
        if chunk:
            chunks.append(chunk)

        # Move start position, accounting for overlap
        start = end - CHUNK_OVERLAP

        # Prevent infinite loop
        if start >= len(text) or end >= len(text):
            break

        # Limit number of chunks to prevent timeout
        if len(chunks) >= MAX_CHUNKS:
            break

    return chunks
