// app/types/index.ts
export interface ClassificationResult {
  predictedClass: string;
  confidence: number;
  imageUrl: string;
}