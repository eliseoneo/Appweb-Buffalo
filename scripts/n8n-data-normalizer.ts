/**
 * n8n Data Normalizer
 * Main script for normalizing agent call data to database schema
 * 
 * Usage:
 *   ts-node scripts/n8n-data-normalizer.ts [input-file] [output-file]
 * 
 * Or import as module:
 *   import { normalizeData } from './n8n-data-normalizer';
 */

import * as fs from 'fs';
import * as path from 'path';
import { loadFieldMapping, mapRecords } from './utils/field-mapper';
import { validateRecords, formatValidationResults } from './utils/data-validator';

export interface NormalizationOptions {
  inputFile?: string;
  outputFile?: string;
  configFile?: string;
  validate?: boolean;
  verbose?: boolean;
}

export interface NormalizationResult {
  success: boolean;
  normalizedData: Record<string, any>[];
  validationResult?: any;
  stats: {
    recordsProcessed: number;
    recordsValid: number;
    errors: number;
    warnings: number;
  };
}

/**
 * Parse agent data (handles both JSON array and line-delimited JSON)
 */
function parseAgentData(content: string): Record<string, any>[] {
  content = content.trim();
  
  // Try parsing as JSON array first
  try {
    const parsed = JSON.parse(content);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    // If it's a single object, wrap it in an array
    return [parsed];
  } catch (error) {
    // Try parsing as line-delimited JSON
    const lines = content.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
    
    const records: Record<string, any>[] = [];
    
    for (const line of lines) {
      try {
        const record = JSON.parse(line);
        records.push(record);
      } catch (lineError) {
        console.warn(`Warning: Could not parse line: ${line.substring(0, 50)}...`);
      }
    }
    
    return records;
  }
}

/**
 * Normalize agent data
 */
export function normalizeData(
  inputData: Record<string, any>[] | string,
  options: NormalizationOptions = {}
): NormalizationResult {
  const startTime = Date.now();
  
  // Load configuration
  const configPath = options.configFile || path.join(__dirname, 'field-mapping.json');
  const mapping = loadFieldMapping(configPath);
  
  if (options.verbose) {
    console.log('🔧 Loading field mapping configuration...');
    console.log(`   Config: ${configPath}`);
  }
  
  // Parse input data if it's a string
  let sourceData: Record<string, any>[];
  if (typeof inputData === 'string') {
    sourceData = parseAgentData(inputData);
  } else {
    sourceData = inputData;
  }
  
  if (options.verbose) {
    console.log(`📊 Processing ${sourceData.length} record(s)...`);
  }
  
  // Map records
  const normalizedData = mapRecords(sourceData, mapping);
  
  // Validate if requested
  let validationResult = null;
  let stats = {
    recordsProcessed: normalizedData.length,
    recordsValid: normalizedData.length,
    errors: 0,
    warnings: 0
  };
  
  if (options.validate !== false) {
    if (options.verbose) {
      console.log('✓ Validating normalized data...');
    }
    
    validationResult = validateRecords(normalizedData, mapping);
    stats.errors = validationResult.errors.length;
    stats.warnings = validationResult.warnings.length;
    stats.recordsValid = validationResult.isValid ? normalizedData.length : 0;
    
    if (options.verbose) {
      console.log(formatValidationResults(validationResult));
    }
  }
  
  const endTime = Date.now();
  
  if (options.verbose) {
    console.log(`\n⏱️  Processing completed in ${(endTime - startTime)}ms`);
    console.log(`   Records processed: ${stats.recordsProcessed}`);
    console.log(`   Errors: ${stats.errors}`);
    console.log(`   Warnings: ${stats.warnings}`);
  }
  
  return {
    success: validationResult ? validationResult.isValid : true,
    normalizedData,
    validationResult,
    stats
  };
}

/**
 * Normalize data from file
 */
export function normalizeFromFile(options: NormalizationOptions): NormalizationResult {
  const inputPath = options.inputFile || path.join(__dirname, '../documentation/example-var-from-agents.json');
  
  if (options.verbose) {
    console.log('📂 Reading input file...');
    console.log(`   Input: ${inputPath}`);
  }
  
  // Read input file
  const inputContent = fs.readFileSync(inputPath, 'utf-8');
  
  // Normalize
  const result = normalizeData(inputContent, options);
  
  // Write output if specified
  if (options.outputFile) {
    if (options.verbose) {
      console.log(`💾 Writing output file...`);
      console.log(`   Output: ${options.outputFile}`);
    }
    
    fs.writeFileSync(
      options.outputFile,
      JSON.stringify(result.normalizedData, null, 2),
      'utf-8'
    );
  }
  
  return result;
}

/**
 * CLI entry point
 */
function main() {
  const args = process.argv.slice(2);
  
  const options: NormalizationOptions = {
    verbose: true,
    validate: true
  };
  
  // Parse command line arguments
  if (args.length > 0) {
    options.inputFile = args[0];
  }
  
  if (args.length > 1) {
    options.outputFile = args[1];
  }
  
  // Set default output if input is provided but output is not
  if (options.inputFile && !options.outputFile) {
    const inputBasename = path.basename(options.inputFile, path.extname(options.inputFile));
    options.outputFile = path.join(__dirname, '../output', `${inputBasename}-normalized.json`);
  }
  
  console.log('🚀 n8n Data Normalizer\n');
  console.log('==================================================\n');
  
  try {
    const result = normalizeFromFile(options);
    
    console.log('\n==================================================');
    
    if (result.success) {
      console.log('✅ Normalization completed successfully!');
    } else {
      console.log('⚠️  Normalization completed with validation errors');
      process.exit(1);
    }
  } catch (error) {
    console.error('\n❌ Error during normalization:');
    console.error(error);
    process.exit(1);
  }
}

// Run CLI if executed directly
if (require.main === module) {
  main();
}

