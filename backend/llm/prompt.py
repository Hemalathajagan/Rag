def build_prompt(question: str, rag_context: str, kg_context: str) -> str:
    """
    Build a prompt for the LLM combining the question with retrieved context.

    Args:
        question: The user's question
        rag_context: Context from vector store (document chunks)
        kg_context: Context from knowledge graph (entity relationships)

    Returns:
        str: The formatted prompt for the LLM
    """
    prompt_parts = []

    # System instruction
    prompt_parts.append(
        "You are a helpful assistant that answers questions based on the provided context. "
        "Use the information from both the document context and knowledge graph to provide "
        "accurate and comprehensive answers. If the context doesn't contain enough information "
        "to answer the question, say so honestly."
    )

    prompt_parts.append("\n\n---\n")

    # Add RAG context if available
    if rag_context and rag_context.strip():
        prompt_parts.append("## Document Context\n")
        prompt_parts.append(rag_context)
        prompt_parts.append("\n\n")

    # Add KG context if available
    if kg_context and kg_context.strip():
        prompt_parts.append("## Knowledge Graph Context\n")
        prompt_parts.append(kg_context)
        prompt_parts.append("\n\n")

    # Add the question
    prompt_parts.append("---\n\n")
    prompt_parts.append(f"## Question\n{question}\n\n")
    prompt_parts.append("## Answer\n")

    return "".join(prompt_parts)
