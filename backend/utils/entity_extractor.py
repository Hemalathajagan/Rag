from openai import OpenAI
from config import OPENAI_API_KEY, OPENAI_MODEL

client = OpenAI(api_key=OPENAI_API_KEY)

def extract_entities(text):
    prompt = f"""
    Extract only important entities (nouns) as a comma-separated list.
    Text:
    {text}
    """

    res = client.chat.completions.create(
        model=OPENAI_MODEL,
        messages=[{"role": "user", "content": prompt}],
        temperature=0
    )

    return [e.strip() for e in res.choices[0].message.content.split(",")]
