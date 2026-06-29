Plant Disease Detector

A deep learning model that classifies plant diseases from leaf images using a Convolutional Neural Network (CNN), achieving ~90% accuracy on the test dataset.


Built during my Machine Learning Internship at THDC India Limited (Aug–Sep 2025).




Tech Stack

ComponentTechnologyLanguagePythonDeep LearningTensorFlow, KerasImage ProcessingOpenCV


Features


CNN Architecture — Custom convolutional neural network trained for multi-class plant disease classification
~90% Test Accuracy — Evaluated on held-out test dataset
Image Preprocessing Pipeline — OpenCV used for resizing, normalization, and augmentation before training and inference
Inference on New Images — Pass any leaf image and get the predicted disease class



Project Structure

plant-disease-detector/
├── dataset/                # Training and test images (not included — see below)
├── preprocessing.py        # OpenCV image preprocessing pipeline
├── train.py                # Model training script
├── predict.py              # Run inference on a new image
├── model/
│   └── plant_disease_model.h5   # Saved trained model
└── requirements.txt


Getting Started

Prerequisites


Python 3.9+
pip


Installation

bashgit clone https://github.com/aikohacks/plant-disease-detector.git
cd plant-disease-detector
pip install -r requirements.txt

Dataset

This model was trained on a labeled plant leaf image dataset organized by disease class:

dataset/
├── train/
│   ├── Healthy/
│   ├── Leaf_Blight/
│   ├── Powdery_Mildew/
│   └── ...
└── test/
    ├── Healthy/
    └── ...

You can use the PlantVillage Dataset from Kaggle or substitute your own labeled dataset in the same structure.

Train the Model

bashpython train.py

The trained model will be saved to model/plant_disease_model.h5.

Run Inference

bashpython predict.py --image path/to/leaf.jpg

Output:

Predicted Disease: Leaf Blight
Confidence: 92.4%


Model Details

PropertyValueArchitectureConvolutional Neural Network (CNN)FrameworkTensorFlow / KerasTest Accuracy~90%Input Size128×128 RGB imagesPreprocessingResize, normalize, augment (flip, rotate) via OpenCV


Results

The model was evaluated on a held-out test set and achieved approximately 90% accuracy, demonstrating robust generalisation across multiple plant disease categories.


Author

Riddhima Pandey

GitHub · LinkedIn

ML Intern — THDC India Limited
