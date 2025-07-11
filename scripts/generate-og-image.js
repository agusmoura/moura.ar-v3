#!/usr/bin/env node

import sharp from 'sharp';

async function generateOGImage() {
  try {
    // Create a 1200x630 OG image with brand colors
    const ogImage = sharp({
      create: {
        width: 1200,
        height: 630,
        channels: 4,
        background: { r: 16, g: 16, b: 14, alpha: 1 } // #10100E
      }
    });
    
    // Create SVG text overlay
    const textOverlay = `
      <svg width="1200" height="630">
        <defs>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#efbb47;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#ecad22;stop-opacity:1" />
          </linearGradient>
        </defs>
        
        <!-- Main title -->
        <text x="600" y="280" 
              font-family="Inter, sans-serif" 
              font-size="72" 
              font-weight="700" 
              text-anchor="middle" 
              fill="url(#goldGradient)">
          Agustín Moura
        </text>
        
        <!-- Subtitle -->
        <text x="600" y="350" 
              font-family="Inter, sans-serif" 
              font-size="32" 
              font-weight="400" 
              text-anchor="middle" 
              fill="white">
          Full-Stack Developer &amp; UX/UI Designer
        </text>
        
        <!-- Website URL -->
        <text x="600" y="420" 
              font-family="Inter, sans-serif" 
              font-size="24" 
              font-weight="300" 
              text-anchor="middle" 
              fill="#888">
          moura.ar
        </text>
        
        <!-- Decorative elements -->
        <circle cx="200" cy="150" r="3" fill="#ecad22" opacity="0.6"/>
        <circle cx="1000" cy="480" r="2" fill="#ecad22" opacity="0.4"/>
        <circle cx="150" cy="500" r="1.5" fill="#ecad22" opacity="0.3"/>
        <circle cx="1050" cy="180" r="2.5" fill="#ecad22" opacity="0.5"/>
      </svg>
    `;
    
    await ogImage
      .composite([
        {
          input: Buffer.from(textOverlay),
          top: 0,
          left: 0,
        }
      ])
      .webp({ quality: 90 })
      .toFile('public/og-image.webp');
    
    console.log('✅ Generated og-image.webp (1200x630)');
    
    // Also generate JPG version for better compatibility
    await ogImage
      .composite([
        {
          input: Buffer.from(textOverlay),
          top: 0,
          left: 0,
        }
      ])
      .jpeg({ quality: 85 })
      .toFile('public/og-image.jpg');
    
    console.log('✅ Generated og-image.jpg (1200x630)');
    console.log('🎉 OG images generated successfully!');
    
  } catch (error) {
    console.error('❌ Error generating OG image:', error);
    process.exit(1);
  }
}

generateOGImage();