// app/api/classify/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get('image') as File;

    if (!image) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      );
    }

    // Create temp directory if it doesn't exist
    const tempDir = path.join(process.cwd(), 'temp');
    if (!existsSync(tempDir)) {
      await mkdir(tempDir, { recursive: true });
    }

    // Generate a unique filename
    const uniqueFilename = `${Date.now()}-${image.name || 'upload.jpg'}`;
    const tempFilePath = path.join(tempDir, uniqueFilename);

    // Write the file to the temp directory
    const buffer = Buffer.from(await image.arrayBuffer());
    await writeFile(tempFilePath, buffer);

    // Call Python script to classify the image
    const { stdout, stderr } = await execAsync(`python main.py --image ${tempFilePath}`);
    
    if (stderr && !stderr.includes('WARNING:tensorflow')) {
      console.error('Python script error:', stderr);
      return NextResponse.json(
        { error: 'Error running classification script' },
        { status: 500 }
      );
    }

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

    const predictedClass = predictedClassLine.split('Predicted:')[1].trim();
    const confidenceMatch = confidenceLine.match(/Confidence: ([\d.]+)/);
    const confidence = confidenceMatch ? parseFloat(confidenceMatch[1]) : 0;

    // Clean up temp file (asynchronously, no need to await)
    try {
      await unlink(tempFilePath);
    } catch (err) {
      console.error('Error deleting temp file:', err);
    }

    return NextResponse.json({
      predictedClass,
      confidence,
    });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'Error processing request' },
      { status: 500 }
    );
  }
}

// Helper function to delete a file
async function unlink(filePath: string) {
  const { unlink } = require('fs/promises');
  await unlink(filePath);
}