from langchain_community.vectorstores import FAISS
from langchain_openai import OpenAIEmbeddings
from config import OPENAI_API_KEY, EMBEDDING_MODEL


def build_vector_store(chunks):
    embeddings = OpenAIEmbeddings(
        openai_api_key=OPENAI_API_KEY,
        model=EMBEDDING_MODEL
    )
    return FAISS.from_texts(chunks, embeddings)
