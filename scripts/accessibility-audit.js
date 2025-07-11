#!/usr/bin/env node

import { spawn } from 'child_process';
import { writeFileSync } from 'fs';

const URL = 'http://localhost:4322';

console.log('🔍 ACCESSIBILITY AUDIT STARTING');
console.log('='.repeat(50));
console.log(`Auditing: ${URL}`);
console.log();

// Run axe-core audit
const axeProcess = spawn('bunx', ['@axe-core/cli', URL, '--format', 'json'], {
  stdio: ['pipe', 'pipe', 'pipe'],
  shell: true
});

let axeOutput = '';
let axeError = '';

axeProcess.stdout.on('data', (data) => {
  axeOutput += data.toString();
});

axeProcess.stderr.on('data', (data) => {
  axeError += data.toString();
});

axeProcess.on('close', (code) => {
  console.log('📊 AXE-CORE AUDIT RESULTS');
  console.log('-'.repeat(30));
  
  if (code === 0) {
    try {
      const results = JSON.parse(axeOutput);
      
      console.log(`✅ Passes: ${results.passes?.length || 0}`);
      console.log(`⚠️  Violations: ${results.violations?.length || 0}`);
      console.log(`🔍 Incomplete: ${results.incomplete?.length || 0}`);
      console.log(`ℹ️  Inapplicable: ${results.inapplicable?.length || 0}`);
      console.log();
      
      if (results.violations && results.violations.length > 0) {
        console.log('🚨 ACCESSIBILITY VIOLATIONS');
        console.log('-'.repeat(30));
        
        results.violations.forEach((violation, index) => {
          console.log(`${index + 1}. ${violation.id} (${violation.impact})`);
          console.log(`   Description: ${violation.description}`);
          console.log(`   Nodes affected: ${violation.nodes.length}`);
          console.log(`   Help: ${violation.helpUrl}`);
          console.log();
        });
      }
      
      if (results.incomplete && results.incomplete.length > 0) {
        console.log('🔍 INCOMPLETE CHECKS (need manual review)');
        console.log('-'.repeat(30));
        
        results.incomplete.forEach((incomplete, index) => {
          console.log(`${index + 1}. ${incomplete.id}`);
          console.log(`   Description: ${incomplete.description}`);
          console.log(`   Nodes to review: ${incomplete.nodes.length}`);
          console.log();
        });
      }
      
      // Save detailed results
      writeFileSync('accessibility-audit-results.json', JSON.stringify(results, null, 2));
      console.log('💾 Detailed results saved to accessibility-audit-results.json');
      
      // Generate summary
      const summary = {
        timestamp: new Date().toISOString(),
        url: URL,
        score: calculateAccessibilityScore(results),
        violations: results.violations?.length || 0,
        passes: results.passes?.length || 0,
        incomplete: results.incomplete?.length || 0,
        recommendations: generateRecommendations(results)
      };
      
      console.log();
      console.log('📋 ACCESSIBILITY SUMMARY');
      console.log('-'.repeat(30));
      console.log(`Overall Score: ${summary.score}/100`);
      console.log(`Status: ${getAccessibilityStatus(summary.score)}`);
      console.log();
      
      if (summary.recommendations.length > 0) {
        console.log('🎯 TOP RECOMMENDATIONS');
        console.log('-'.repeat(30));
        summary.recommendations.forEach((rec, index) => {
          console.log(`${index + 1}. ${rec}`);
        });
      }
      
      writeFileSync('accessibility-summary.json', JSON.stringify(summary, null, 2));
      console.log();
      console.log('✅ Accessibility audit completed!');
      
    } catch (error) {
      console.error('❌ Error parsing axe results:', error);
      console.log('Raw output:', axeOutput);
    }
  } else {
    console.error('❌ Axe audit failed with code:', code);
    console.error('Error:', axeError);
  }
});

function calculateAccessibilityScore(results) {
  const violations = results.violations?.length || 0;
  const passes = results.passes?.length || 0;
  const incomplete = results.incomplete?.length || 0;
  
  // Simple scoring algorithm
  const total = violations + passes + incomplete;
  if (total === 0) return 100;
  
  const score = Math.max(0, 100 - (violations * 10) - (incomplete * 2));
  return Math.round(score);
}

function getAccessibilityStatus(score) {
  if (score >= 90) return '🟢 EXCELLENT';
  if (score >= 70) return '🟡 GOOD';
  if (score >= 50) return '🟠 NEEDS IMPROVEMENT';
  return '🔴 POOR';
}

function generateRecommendations(results) {
  const recommendations = [];
  
  if (results.violations) {
    const highImpact = results.violations.filter(v => v.impact === 'critical' || v.impact === 'serious');
    
    if (highImpact.length > 0) {
      recommendations.push(`Fix ${highImpact.length} critical/serious accessibility violations`);
    }
    
    const commonIssues = results.violations.reduce((acc, violation) => {
      acc[violation.id] = (acc[violation.id] || 0) + 1;
      return acc;
    }, {});
    
    const mostCommon = Object.entries(commonIssues)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3);
    
    mostCommon.forEach(([issue, count]) => {
      recommendations.push(`Address ${issue} (${count} instances)`);
    });
  }
  
  if (results.incomplete && results.incomplete.length > 0) {
    recommendations.push(`Manually review ${results.incomplete.length} incomplete checks`);
  }
  
  return recommendations.slice(0, 5); // Top 5 recommendations
}

console.log('⏳ Running accessibility audit...');
console.log('This may take a few seconds...');
console.log();