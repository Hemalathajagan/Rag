from neo4j import GraphDatabase
from config import NEO4J_URI, NEO4J_USER, NEO4J_PASSWORD


def hybrid_retrieve(query: str, vectorstore, entities: list) -> tuple:
    """
    Perform hybrid retrieval combining vector search and knowledge graph.

    Args:
        query: The user's question
        vectorstore: FAISS vectorstore containing document embeddings
        entities: List of entities extracted from the query

    Returns:
        tuple: (rag_context, kg_context)
            - rag_context: Text from similar documents
            - kg_context: Information from knowledge graph
    """
    # Get RAG context from vector store
    rag_context = retrieve_from_vectorstore(query, vectorstore)

    # Get KG context from Neo4j
    kg_context = retrieve_from_knowledge_graph(entities)

    return rag_context, kg_context


def retrieve_from_vectorstore(query: str, vectorstore, k: int = 4) -> str:
    """
    Retrieve similar documents from the vector store.

    Args:
        query: The search query
        vectorstore: FAISS vectorstore
        k: Number of documents to retrieve

    Returns:
        str: Combined text from similar documents
    """
    if vectorstore is None:
        return ""

    try:
        # Perform similarity search
        docs = vectorstore.similarity_search(query, k=k)

        # Combine document contents
        context_parts = []
        for i, doc in enumerate(docs, 1):
            context_parts.append(f"[Document {i}]\n{doc.page_content}")

        return "\n\n".join(context_parts)
    except Exception as e:
        print(f"Error retrieving from vector store: {e}")
        return ""


def retrieve_from_knowledge_graph(entities: list) -> str:
    """
    Retrieve related information from Neo4j knowledge graph.

    Args:
        entities: List of entity names to search for

    Returns:
        str: Information about entities and their relationships
    """
    if not entities:
        return ""

    try:
        driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))

        kg_results = []

        with driver.session() as session:
            for entity in entities:
                # Query for entity and its relationships
                result = session.run(
                    """
                    MATCH (n)-[r]-(m)
                    WHERE toLower(n.name) CONTAINS toLower($entity)
                       OR toLower(n.title) CONTAINS toLower($entity)
                       OR toLower(n.label) CONTAINS toLower($entity)
                    RETURN n, type(r) as relationship, m
                    LIMIT 10
                    """,
                    entity=entity.strip()
                )

                for record in result:
                    node_n = record["n"]
                    rel_type = record["relationship"]
                    node_m = record["m"]

                    # Extract node properties
                    n_name = node_n.get("name") or node_n.get("title") or str(dict(node_n))
                    m_name = node_m.get("name") or node_m.get("title") or str(dict(node_m))

                    kg_results.append(f"- {n_name} --[{rel_type}]--> {m_name}")

        driver.close()

        if kg_results:
            return "Knowledge Graph Relationships:\n" + "\n".join(kg_results)
        return ""

    except Exception as e:
        print(f"Error retrieving from knowledge graph: {e}")
        return ""
