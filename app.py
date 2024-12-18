import os
import openai
from dotenv import load_dotenv
from flask import Flask, request, jsonify
import sqlite3

load_dotenv()


app = Flask(__name__)


@app.route("/")
def hello_world():
    return "Hello, world!"

@app.route("/getfeed", methods=["GET"])
def genfeed():
    user_id = request.args.get("user_id")
    session_id = request.args.get("session_id")

    if not user_id or not session_id:
        return jsonify({"error": "Missing user_id or session_id"}), 400

    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM session WHERE user_id = ? AND id = ?", (user_id, session_id))
    session = cursor.fetchone()

    conn.close()

    if not session:
        return jsonify({"error": "Invalid user_id or session_id"}), 401
    
    openai.api_key = os.getenv("OPENAI_API_KEY")


@app.route("/news", methods=["GET"])
def news():
    pass


if __name__ == '__main__':
    app.run(port=3001)
