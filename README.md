# Animal Image Classifier

A web application for classifying images of cats, dogs, and snakes using machine learning.

## Overview

This project combines a Python TensorFlow model with a Next.js TypeScript frontend to create an interactive animal classification system. Users can upload their own images or use sample images to classify animals into three categories: cats, dogs, and snakes.

![Animal Classifier Screenshot](https://placeholder-for-your-screenshot.com)

## Features

- Upload and classify custom images
- Use pre-loaded sample images for quick testing
- Real-time image preview
- Classification results with confidence scores
- Responsive design for mobile and desktop

## Tech Stack

- **Frontend**:
  - Next.js 15 (App Router)
  - TypeScript
  - React
  - Axios for API requests
  
- **Backend**:
  - Python
  - TensorFlow
  - Keras
  - Next.js API Routes

## Prerequisites

- Node.js (v16+)
- Python (v3.8+)
- npm or yarn

## Installation

### Clone the repository

```bash
git clone https://github.com/yourusername/animal-classifier.git
cd animal-classifier
```

### Set up Python environment

```bash
# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# On Windows:
.\venv\Scripts\Activate.ps1
# On macOS/Linux:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt
```

### Install Next.js dependencies

```bash
npm install
# or
yarn install
```

## Project Structure

```
animal-classifier/
├── app/                      # Next.js app directory
│   ├── api/                  # API routes
│   ├── components/           # React components
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Home page
├── public/                   # Static files
│   └── sample-images/        # Sample animal images
├── main.py                   # Python classification script
├── animal_classifier_improved.h5  # Pre-trained model
├── requirements.txt          # Python dependencies
└── next.config.js            # Next.js configuration
```

## Running the Application

1. Ensure your Python virtual environment is activated

2. Start the development server:

```bash
npm run dev
# or
yarn dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## How to Use

1. **Upload an Image**: Click the "Choose an image" button to select a file from your device. The application accepts JPG, JPEG, and PNG formats.

2. **Preview**: After selecting an image, you'll see a preview displayed on the screen.

3. **Classify**: Click the "Classify Image" button to send the image to the model for classification.

4. **View Results**: The classification result will show the predicted animal type and the confidence score as a percentage.

5. **Sample Images**: Alternatively, you can click on one of the sample images at the bottom of the page for instant classification.

## Model Information

The classification model is built with TensorFlow and Keras, trained to identify three animal classes:
- Class 0: Cat
- Class 1: Dog
- Class 2: Snake

The model uses a ResNet50 architecture with transfer learning for efficient image classification.

## Deployment

For production deployment:

1. Build the Next.js application:

```bash
npm run build
# or
yarn build
```

2. Deploy the application to your preferred hosting service (Vercel, Netlify, etc.)

3. Ensure the Python environment is properly set up on your server

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- TensorFlow and Keras for the machine learning framework
- Next.js team for the amazing React framework
- Sample images sourced from [provide source if applicable]

---

Created by [Your Name] - [Your GitHub Profile](https://github.com/yourusername)