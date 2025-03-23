// app/api/classify-sample/route.ts
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function GET(request: NextRequest) {
  // Get the type from the URL query parameters
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get('type');
  
  if (!type || !['cat', 'dog', 'snake'].includes(type)) {
    console.log(20);
    return NextResponse.json(
      { error: 'Invalid animal type' },
      { status: 400 }
    );
  }
  console.log(20);
  
  
  const sampleImagePath = path.join(process.cwd(), 'public', 'sample-images', `sample-${type}.jpg`);
  
  try {
    // Call Python script to classify the image
    const { stdout, stderr } = await execAsync(`python main.py --image ${sampleImagePath}`);
    
    console.log(29);
    if (stderr && !stderr.includes('WARNING:tensorflow')) {
      console.error('Python script error:', stderr);
      return NextResponse.json(
        { error: 'Error running classification script' },
        { status: 500 }
      );
    }
    console.log(37);
    
    // Parse the output from Python script
    const lines = stdout.split('\n');
    const predictedClassLine = lines.find(line => line.includes('Predicted:'));
    const confidenceLine = lines.find(line => line.includes('Confidence:'));
    
    if (!predictedClassLine || !confidenceLine) {
      return NextResponse.json(
        { error: 'Invalid output from classification script' },
        { status: 500 }
      );
    }
    console.log(37);
    
    const predictedClass = predictedClassLine.split('Predicted:')[1].trim();
    const confidenceMatch = confidenceLine.match(/Confidence: ([\d.]+)/);
    const confidence = confidenceMatch ? parseFloat(confidenceMatch[1]) : 0;
    
    return NextResponse.json({
      predictedClass,
      confidence,
    });
  } catch (error) {
    console.error('Error running classification:', error);
    return NextResponse.json(
      { error: 'Error running classification' },
      { status: 500 }
    );
  }
}