// app/page.tsx
"use client"

import { useState } from 'react';
import Image from 'next/image';
import ImageUploader from './components/ImageUploader';
import ResultDisplay from './components/ResultDisplay';
import { ClassificationResult } from './types';

export default function Home() {
  const [result, setResult] = useState<ClassificationResult | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSampleClick(animalType: string) {
    setLoading(true);
    
    try {
      const response = await fetch(`/api/classify-sample?type=${animalType}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      setResult({
        ...data,
        imageUrl: `/sample-images/sample-${animalType}.jpg`,
      });
    } catch (error) {
      console.error('Error classifying sample image:', error);
      alert('Error classifying sample image. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <main>
        <h1 className="title">Animal Image Classifier</h1>
        <p className="description">
          Upload an image to classify it as a cat, dog, or snake
        </p>

        <ImageUploader onResult={setResult} setLoading={setLoading} />
        
        {loading && <div className="loading">Processing image...</div>}
        
        <ResultDisplay result={result} />
        
        <div className="sample-images">
          <h3>Or try with sample images:</h3>
          <div className="sample-grid">
            <div className="sample-item" onClick={() => handleSampleClick('cat')}>
              <Image 
                src="/sample-images/sample-cat.jpg" 
                alt="Sample cat" 
                width={200} 
                height={150}
                style={{ objectFit: 'cover', width: '100%', height: '150px' }}
              />
              <p>Cat</p>
            </div>
            <div className="sample-item" onClick={() => handleSampleClick('dog')}>
              <Image 
                src="/sample-images/sample-dog2.jpg" 
                alt="Sample dog" 
                width={200} 
                height={150}
                style={{ objectFit: 'cover', width: '100%', height: '150px' }}
              />
              <p>Dog</p>
            </div>
            <div className="sample-item" onClick={() => handleSampleClick('snake')}>
              <Image 
                src="/sample-images/sample-snake.jpg" 
                alt="Sample snake" 
                width={200} 
                height={150}
                style={{ objectFit: 'cover', width: '100%', height: '150px' }}
              />
              <p>Snake</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}