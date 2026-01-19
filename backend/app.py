from flask import Flask, request, jsonify
from flask_cors import CORS
from config import OPENAI_MODEL
import traceback

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
vectorstore = None


@app.route("/", methods=["GET"])
def health():
    return jsonify({"status": "healthy", "message": "KG RAG Backend is running"})


@app.route("/upload", methods=["POST"])
def upload():
    global vectorstore

    # Validate request
    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No file selected"}), 400

    try:
        print(f"[1/5] Saving file: {file.filename}")
        from ingestion.file_loader import save_file
        path = save_file(file)

        print(f"[2/5] Extracting text from: {path}")
        from ingestion.text_extractor import extract_text
        text = extract_text(path)
        print(f"Extracted {len(text)} characters")

        print(f"[3/5] Chunking text...")
        from ingestion.chunker import chunk_text
        chunks = chunk_text(text)
        print(f"Created {len(chunks)} chunks")

        print(f"[4/5] Building vector store (this may take a moment)...")
        from embeddings.vector_store import build_vector_store
        vectorstore = build_vector_store(chunks)

        print(f"[5/5] Building Knowledge Graph...")
        from kg.graph_builder import build_knowledge_graph, clear_knowledge_graph
        clear_knowledge_graph()  # Clear old data for fresh upload
        kg_result = build_knowledge_graph(text)

        print("Document processed successfully!")
        return jsonify({
            "status": "Document processed successfully",
            "kg_nodes": kg_result.get("nodes_created", 0),
            "kg_relationships": kg_result.get("relationships_created", 0)
        })
    except Exception as e:
        print(f"ERROR: {str(e)}")
        print(traceback.format_exc())
        return jsonify({"error": f"Failed to process document: {str(e)}"}), 500


@app.route("/ask", methods=["POST"])
def ask():
    global vectorstore

    # Validate request
    if not request.json:
        return jsonify({"error": "Request body must be JSON"}), 400

    if "question" not in request.json:
        return jsonify({"error": "No question provided"}), 400

    if vectorstore is None:
        return jsonify({"error": "No document uploaded yet. Please upload a document first."}), 400

    query = request.json["question"]

    try:
        print(f"[1/3] Extracting entities from query...")
        from utils.entity_extractor import extract_entities
        entities = extract_entities(query)

        print(f"[2/3] Performing hybrid retrieval...")
        from rag.hybrid_retriever import hybrid_retrieve
        rag_context, kg_context = hybrid_retrieve(query, vectorstore, entities)

        print(f"[3/3] Generating answer...")
        from llm.answer_generator import generate_answer
        answer = generate_answer(query, rag_context, kg_context)

        print("Answer generated successfully!")
        return jsonify({
            "answer": answer,
            "model_used": OPENAI_MODEL,
            "confidence": "High"
        })
    except Exception as e:
        print(f"ERROR: {str(e)}")
        print(traceback.format_exc())
        return jsonify({"error": f"Failed to generate answer: {str(e)}"}), 500


if __name__ == "__main__":
    app.run(debug=True)
