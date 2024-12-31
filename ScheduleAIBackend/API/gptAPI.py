from openai import OpenAI
import json 
def getGPTResponse(prompt):
    client = OpenAI(api_key = "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")
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
    )
    data = json.loads(response.model_dump_json())
    ans = data['choices'][0]['message']['content']
    return ans