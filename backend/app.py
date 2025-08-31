from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
from tensorflow import keras
from tensorflow.keras.preprocessing import image
import numpy as np
import io
from PIL import Image
import os

app = Flask(__name__)

# --- Allow requests from other domains (like Vercel) ---
CORS(app)

# --- Load model and class names using relative paths ---
try:
    # Construct the path relative to this app.py file
    MODEL_DIR = os.path.join(os.path.dirname(__file__), 'model')
    MODEL_PATH = os.path.join(MODEL_DIR, "plant_disease_model1.keras")  # Your model file
    CLASS_NAMES_PATH = os.path.join(MODEL_DIR, "class_names.npy")

    model = keras.models.load_model(MODEL_PATH)
    class_names = np.load(CLASS_NAMES_PATH, allow_pickle=True)
    print("✅ Model and class names loaded successfully.")

except Exception as e:
    print(f"❌ Error loading model or class names: {e}")
    model = None
    class_names = []

IMG_SIZE = (224, 224)

def prepare_image(file_bytes):
    """Prepares an image from bytes for the model."""
    img = Image.open(io.BytesIO(file_bytes)).convert("RGB")
    img = img.resize(IMG_SIZE)
    img_array = image.img_to_array(img)
    # Add a batch dimension. DO NOT manually scale pixels.
    img_array = np.expand_dims(img_array, axis=0)
    return img_array

@app.route("/predict", methods=["POST"])
def predict():
    if not model or not class_names.any():
        return jsonify({"error": "Model is not loaded"}), 500

    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400

    try:
        img_array = prepare_image(file.read())
        preds = model.predict(img_array)

        # --- Return the actual class name, not just a number ---
        pred_index = np.argmax(preds[0])
        pred_class_name = class_names[pred_index]  # Get the string name
        confidence = float(np.max(preds[0]))

        return jsonify({
            "prediction": str(pred_class_name),  # Ensure it's JSON serializable
            "confidence": f"{confidence:.2%}"
        })

    except Exception as e:
        print(f"Prediction error: {e}")
        return jsonify({"error": "Failed to process image"}), 500

if __name__ == '__main__':
    app.run(debug=True)
