from flask import Flask, request, jsonify
from flask_cors import CORS
from config import OPENAI_MODEL
from ingestion.file_loader import save_file
from ingestion.text_extractor import extract_text
from ingestion.chunker import chunk_text
from embeddings.vector_store import build_vector_store
from utils.entity_extractor import extract_entities
from rag.hybrid_retriever import hybrid_retrieve
from llm.answer_generator import generate_answer

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
vectorstore = None


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
        path = save_file(file)
        text = extract_text(path)
        chunks = chunk_text(text)
        vectorstore = build_vector_store(chunks)
        return jsonify({"status": "Document processed successfully"})
    except Exception as e:
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
        entities = extract_entities(query)
        rag_context, kg_context = hybrid_retrieve(query, vectorstore, entities)
        answer = generate_answer(query, rag_context, kg_context)

        return jsonify({
            "answer": answer,
            "model_used": OPENAI_MODEL,
            "confidence": "High"
        })
    except Exception as e:
        return jsonify({"error": f"Failed to generate answer: {str(e)}"}), 500


if __name__ == "__main__":
    app.run(debug=True)
