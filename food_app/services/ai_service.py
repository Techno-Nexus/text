# Flask API for AI Recommendation Engine
from flask import Flask, jsonify, request

app = Flask(__name__)

@app.route('/recommend', methods=['POST'])
def recommend():
    data = request.get_json()
    budget = data.get('budget', 5000)
    if budget >= 4500:
        recommendation = "Fried Rice + Quarter Chicken (₦4,500)"
    else:
        recommendation = "Beef Jollof Rice (₦3,000)"
    return jsonify({"recommendation": recommendation})

if __name__ == '__main__':
    app.run(port=5001) 