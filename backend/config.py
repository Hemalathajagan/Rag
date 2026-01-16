import os
from dotenv import load_dotenv

load_dotenv()

# OpenAI
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENAI_MODEL = os.getenv("OPENAI_MODEL")
EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL")

# Neo4j
NEO4J_URI = os.getenv("NEO4J_URI")
NEO4J_USER = os.getenv("NEO4J_USER")
NEO4J_PASSWORD = os.getenv("NEO4J_PASSWORD")

# Chunking - larger chunks = fewer API calls = faster processing
CHUNK_SIZE = 1000
CHUNK_OVERLAP = 100
MAX_CHUNKS = 20  # Limit chunks to prevent timeout