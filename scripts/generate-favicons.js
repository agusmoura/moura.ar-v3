#!/usr/bin/env node

import sharp from 'sharp';
import { readFile } from 'fs/promises';

async function generateFavicons() {
  try {
    // Read the SVG file
    const svgBuffer = await readFile('public/favicon.svg');
    
    // Generate different sizes
    const sizes = [
      { size: 16, name: 'favicon-16x16.png' },
      { size: 32, name: 'favicon-32x32.png' },
      { size: 180, name: 'apple-touch-icon.png' }
    ];
    
    for (const { size, name } of sizes) {
      await sharp(svgBuffer)
        .resize(size, size)
        .png()
        .toFile(`public/${name}`);
      
      console.log(`✅ Generated ${name} (${size}x${size})`);
    }
    
    console.log('🎉 All favicons generated successfully!');
  } catch (error) {
    console.error('❌ Error generating favicons:', error);
    process.exit(1);
  }
}

generateFavicons();