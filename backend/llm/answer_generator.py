from openai import OpenAI
from config import OPENAI_API_KEY, OPENAI_MODEL
from llm.prompt import build_prompt

client = OpenAI(api_key=OPENAI_API_KEY)

def generate_answer(question, rag_context, kg_context):
    prompt = build_prompt(question, rag_context, kg_context)

    response = client.chat.completions.create(
        model=OPENAI_MODEL,
        messages=[{"role": "user", "content": prompt}],
        temperature=0.2
    )

    return response.choices[0].message.content
