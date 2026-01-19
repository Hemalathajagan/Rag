from openai import OpenAI
from neo4j import GraphDatabase
from config import OPENAI_API_KEY, OPENAI_MODEL, NEO4J_URI, NEO4J_USER, NEO4J_PASSWORD
import json
import re

client = OpenAI(api_key=OPENAI_API_KEY)


def extract_entities_and_relations(text: str) -> dict:
    """
    Use OpenAI to extract entities and relationships from text.

    Returns:
        dict with 'entities' and 'relationships'
    """
    prompt = f"""Analyze the following text and extract:
1. Entities (people, organizations, skills, technologies, locations, concepts)
2. Relationships between entities

Return ONLY valid JSON in this exact format:
{{
    "entities": [
        {{"name": "John Doe", "type": "PERSON"}},
        {{"name": "Python", "type": "SKILL"}},
        {{"name": "Google", "type": "ORGANIZATION"}}
    ],
    "relationships": [
        {{"from": "John Doe", "relation": "HAS_SKILL", "to": "Python"}},
        {{"from": "John Doe", "relation": "WORKS_AT", "to": "Google"}}
    ]
}}

Entity types: PERSON, ORGANIZATION, SKILL, TECHNOLOGY, LOCATION, EDUCATION, PROJECT, CONCEPT

Relationship types: HAS_SKILL, WORKS_AT, STUDIED_AT, KNOWS, USES, RELATED_TO, PART_OF, CREATED, MANAGES

Text to analyze:
{text[:3000]}

JSON:"""

    try:
        response = client.chat.completions.create(
            model=OPENAI_MODEL,
            messages=[{"role": "user", "content": prompt}],
            temperature=0
        )

        content = response.choices[0].message.content.strip()

        # Extract JSON from response (handle markdown code blocks)
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0]
        elif "```" in content:
            content = content.split("```")[1].split("```")[0]

        return json.loads(content)
    except Exception as e:
        print(f"Error extracting entities: {e}")
        return {"entities": [], "relationships": []}


def build_knowledge_graph(text: str) -> dict:
    """
    Extract entities and relationships from text and store in Neo4j.

    Args:
        text: Document text to process

    Returns:
        dict with counts of nodes and relationships created
    """
    print("[KG] Extracting entities and relationships...")
    data = extract_entities_and_relations(text)

    entities = data.get("entities", [])
    relationships = data.get("relationships", [])

    print(f"[KG] Found {len(entities)} entities and {len(relationships)} relationships")

    if not entities:
        return {"nodes_created": 0, "relationships_created": 0}

    try:
        driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))

        nodes_created = 0
        rels_created = 0

        with driver.session() as session:
            # Create entities as nodes
            for entity in entities:
                name = entity.get("name", "").strip()
                entity_type = entity.get("type", "CONCEPT").upper()

                if not name:
                    continue

                # Create node with label based on type
                query = f"""
                MERGE (n:{entity_type} {{name: $name}})
                ON CREATE SET n.created = timestamp()
                RETURN n
                """
                result = session.run(query, name=name)
                if result.single():
                    nodes_created += 1

            # Create relationships
            for rel in relationships:
                from_name = rel.get("from", "").strip()
                to_name = rel.get("to", "").strip()
                relation = rel.get("relation", "RELATED_TO").upper()

                if not from_name or not to_name:
                    continue

                # Create relationship between nodes
                query = f"""
                MATCH (a), (b)
                WHERE a.name = $from_name AND b.name = $to_name
                MERGE (a)-[r:{relation}]->(b)
                RETURN r
                """
                result = session.run(query, from_name=from_name, to_name=to_name)
                if result.single():
                    rels_created += 1

        driver.close()

        print(f"[KG] Created {nodes_created} nodes and {rels_created} relationships in Neo4j")
        return {"nodes_created": nodes_created, "relationships_created": rels_created}

    except Exception as e:
        print(f"[KG] Error building knowledge graph: {e}")
        return {"nodes_created": 0, "relationships_created": 0, "error": str(e)}


def clear_knowledge_graph():
    """Clear all nodes and relationships from Neo4j (for fresh uploads)."""
    try:
        driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))
        with driver.session() as session:
            session.run("MATCH (n) DETACH DELETE n")
        driver.close()
        print("[KG] Cleared existing knowledge graph")
    except Exception as e:
        print(f"[KG] Error clearing graph: {e}")
