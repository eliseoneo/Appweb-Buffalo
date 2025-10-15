# Data Normalization Guide

Complete guide for using the n8n Data Normalizer to transform agent call data for dashboard integration.

---

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Installation](#installation)
3. [Usage](#usage)
4. [n8n Integration](#n8n-integration)
5. [Field Mappings](#field-mappings)
6. [Troubleshooting](#troubleshooting)
7. [Advanced Configuration](#advanced-configuration)

---

## 🚀 Quick Start

### Prerequisites
- Node.js v16+ installed
- Access to agent call data (JSON format)
- n8n instance (for workflow integration)

### 30-Second Test

```bash
# Navigate to project directory
cd Buffalo-IA-Clean

# Run the JavaScript normalizer on example data
node scripts/n8n-data-normalizer.js documentation/example-var-from-agents-clean.json output/test-output.json

# Check the output
cat output/test-output.json
```

---

## 📦 Installation

### Standalone Usage

No installation required! The JavaScript version (`n8n-data-normalizer.js`) has zero dependencies and runs with standard Node.js.

### TypeScript Version (Development)

If you want to modify the TypeScript source:

```bash
# Install TypeScript (if not already installed)
npm install -g typescript ts-node

# Install type definitions
npm install --save-dev @types/node
```

---

## 💻 Usage

### Command Line

#### Basic Usage

```bash
node scripts/n8n-data-normalizer.js [input-file] [output-file]
```

#### Examples

```bash
# Normalize data with default paths
node scripts/n8n-data-normalizer.js

# Specify custom input and output
node scripts/n8n-data-normalizer.js data/calls.json output/normalized-calls.json

# Process data from n8n webhook
node scripts/n8n-data-normalizer.js webhook-data.json dashboard-ready.json
```

### As a Module

```javascript
// Import the normalizer
const { normalizeData, normalizeFromFile } = require('./scripts/n8n-data-normalizer');

// Option 1: Normalize data in memory
const rawData = [
  {
    id: "CALL_123",
    duration_ms: "15.5",
    lead_name: "John Doe",
    // ... more fields
  }
];

const result = normalizeData(rawData, { verbose: true });
console.log(result.data); // Normalized records

// Option 2: Normalize from file
const fileResult = normalizeFromFile('input.json', 'output.json');
console.log(`Processed ${fileResult.stats.recordsProcessed} records`);
```

### TypeScript Usage

```typescript
import { normalizeData, NormalizationOptions } from './scripts/n8n-data-normalizer';

const options: NormalizationOptions = {
  inputFile: 'data/calls.json',
  outputFile: 'output/normalized.json',
  validate: true,
  verbose: true
};

const result = normalizeFromFile(options);
```

---

## 🔗 n8n Integration

### Method 1: HTTP Request Node (Recommended)

**Use Case:** External normalization service

```json
{
  "nodes": [
    {
      "name": "HTTP Request - Normalize Data",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "method": "POST",
        "url": "http://your-server:3000/normalize",
        "jsonParameters": true,
        "bodyParametersJson": "={{ $json }}",
        "options": {}
      }
    }
  ]
}
```

### Method 2: Code Node (Direct Integration)

**Use Case:** In-workflow processing

Copy the entire contents of `scripts/n8n-data-normalizer.js` into an n8n Code node:

```javascript
// In n8n Code node
// Paste contents of n8n-data-normalizer.js here

// Process the incoming data
const items = $input.all();
const rawData = items.map(item => item.json);

// Normalize
const result = normalizeData(rawData, { verbose: false });

// Return normalized data for next node
return result.data.map(record => ({ json: record }));
```

### Method 3: Execute Command Node

**Use Case:** File-based processing

```json
{
  "nodes": [
    {
      "name": "Normalize Data",
      "type": "n8n-nodes-base.executeCommand",
      "parameters": {
        "command": "node scripts/n8n-data-normalizer.js {{$json[\"input_file\"]}} {{$json[\"output_file\"]}}"
      }
    }
  ]
}
```

### Complete n8n Workflow Example

```
┌─────────────────┐
│  Webhook        │  Receive agent call data
│  Trigger        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Code Node      │  Normalize data using our script
│  (Normalizer)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  PostgreSQL     │  Insert into database
│  Node           │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  HTTP Request   │  Trigger dashboard refresh
│  Node           │
└─────────────────┘
```

### n8n Code Node Template

Create a new Code node in n8n and use this template:

```javascript
// ===== n8n Data Normalizer Code Node =====
// Copy the entire n8n-data-normalizer.js content here
// Then add this execution code at the end:

// Get input data from previous node
const items = $input.all();
console.log(`Received ${items.length} items from previous node`);

// Extract JSON from items
const rawData = items.map(item => item.json);

// Normalize the data
const result = normalizeData(rawData, { verbose: false });

console.log(`Successfully normalized ${result.stats.recordsProcessed} records`);

// Return normalized data in n8n format
return result.data.map(record => ({
  json: record
}));
```

---

## 🗺️ Field Mappings

### Automatic Transformations

The normalizer automatically handles these transformations:

| Source Field | Target Field | Transformation |
|-------------|--------------|----------------|
| `duration_ms` | `duracion_ms` | String → Float |
| `lead_name` | `lead name` | Add space |
| `situacion_laboral` | `Situacion_laboral` | Capitalize |
| `antigüedad_laboral` | `Antigüedad_laboral` | Capitalize + accent |
| `transcripción` | `transcripcion` | Remove accent |
| `MODEL` | `modelo` | Rename + lowercase |
| `user_hangup` | `usuario cuelga` | Translate value |
| `agent_hangup` | `agente cuelga` | Translate value |
| `voicemail_reached` | `tiempo maximo` | Translate value |

### Complete Field Reference

See `scripts/field-mapping.json` for the complete mapping configuration.

### Custom Mappings

To add custom field mappings, edit `scripts/field-mapping.json`:

```json
{
  "fieldMappings": {
    "your_source_field": "target_field_name"
  },
  "valueTransformations": {
    "your_field": {
      "source_value": "target_value"
    }
  }
}
```

---

## 🔍 Data Validation

### Automatic Validation (TypeScript version)

The TypeScript version includes comprehensive validation:

```bash
ts-node scripts/n8n-data-normalizer.ts input.json output.json
```

Validation checks:
- ✓ Required fields present
- ✓ Data types correct
- ✓ Value ranges valid
- ✓ Date formats proper
- ✓ Cross-field consistency

### Validation Output

```
🚀 n8n Data Normalizer

==================================================

📂 Reading input file: input.json
📊 Processing 150 record(s)...
✓ Validating normalized data...

✓ Validation passed!

⏱️  Processing completed in 45ms
   Records processed: 150
   Errors: 0
   Warnings: 3

Warnings:
  1. [sentimiento] (Record 47): Invalid sentiment value
     Value: "Unknown"
  2. [duracion_ms] (Record 89): Duration cannot be negative
     Value: -5.2

==================================================
✅ Normalization completed successfully!
```

---

## 🐛 Troubleshooting

### Common Issues

#### 1. Invalid JSON Format

**Error:** `SyntaxError: Unexpected token`

**Solution:** Ensure your input is valid JSON. Use tools like:
```bash
# Validate JSON
node -e "JSON.parse(require('fs').readFileSync('your-file.json', 'utf-8'))"

# Format JSON
node -e "const fs = require('fs'); const data = JSON.parse(fs.readFileSync('input.json')); fs.writeFileSync('output.json', JSON.stringify(data, null, 2));"
```

#### 2. Missing Required Fields

**Error:** `Required field is missing: id`

**Solution:** Check that your source data includes all required fields:
- `id`
- `id_llamada`
- `agent_name`
- `agent_id`
- `fecha_inicio`

#### 3. Type Conversion Errors

**Warning:** `Expected number, got string`

**Solution:** The normalizer handles this automatically, but if you see persistent warnings, verify your source data types.

#### 4. Date Format Issues

**Error:** `Invalid timestamp format`

**Supported formats:**
- ISO 8601: `2025-09-19T10:04:21.100Z`
- PostgreSQL: `2025-09-19 10:04:21.1`
- With timezone: `2025-09-19 10:04:33.379+00`

```javascript
// Fix date format manually if needed
const fixedDate = new Date(yourDate).toISOString();
```

#### 5. Spanish Characters Issues

**Problem:** Accents not displaying correctly

**Solution:** Ensure UTF-8 encoding:
```bash
# Check file encoding
file -i your-file.json

# Convert if needed
iconv -f ISO-8859-1 -t UTF-8 input.json > output.json
```

### Debug Mode

For detailed debugging, set verbose mode:

```javascript
const result = normalizeData(data, { 
  verbose: true,
  validate: true 
});
```

---

## ⚙️ Advanced Configuration

### Custom Configuration File

Create a custom mapping configuration:

```javascript
const { loadFieldMapping, mapRecords } = require('./scripts/utils/field-mapper');

// Load custom config
const customMapping = loadFieldMapping('./my-custom-mapping.json');

// Use custom mapping
const normalized = mapRecords(sourceData, customMapping);
```

### Batch Processing

Process large datasets in batches:

```javascript
const fs = require('fs');
const { normalizeData } = require('./scripts/n8n-data-normalizer');

const batchSize = 1000;
let allResults = [];

// Read large file
const allData = JSON.parse(fs.readFileSync('large-file.json', 'utf-8'));

// Process in batches
for (let i = 0; i < allData.length; i += batchSize) {
  const batch = allData.slice(i, i + batchSize);
  const result = normalizeData(batch, { verbose: false });
  allResults.push(...result.data);
  
  console.log(`Processed batch ${i / batchSize + 1}`);
}

// Save results
fs.writeFileSync('output.json', JSON.stringify(allResults, null, 2));
```

### Stream Processing (for very large files)

```javascript
const fs = require('fs');
const readline = require('readline');
const { mapRecord, FIELD_MAPPING_CONFIG } = require('./scripts/n8n-data-normalizer');

const readStream = fs.createReadStream('huge-file.jsonl');
const writeStream = fs.createWriteStream('output.jsonl');

const rl = readline.createInterface({
  input: readStream,
  crlfDelay: Infinity
});

rl.on('line', (line) => {
  const record = JSON.parse(line);
  const normalized = mapRecord(record, FIELD_MAPPING_CONFIG);
  writeStream.write(JSON.stringify(normalized) + '\n');
});

rl.on('close', () => {
  console.log('Stream processing complete');
  writeStream.end();
});
```

### Performance Optimization

For high-throughput scenarios:

```javascript
// Disable validation for speed
const result = normalizeData(data, { 
  validate: false,
  verbose: false 
});

// Use Node.js cluster for parallel processing
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
} else {
  // Worker processes normalize data chunks
  // ... your normalization code
}
```

---

## 📊 Output Formats

### Standard Output

```json
[
  {
    "id": "CALL_...",
    "duracion_ms": 12.28,
    "lead name": "John",
    ...
  }
]
```

### n8n Workflow Format

```json
{
  "metadata": {
    "source": "Agent Call Data",
    "normalized_at": "2025-10-15T00:00:00.000Z",
    "total_records": 150
  },
  "data": [ /* normalized records */ ],
  "kpi_summary": { /* aggregated KPIs */ }
}
```

### Database-Ready Format

Use the PostgreSQL INSERT format:

```javascript
const normalized = normalizeData(sourceData);

// Generate INSERT statement
const fields = Object.keys(normalized.data[0]);
const values = normalized.data.map(record => 
  `(${fields.map(f => `'${record[f]}'`).join(', ')})`
).join(',\n');

const sql = `INSERT INTO llamadas (${fields.join(', ')}) VALUES ${values};`;
```

---

## 🔐 Security Considerations

### Input Validation

Always validate input sources:

```javascript
// Validate data source
if (!Array.isArray(data) || data.length === 0) {
  throw new Error('Invalid input data');
}

// Sanitize sensitive fields
const sanitized = data.map(record => ({
  ...record,
  transcripcion: null, // Remove PII
  observaciones: null
}));
```

### n8n Security

When using in n8n workflows:
- Use environment variables for sensitive config
- Enable n8n authentication
- Restrict webhook access
- Use HTTPS for data transmission

---

## 📚 Additional Resources

- [KPI Definitions](./KPI-DEFINITIONS.md) - Complete KPI reference
- [Database Schema](../database/LLAMADAS-TABLE-DOCUMENTATION.md) - Table structure
- [n8n Documentation](https://docs.n8n.io/) - Official n8n docs
- [Project README](../README.md) - Project overview

---

## 🆘 Support

For issues or questions:
1. Check the [Troubleshooting](#troubleshooting) section
2. Review example files in `documentation/`
3. Test with sample data: `documentation/example-var-from-agents-clean.json`
4. Contact the development team

---

**Last Updated:** October 2025  
**Version:** 1.0  
**Maintained by:** Data Engineering Team

