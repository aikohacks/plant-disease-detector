from flask import Flask, request, jsonify
from flask_cors import CORS
from tensorflow import keras
from PIL import Image
import numpy as np
import io
import os

app = Flask(__name__)
CORS(app)

# --- Model Loading ---
MODEL_DIR = os.path.join(os.path.dirname(__file__), 'model')
MODEL_PATH = os.path.join(MODEL_DIR, "plant_disease_model1.keras")
CLASS_NAMES_PATH = os.path.join(MODEL_DIR, "class_names.npy")

try:
    model = keras.models.load_model(MODEL_PATH)
    class_names = np.load(CLASS_NAMES_PATH, allow_pickle=True)
    print("✅ Model and class names loaded successfully.")
except Exception as e:
    print(f"❌ Error loading model or class names: {e}")
    model = None
    class_names = []

# --- Single Route for All API Requests ---
@app.route('/', methods=['GET', 'POST'])
def handle_request():
    # Handle a simple GET request for health checks
    if request.method == 'GET':
        return jsonify({"status": "ok", "message": "API is running."})

    # Handle the POST request for prediction
    if request.method == 'POST':
        if not model or not class_names.any():
            return jsonify({"error": "Model is not loaded"}), 500
        if "file" not in request.files:
            return jsonify({"error": "No file uploaded"}), 400

        file = request.files["file"]
        if file.filename == '':
            return jsonify({"error": "No file selected"}), 400

        try:
            img_bytes = file.read()
            img = Image.open(io.BytesIO(img_bytes)).convert("RGB")
            img = img.resize((224, 224))
            img_array = keras.preprocessing.image.img_to_array(img)
            img_array = np.expand_dims(img_array, axis=0)

            preds = model.predict(img_array)
            pred_class_name = str(class_names[np.argmax(preds[0])])
            confidence = float(np.max(preds[0]))

            return jsonify({
                "prediction": pred_class_name,
                "confidence": f"{confidence:.2%}"
            })
        except Exception as e:
            print(f"Prediction error: {e}")
            return jsonify({"error": "Failed to process image"}), 500
