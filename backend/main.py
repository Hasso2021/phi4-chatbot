from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
from pymongo import MongoClient  
import os


app = Flask(__name__)
CORS(app)
client = OpenAI(base_url="http://localhost:1234/v1", api_key="lm-studio")
# connection to the backend database
mongo_uri = os.getenv("MONGODB_URI")
mongo_client = MongoClient(mongo_uri)
db = mongo_client["phi4_chatbot"]
conversations = db["conversations"]
@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    instruction = data.get("instruction", "")
    question = data.get("question", "")
    completion = client.chat.completions.create(
        model="microsoft/phi-4-chatbot",
        messages=[
            {"role": "system", "content": instruction},
            {"role": "user", "content": question}
        ],
        temperature=0.9,
    )
    answer = completion.choices[0].message.content
    # Save the conversation to the database
    conversations.insert_one({
        "instruction": instruction,
        "question": question,
        "answer": answer
    })
    return jsonify({"answer": answer})

if __name__ == "__main__":
    app.run(port=5000)