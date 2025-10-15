/**
 * n8n Data Normalizer (JavaScript Version)
 * Compatible with n8n Code node and standalone execution
 * 
 * Usage in n8n Code Node:
 *   - Copy this entire file into a Code node
 *   - Call normalizeData($input.all()) in the Code node
 * 
 * Standalone usage:
 *   node scripts/n8n-data-normalizer.js [input-file] [output-file]
 */

const fs = require('fs');
const path = require('path');

// ============================================================================
// Type Converters
// ============================================================================

function toFloat(value) {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  const num = typeof value === 'string' ? parseFloat(value) : Number(value);
  return isNaN(num) ? null : num;
}

function toInteger(value) {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  const num = typeof value === 'string' ? parseInt(value, 10) : Math.floor(Number(value));
  return isNaN(num) ? null : num;
}

function toBoolean(value) {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  if (typeof value === 'boolean') {
    return value;
  }
  if (typeof value === 'string') {
    const lower = value.toLowerCase().trim();
    if (lower === 'true' || lower === '1' || lower === 'yes' || lower === 'sí') {
      return true;
    }
    if (lower === 'false' || lower === '0' || lower === 'no') {
      return false;
    }
  }
  if (typeof value === 'number') {
    return value !== 0;
  }
  return null;
}

function toTimestamp(value) {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  try {
    const date = new Date(value);
    if (!isNaN(date.getTime())) {
      return date.toISOString();
    }
  } catch (error) {
    return null;
  }
  return null;
}

function toString(value) {
  if (value === null || value === undefined) {
    return null;
  }
  return String(value);
}

// ============================================================================
// Field Mapping Configuration
// ============================================================================

const FIELD_MAPPING_CONFIG = {
  fieldMappings: {
    id: 'id',
    id_llamada: 'id_llamada',
    agent_name: 'agent_name',
    agent_id: 'agent_id',
    duration_ms: 'duracion_ms',
    fecha_inicio: 'fecha_inicio',
    fecha_final: 'fecha_final',
    razon_desconexion: 'razon_desconexion',
    sentimiento: 'sentimiento',
    coste_total: 'coste_total',
    cost_voice: 'coste_voice',
    cost_llm: 'cost_llm',
    cost_knowledge: 'cost_knowledge',
    llm_tockens: 'llm_tockens',
    latency_total: 'latency:total',
    latency_e2e: 'latency_e2e',
    latency_llm: 'latency_llm',
    latency_tts: 'latency_tts',
    latency_kb: 'latency_kb',
    lead_name: 'lead name',
    voicemail: 'voicemail',
    entrevista: 'entrevista',
    situacion_laboral: 'Situacion_laboral',
    'antigüedad_laboral': 'Antigüedad_laboral',
    nivel_estudios: 'nivel_estudios',
    turno_contacto: 'turno_contacto',
    cargo: 'cargo',
    observaciones: 'observaciones',
    'transcripción': 'transcripcion',
    'campaña': 'campaña',
    MODEL: 'modelo'
  },
  valueTransformations: {
    razon_desconexion: {
      user_hangup: 'usuario cuelga',
      agent_hangup: 'agente cuelga',
      no_answer: 'no hay respuesta',
      busy: 'ocupado',
      voicemail_reached: 'tiempo maximo',
      max_duration: 'tiempo maximo'
    },
    sentimiento: {
      Positive: 'Positive',
      Negative: 'Negative',
      Neutral: 'Neutral',
      Unknown: 'Neutral'
    }
  },
  typeConversions: {
    duracion_ms: 'float',
    coste_total: 'float',
    coste_voice: 'float',
    cost_llm: 'float',
    cost_knowledge: 'float',
    llm_tockens: 'integer',
    'latency:total': 'float',
    latency_e2e: 'float',
    latency_llm: 'float',
    latency_tts: 'float',
    latency_kb: 'float',
    fecha_inicio: 'timestamp',
    fecha_final: 'timestamp',
    voicemail: 'boolean'
  },
  requiredFields: ['id', 'id_llamada', 'agent_name', 'agent_id', 'fecha_inicio'],
  defaultValues: {
    duracion_ms: 0,
    coste_total: 0.0,
    sentimiento: 'Neutral',
    voicemail: false,
    entrevista: 'no se ha proporcionado esta info',
    Situacion_laboral: 'no se ha proporcionado esta info',
    'Antigüedad_laboral': 'no se ha proporcionado esta info',
    nivel_estudios: 'no se ha proporcionado esta info',
    turno_contacto: 'no se ha proporcionado esta info'
  }
};

// ============================================================================
// Field Mapper Functions
// ============================================================================

function mapFieldName(sourceField, mapping = FIELD_MAPPING_CONFIG) {
  return mapping.fieldMappings[sourceField] || sourceField;
}

function transformValue(fieldName, value, mapping = FIELD_MAPPING_CONFIG) {
  // Handle null/undefined
  if (value === null || value === undefined) {
    return mapping.defaultValues[fieldName] !== undefined
      ? mapping.defaultValues[fieldName]
      : null;
  }

  // Apply value transformations if defined
  if (mapping.valueTransformations[fieldName]) {
    const transformMap = mapping.valueTransformations[fieldName];
    const stringValue = String(value).toLowerCase().replace(/\s+/g, '_');
    
    for (const [key, transformedValue] of Object.entries(transformMap)) {
      if (stringValue === key.toLowerCase() || stringValue.includes(key.toLowerCase())) {
        return transformedValue;
      }
    }
  }

  // Apply type conversions
  const targetField = mapping.fieldMappings[fieldName] || fieldName;
  const targetType = mapping.typeConversions[targetField];

  if (targetType) {
    switch (targetType) {
      case 'float':
        return toFloat(value);
      case 'integer':
        return toInteger(value);
      case 'boolean':
        return toBoolean(value);
      case 'timestamp':
        return toTimestamp(value);
      default:
        return toString(value);
    }
  }

  return value;
}

function mapRecord(sourceRecord, mapping = FIELD_MAPPING_CONFIG) {
  const mappedRecord = {};

  // Map each field
  for (const [sourceField, value] of Object.entries(sourceRecord)) {
    const targetField = mapFieldName(sourceField, mapping);
    const transformedValue = transformValue(sourceField, value, mapping);
    mappedRecord[targetField] = transformedValue;
  }

  // Add default values for missing fields
  for (const [field, defaultValue] of Object.entries(mapping.defaultValues)) {
    if (!(field in mappedRecord)) {
      mappedRecord[field] = defaultValue;
    }
  }

  return mappedRecord;
}

// ============================================================================
// Main Normalization Function
// ============================================================================

/**
 * Normalize agent call data to database schema
 * @param {Array|Object} inputData - Raw agent data (array of records or single record)
 * @param {Object} options - Configuration options
 * @returns {Object} Normalized data with stats
 */
function normalizeData(inputData, options = {}) {
  const startTime = Date.now();
  
  // Ensure input is an array
  let sourceData = Array.isArray(inputData) ? inputData : [inputData];
  
  if (options.verbose) {
    console.log(`📊 Processing ${sourceData.length} record(s)...`);
  }
  
  // Map records
  const normalizedData = sourceData.map(record => mapRecord(record, FIELD_MAPPING_CONFIG));
  
  const endTime = Date.now();
  
  if (options.verbose) {
    console.log(`⏱️  Processing completed in ${endTime - startTime}ms`);
  }
  
  return {
    success: true,
    data: normalizedData,
    stats: {
      recordsProcessed: normalizedData.length,
      processingTimeMs: endTime - startTime
    }
  };
}

// ============================================================================
// File I/O Functions (for standalone usage)
// ============================================================================

function parseAgentData(content) {
  content = content.trim();
  
  // Try parsing as JSON array first
  try {
    const parsed = JSON.parse(content);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [parsed];
  } catch (error) {
    // Try parsing as line-delimited JSON
    const lines = content.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
    
    const records = [];
    
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

function normalizeFromFile(inputPath, outputPath, options = {}) {
  console.log('📂 Reading input file:', inputPath);
  
  const inputContent = fs.readFileSync(inputPath, 'utf-8');
  const sourceData = parseAgentData(inputContent);
  
  const result = normalizeData(sourceData, { ...options, verbose: true });
  
  if (outputPath) {
    console.log('💾 Writing output file:', outputPath);
    fs.writeFileSync(
      outputPath,
      JSON.stringify(result.data, null, 2),
      'utf-8'
    );
  }
  
  return result;
}

// ============================================================================
// CLI Entry Point
// ============================================================================

function main() {
  const args = process.argv.slice(2);
  
  console.log('🚀 n8n Data Normalizer (JavaScript)\n');
  console.log('==================================================\n');
  
  const inputFile = args[0] || path.join(__dirname, '../documentation/example-var-from-agents.json');
  const outputFile = args[1] || path.join(__dirname, '../output/normalized-output.json');
  
  try {
    const result = normalizeFromFile(inputFile, outputFile);
    
    console.log('\n==================================================');
    console.log('✅ Normalization completed successfully!');
    console.log(`   Records processed: ${result.stats.recordsProcessed}`);
    console.log(`   Processing time: ${result.stats.processingTimeMs}ms`);
  } catch (error) {
    console.error('\n❌ Error during normalization:');
    console.error(error);
    process.exit(1);
  }
}

// ============================================================================
// Exports
// ============================================================================

// For n8n or module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    normalizeData,
    normalizeFromFile,
    mapRecord,
    FIELD_MAPPING_CONFIG
  };
}

// Run CLI if executed directly
if (require.main === module) {
  main();
}

