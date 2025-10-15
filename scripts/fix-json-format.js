const fs = require('fs');

// Read the original file
let content = fs.readFileSync('documentation/example-var-from-agents.json', 'utf-8');

// Remove any trailing commas and whitespace
content = content.trim();

// Wrap in array brackets if not already
if (!content.startsWith('[')) {
  content = '[' + content;
}

if (!content.endsWith(']')) {
  // Remove trailing comma if present
  content = content.replace(/,\s*$/, '');
  content = content + ']';
}

// Write the fixed version
fs.writeFileSync('documentation/example-var-from-agents-array.json', content);

// Validate it
try {
  const data = JSON.parse(content);
  console.log('✓ Valid JSON! Records:', data.length);
  console.log('Sample keys:', Object.keys(data[0]).slice(0, 5).join(', '));
} catch (error) {
  console.error('✗ Invalid JSON:', error.message);
  process.exit(1);
}

