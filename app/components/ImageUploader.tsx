// app/components/ImageUploader.tsx
"use client"

import { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { ClassificationResult } from '../types';

interface ImageUploaderProps {
  onResult: (result: ClassificationResult) => void;
  setLoading: (loading: boolean) => void;
}

const ImageUploader = ({ onResult, setLoading }: ImageUploaderProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setLoading(true);
    
    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await axios.post('/api/classify', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      onResult({
        ...response.data,
        imageUrl: previewUrl as string,
      });
    } catch (error) {
      console.error('Error classifying image:', error);
      alert('Error classifying image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="image-uploader">
      <form onSubmit={handleSubmit}>
        <div className="file-input-container">
          <input
            type="file"
            onChange={handleFileChange}
            accept="image/jpeg,image/png,image/jpg"
            id="file-input"
          />
          <label htmlFor="file-input" className="file-input-label">
            {selectedFile ? selectedFile.name : 'Choose an image'}
          </label>
        </div>
        
        {previewUrl && (
          <div className="preview-container">
            <Image 
              src={previewUrl} 
              alt="Preview" 
              className="image-preview" 
              width={300} 
              height={300}
              style={{ objectFit: 'contain', maxHeight: '300px' }}
            />
          </div>
        )}
        
        <button 
          type="submit" 
          disabled={!selectedFile}
          className="submit-button"
        >
          Classify Image
        </button>
      </form>
    </div>
  );
};

export default ImageUploader;