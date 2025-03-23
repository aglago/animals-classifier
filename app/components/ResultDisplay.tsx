// app/components/ResultDisplay.tsx
"use client"

import Image from 'next/image';
import { ClassificationResult } from '../types';

interface ResultDisplayProps {
  result: ClassificationResult | null;
}

const ResultDisplay = ({ result }: ResultDisplayProps) => {
  if (!result) return null;

  const confidencePercentage = (result.confidence * 100).toFixed(2);

  return (
    <div className="result-container">
      <h2>Classification Result</h2>
      
      <div className="result-details">
        <div className="result-image-container">
          <Image 
            src={result.imageUrl} 
            alt="Classified" 
            className="result-image" 
            width={250} 
            height={250}
            style={{ objectFit: 'contain', maxHeight: '250px' }}
          />
        </div>
        
        <div className="result-text">
          <p className="predicted-class">
            <span>Prediction:</span> {result.predictedClass}
          </p>
          <p className="confidence">
            <span>Confidence:</span> {confidencePercentage}%
          </p>
          
          <div className="confidence-bar-container">
            <div 
              className="confidence-bar" 
              style={{ width: `${confidencePercentage}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;