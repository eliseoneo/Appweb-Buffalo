/**
 * Data Validator Utility
 * Validates normalized data against schema requirements
 */

import { FieldMapping } from './field-mapper';

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  field: string;
  message: string;
  value?: any;
  recordIndex?: number;
}

export interface ValidationWarning {
  field: string;
  message: string;
  value?: any;
  recordIndex?: number;
}

/**
 * Validate a single record
 */
export function validateRecord(
  record: Record<string, any>,
  mapping: FieldMapping,
  recordIndex?: number
): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  // Check required fields
  for (const requiredField of mapping.requiredFields) {
    const value = record[requiredField];
    
    if (value === null || value === undefined || value === '') {
      errors.push({
        field: requiredField,
        message: `Required field is missing or empty`,
        value,
        recordIndex
      });
    }
  }

  // Validate data types
  for (const [field, expectedType] of Object.entries(mapping.typeConversions)) {
    const value = record[field];
    
    // Skip if null (already handled by required fields check)
    if (value === null || value === undefined) {
      continue;
    }

    const actualType = typeof value;
    
    switch (expectedType) {
      case 'float':
      case 'integer':
      case 'decimal':
        if (actualType !== 'number') {
          warnings.push({
            field,
            message: `Expected number, got ${actualType}`,
            value,
            recordIndex
          });
        }
        break;
        
      case 'boolean':
        if (actualType !== 'boolean') {
          warnings.push({
            field,
            message: `Expected boolean, got ${actualType}`,
            value,
            recordIndex
          });
        }
        break;
        
      case 'timestamp':
        if (actualType !== 'string' || !isValidTimestamp(value)) {
          warnings.push({
            field,
            message: `Invalid timestamp format`,
            value,
            recordIndex
          });
        }
        break;
    }
  }

  // Validate specific field constraints
  validateFieldConstraints(record, errors, warnings, recordIndex);

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validate array of records
 */
export function validateRecords(
  records: Record<string, any>[],
  mapping: FieldMapping
): ValidationResult {
  const allErrors: ValidationError[] = [];
  const allWarnings: ValidationWarning[] = [];

  records.forEach((record, index) => {
    const result = validateRecord(record, mapping, index);
    allErrors.push(...result.errors);
    allWarnings.push(...result.warnings);
  });

  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
    warnings: allWarnings
  };
}

/**
 * Check if value is a valid timestamp
 */
function isValidTimestamp(value: string): boolean {
  try {
    const date = new Date(value);
    return !isNaN(date.getTime());
  } catch {
    return false;
  }
}

/**
 * Validate specific field constraints
 */
function validateFieldConstraints(
  record: Record<string, any>,
  errors: ValidationError[],
  warnings: ValidationWarning[],
  recordIndex?: number
): void {
  // Validate ID format
  if (record.id && typeof record.id === 'string') {
    if (!record.id.startsWith('CALL_')) {
      warnings.push({
        field: 'id',
        message: 'ID should start with "CALL_"',
        value: record.id,
        recordIndex
      });
    }
  }

  // Validate duration is positive
  if (record.duracion_ms !== null && record.duracion_ms !== undefined) {
    if (record.duracion_ms < 0) {
      errors.push({
        field: 'duracion_ms',
        message: 'Duration cannot be negative',
        value: record.duracion_ms,
        recordIndex
      });
    }
  }

  // Validate costs are non-negative
  const costFields = ['coste_total', 'coste_voice', 'cost_llm', 'cost_knowledge'];
  for (const field of costFields) {
    if (record[field] !== null && record[field] !== undefined && record[field] < 0) {
      errors.push({
        field,
        message: 'Cost cannot be negative',
        value: record[field],
        recordIndex
      });
    }
  }

  // Validate sentiment values
  const validSentiments = ['Positive', 'Negative', 'Neutral'];
  if (record.sentimiento && !validSentiments.includes(record.sentimiento)) {
    warnings.push({
      field: 'sentimiento',
      message: `Invalid sentiment value. Expected one of: ${validSentiments.join(', ')}`,
      value: record.sentimiento,
      recordIndex
    });
  }

  // Validate dates (fecha_inicio should be before fecha_final)
  if (record.fecha_inicio && record.fecha_final) {
    const inicio = new Date(record.fecha_inicio);
    const final = new Date(record.fecha_final);
    
    if (inicio > final) {
      errors.push({
        field: 'fecha_final',
        message: 'End date cannot be before start date',
        value: `${record.fecha_inicio} -> ${record.fecha_final}`,
        recordIndex
      });
    }
  }
}

/**
 * Format validation results for display
 */
export function formatValidationResults(result: ValidationResult): string {
  let output = '';

  if (result.isValid) {
    output += '✓ Validation passed!\n';
  } else {
    output += `✗ Validation failed with ${result.errors.length} error(s)\n`;
  }

  if (result.errors.length > 0) {
    output += '\nErrors:\n';
    result.errors.forEach((error, index) => {
      output += `  ${index + 1}. [${error.field}]`;
      if (error.recordIndex !== undefined) {
        output += ` (Record ${error.recordIndex})`;
      }
      output += `: ${error.message}\n`;
      if (error.value !== undefined) {
        output += `     Value: ${JSON.stringify(error.value)}\n`;
      }
    });
  }

  if (result.warnings.length > 0) {
    output += '\nWarnings:\n';
    result.warnings.forEach((warning, index) => {
      output += `  ${index + 1}. [${warning.field}]`;
      if (warning.recordIndex !== undefined) {
        output += ` (Record ${warning.recordIndex})`;
      }
      output += `: ${warning.message}\n`;
      if (warning.value !== undefined) {
        output += `     Value: ${JSON.stringify(warning.value)}\n`;
      }
    });
  }

  return output;
}

/**
 * Get validation summary statistics
 */
export function getValidationSummary(result: ValidationResult): {
  totalErrors: number;
  totalWarnings: number;
  errorsByField: Record<string, number>;
  warningsByField: Record<string, number>;
} {
  const errorsByField: Record<string, number> = {};
  const warningsByField: Record<string, number> = {};

  result.errors.forEach(error => {
    errorsByField[error.field] = (errorsByField[error.field] || 0) + 1;
  });

  result.warnings.forEach(warning => {
    warningsByField[warning.field] = (warningsByField[warning.field] || 0) + 1;
  });

  return {
    totalErrors: result.errors.length,
    totalWarnings: result.warnings.length,
    errorsByField,
    warningsByField
  };
}

