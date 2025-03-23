import os
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
from tensorflow.keras.applications.resnet50 import preprocess_input
import argparse
import glob

# class 0 -> cat
# class 1 -> dog
# class 2 -> snake

def load_and_preprocess_image(img_path, target_size=(224, 224)):
    """
    Load and preprocess an image for prediction

    Args:
        img_path: Path to the image file
        target_size: Size to resize the image to (default: 224x224)

    Returns:
        Preprocessed image tensor ready for prediction
    """
    img = image.load_img(img_path, target_size=target_size)
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    preprocessed_img = preprocess_input(img_array)
    return preprocessed_img

def predict_animal(model, img_path, class_names=None):
    """
    Make a prediction for a single image

    Args:
        model: Loaded Keras model
        img_path: Path to the image file
        class_names: List of class names (optional)

    Returns:
        Predicted class and confidence score
    """
    preprocessed_img = load_and_preprocess_image(img_path)
    predictions = model.predict(preprocessed_img)

    # Get the predicted class index
    predicted_class_index = np.argmax(predictions[0])
    confidence = float(predictions[0][predicted_class_index])

    # Get the class name if available
    if class_names and predicted_class_index < len(class_names):
        predicted_class = class_names[predicted_class_index]
    else:
        classes = {
            0: "cat",
            1: "dog",
            2: "snake"
        }
        predicted_class = f"This is a clueless {classes[predicted_class_index]}"

    return predicted_class, confidence

def main():
    # Set up argument parser
    parser = argparse.ArgumentParser(description='Animal Classification from Images')
    parser.add_argument('--model', type=str, default='animal_classifier_improved.h5',
                        help='Path to the H5 model file')
    parser.add_argument('--image', type=str, help='Path to a single image file for prediction')
    parser.add_argument('--dir', type=str, help='Path to directory containing images for prediction')
    parser.add_argument('--class_file', type=str, help='Path to text file with class names (one per line)')

    args = parser.parse_args()

    # Check if model file exists
    if not os.path.exists(args.model):
        print(f"Error: Model file '{args.model}' not found!")
        return

    # Load the model
    print(f"Loading model from {args.model}...")
    model = load_model(args.model)
    model.summary()

    # Load class names if provided
    class_names = None
    if args.class_file and os.path.exists(args.class_file):
        with open(args.class_file, 'r') as f:
            class_names = [line.strip() for line in f.readlines()]
        print(f"Loaded {len(class_names)} class names")

    # Collect image paths
    image_paths = []
    if args.image and os.path.exists(args.image):
        image_paths = [args.image]
    elif args.dir and os.path.isdir(args.dir):
        # Get all image files in the directory
        image_paths = []
        for ext in ['jpg', 'jpeg', 'png']:
            image_paths.extend(glob.glob(os.path.join(args.dir, f'*.{ext}')))
        image_paths.extend(glob.glob(os.path.join(args.dir, f'*.{ext.upper()}')))

    if not image_paths:
        print("No valid images found! Please provide a valid image file or directory.")
        return

    # Process each image
    print(f"Processing {len(image_paths)} images...")
    for img_path in image_paths:
        try:
            predicted_class, confidence = predict_animal(model, img_path, class_names)
            print(f"\nImage: {os.path.basename(img_path)}")
            print(f"Predicted: {predicted_class}")
            print(f"Confidence: {confidence:.4f} ({confidence*100:.2f}%)")
        except Exception as e:
            print(f"\nError processing {img_path}: {str(e)}")

if __name__ == "__main__":
    main()
