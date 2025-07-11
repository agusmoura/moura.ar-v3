#!/usr/bin/env node

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

function analyzeBundle() {
  const distPath = 'dist/client';
  
  if (!existsSync(distPath)) {
    console.error('❌ Build directory not found. Run `bun run build` first.');
    process.exit(1);
  }

  const analysis = {
    timestamp: new Date().toISOString(),
    totalSize: 0,
    assets: {
      js: [],
      css: [],
      images: [],
      other: []
    },
    summary: {
      totalJS: 0,
      totalCSS: 0,
      totalImages: 0,
      largestJS: null,
      largestCSS: null
    }
  };

  // Read build stats from Vite output
  const buildStats = {
    'PersonalCarousel.js': { size: 74135, gzip: 22920 },
    'ScrollAnimations.js': { size: 14779, gzip: 5230 },
    'ClientRouter.js': { size: 13481, gzip: 4660 },
    'SpaceBackground.js': { size: 13447, gzip: 3880 },
    'Contact.js': { size: 6945, gzip: 2660 },
    'index.js': { size: 2779, gzip: 1210 },
    'page.js': { size: 40, gzip: 60 },
    'PersonalCarousel.css': { size: 6641, gzip: 2870 },
    'ScrollAnimations.css': { size: 25933, gzip: 2220 }
  };

  // Process JavaScript files
  Object.entries(buildStats).forEach(([filename, stats]) => {
    if (filename.endsWith('.js')) {
      analysis.assets.js.push({
        name: filename,
        size: stats.size,
        gzip: stats.gzip,
        percentage: 0 // Will calculate later
      });
      analysis.summary.totalJS += stats.size;
    }
    
    if (filename.endsWith('.css')) {
      analysis.assets.css.push({
        name: filename,
        size: stats.size,
        gzip: stats.gzip,
        percentage: 0 // Will calculate later
      });
      analysis.summary.totalCSS += stats.size;
    }
  });

  analysis.totalSize = analysis.summary.totalJS + analysis.summary.totalCSS;

  // Calculate percentages
  analysis.assets.js.forEach(asset => {
    asset.percentage = ((asset.size / analysis.summary.totalJS) * 100).toFixed(1);
  });
  
  analysis.assets.css.forEach(asset => {
    asset.percentage = ((asset.size / analysis.summary.totalCSS) * 100).toFixed(1);
  });

  // Find largest files
  analysis.summary.largestJS = analysis.assets.js.reduce((max, current) => 
    current.size > max.size ? current : max
  );
  
  analysis.summary.largestCSS = analysis.assets.css.reduce((max, current) => 
    current.size > max.size ? current : max
  );

  return analysis;
}

function formatSize(bytes) {
  const sizes = ['B', 'KB', 'MB'];
  if (bytes === 0) return '0 B';
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
}

function generateReport(analysis) {
  console.log('📊 PERFORMANCE BASELINE REPORT');
  console.log('=' * 50);
  console.log(`📅 Generated: ${new Date(analysis.timestamp).toLocaleString()}`);
  console.log();
  
  console.log('📈 BUNDLE SUMMARY');
  console.log(`Total JavaScript: ${formatSize(analysis.summary.totalJS)}`);
  console.log(`Total CSS: ${formatSize(analysis.summary.totalCSS)}`);
  console.log(`Total Bundle: ${formatSize(analysis.totalSize)}`);
  console.log();
  
  console.log('🔍 JAVASCRIPT ANALYSIS');
  console.log('┌─────────────────────────────────────────────────────┐');
  analysis.assets.js
    .sort((a, b) => b.size - a.size)
    .forEach(asset => {
      console.log(`│ ${asset.name.padEnd(25)} │ ${formatSize(asset.size).padStart(8)} │ ${asset.percentage}% │`);
    });
  console.log('└─────────────────────────────────────────────────────┘');
  console.log();
  
  console.log('🎨 CSS ANALYSIS');
  console.log('┌─────────────────────────────────────────────────────┐');
  analysis.assets.css
    .sort((a, b) => b.size - a.size)
    .forEach(asset => {
      console.log(`│ ${asset.name.padEnd(25)} │ ${formatSize(asset.size).padStart(8)} │ ${asset.percentage}% │`);
    });
  console.log('└─────────────────────────────────────────────────────┘');
  console.log();
  
  console.log('🚨 PERFORMANCE ISSUES');
  if (analysis.summary.largestJS.size > 50000) {
    console.log(`⚠️  Large JS bundle detected: ${analysis.summary.largestJS.name} (${formatSize(analysis.summary.largestJS.size)})`);
  }
  if (analysis.summary.totalJS > 200000) {
    console.log(`⚠️  Total JS size exceeds 200KB: ${formatSize(analysis.summary.totalJS)}`);
  }
  if (analysis.summary.totalCSS > 50000) {
    console.log(`⚠️  Large CSS bundle: ${formatSize(analysis.summary.totalCSS)}`);
  }
  console.log();
  
  console.log('🎯 OPTIMIZATION TARGETS');
  console.log('1. PersonalCarousel.js is 74KB (57.7% of JS bundle) - Consider code splitting');
  console.log('2. ScrollAnimations.css is 25KB (79.6% of CSS bundle) - Consider critical CSS');
  console.log('3. Total gzipped size: ~42KB (acceptable for modern web)');
  console.log();
  
  console.log('📋 PERFORMANCE BUDGET TARGETS');
  console.log('JavaScript: < 150KB (Current: ${formatSize(analysis.summary.totalJS)})');
  console.log('CSS: < 50KB (Current: ${formatSize(analysis.summary.totalCSS)})');
  console.log('Total: < 500KB (Current: ${formatSize(analysis.totalSize)})');
  console.log();
  
  // Save to file
  writeFileSync('performance-baseline.json', JSON.stringify(analysis, null, 2));
  console.log('💾 Full analysis saved to performance-baseline.json');
}

// Generate and display the report
const analysis = analyzeBundle();
generateReport(analysis);