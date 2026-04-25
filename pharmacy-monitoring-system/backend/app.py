import os
from dotenv import load_dotenv
from openai import OpenAI
from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import joblib
from tensorflow.keras.models import load_model

app = Flask(__name__)
CORS(app)
load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

@app.route("/")
def home():
    return jsonify({"message": "Backend is running"})

try:
    model = load_model("model/lstm_autoencoder.keras")
    scaler = joblib.load("model/scaler.pkl")
    print("AI model loaded successfully")
except Exception as e:
    model = None
    scaler = None
    print("AI model not loaded:", e)

ANOMALY_THRESHOLD = 0.5
SEQUENCE_LENGTH = 30


@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()

    question = data.get("question", "")
    context = data.get("data", {})

    current = context.get("current", {})
    statuses = context.get("statuses", {})
    alerts = context.get("alerts", [])
    anomaly_result = context.get("anomaly")

    prompt = f"""
You are an AI assistant for a pharmacy medicine storage monitoring dashboard.

Your job:
- Answer questions using only the provided dashboard data.
- Explain temperature, humidity, light, and air quality conditions.
- Explain alerts and AI anomaly results.
- Give decision-support recommendations.
- Do not invent values.
- If data is missing, say it is unavailable.
- Keep the answer short and useful for a pharmacy manager.

Current sensor readings:
{current}

Sensor statuses:
{statuses}

Active alerts:
{alerts}

AI anomaly result:
{anomaly_result}

User question:
{question}
"""

    try:
        response = client.responses.create(
            model="gpt-4.1-mini",
            input=prompt
        )

        return jsonify({
            "answer": response.output_text
        })

    except Exception as e:
        print("LLM error:", str(e))

        # fallback so demo still works
        return jsonify({
            "answer": "The AI assistant is currently unavailable, but the dashboard is still monitoring sensor values, alerts, and anomaly status."
        })
    
    
# @app.route("/chat", methods=["POST"])
# def chat():
#     data = request.get_json()

#     question = data.get("question", "").lower()
#     context = data.get("data", {})

#     current = context.get("current", {})
#     statuses = context.get("statuses", {})
#     alerts = context.get("alerts", [])
#     anomaly_result = context.get("anomaly")

#     # --- BASIC RESPONSES ---
#     if "temperature" in question:
#         return jsonify({
#             "answer": f"Temperature is {current.get('temperature')}°C and status is {statuses.get('temperature')}."
#         })

#     if "humidity" in question:
#         return jsonify({
#             "answer": f"Humidity is {current.get('humidity')}% and status is {statuses.get('humidity')}."
#         })

#     if "light" in question:
#         return jsonify({
#             "answer": f"Light level is {current.get('light')} lux and status is {statuses.get('light')}."
#         })

#     if "air" in question:
#         return jsonify({
#             "answer": f"Air quality is {current.get('airQuality')} ppm and status is {statuses.get('airQuality')}."
#         })

#     # --- CRITICAL ANALYSIS ---
#     if "critical" in question or "problem" in question:
#         critical = [k for k, v in statuses.items() if v == "Critical"]

#         if not critical:
#             return jsonify({"answer": "No parameters are currently in critical condition."})

#         return jsonify({
#             "answer": f"Critical parameters: {', '.join(critical)}. Immediate attention required."
#         })

#     # --- ALERT SUMMARY ---
#     if "alert" in question or "issue" in question:
#         if not alerts:
#             return jsonify({"answer": "There are no active alerts. All conditions are safe."})

#         messages = [a["message"] for a in alerts]

#         return jsonify({
#             "answer": "Current alerts: " + " | ".join(messages)
#         })

#     # --- DECISION SUPPORT ---
#     if "what should i do" in question or "action" in question:
#         if not alerts:
#             return jsonify({
#                 "answer": "No action needed. All environmental conditions are within safe limits."
#             })

#         return jsonify({
#             "answer": "Recommended action: Check ventilation, adjust storage conditions, and inspect affected zones."
#         })

#     # --- AI ANOMALY RESPONSE ---
#     if "anomaly" in question or "ai" in question:
#         if anomaly_result and anomaly_result.get("anomaly"):
#             return jsonify({
#                 "answer": f"AI anomaly detection reports an abnormal environmental pattern. Anomaly score: {anomaly_result.get('score')}."
#             })

#         return jsonify({
#             "answer": "AI anomaly detection does not currently report abnormal behavior."
#         })

#     # --- DEFAULT ---
#     return jsonify({
#         "answer": "System is monitoring environmental conditions. Ask about temperature, alerts, or issues."
#     })


@app.route("/anomaly", methods=["POST"])
def anomaly():
    try:
        if model is None or scaler is None:
            return jsonify({
                "anomaly": False,
                "score": 0,
                "message": "AI model is not loaded yet"
            })

        data = request.get_json()
        history = data.get("history", [])

        print("History length:", len(history))

        if len(history) < SEQUENCE_LENGTH:
            return jsonify({
                "anomaly": False,
                "score": 0,
                "message": "Not enough data for anomaly detection yet"
            })

        last_30 = history[-SEQUENCE_LENGTH:]

        sequence = np.array([
            [
                float(row.get("temperature", 0)),
                float(row.get("humidity", 0)),
                float(row.get("light", 0)),
                float(row.get("airQuality", 0))
            ]
            for row in last_30
        ], dtype=np.float32)

        print("Sequence shape:", sequence.shape)
        print("Scaler expected features:", getattr(scaler, "n_features_in_", "unknown"))

        latest_sequence = sequence[-1:].copy()

        sequence_scaled = scaler.transform(latest_sequence)
        sequence_scaled = sequence_scaled.reshape(1, 1, 4)

        prediction = model.predict(sequence_scaled, verbose=0)
        loss = np.mean(np.abs(prediction))

        return jsonify({
            "anomaly": bool(loss > ANOMALY_THRESHOLD),
            "score": float(loss),
            "threshold": ANOMALY_THRESHOLD,
            "message": "Anomaly detected" if loss > ANOMALY_THRESHOLD else "No anomaly detected"
        })

    except Exception as e:
        print("Anomaly error:", str(e))
        return jsonify({
            "anomaly": False,
            "score": 0,
            "message": f"Anomaly detection error: {str(e)}"
        }), 500
    

if __name__ == "__main__":
    app.run(debug=True)