/**
 * Field Mapper Utility
 * Maps agent field names to database schema field names
 */

import * as typeConverters from './type-converters';

export interface FieldMapping {
  fieldMappings: Record<string, string>;
  valueTransformations: Record<string, Record<string, string>>;
  typeConversions: Record<string, string>;
  requiredFields: string[];
  defaultValues: Record<string, any>;
}

/**
 * Load field mapping configuration
 */
export function loadFieldMapping(configPath: string): FieldMapping {
  const fs = require('fs');
  const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  return config;
}

/**
 * Map a single field from agent format to database format
 */
export function mapFieldName(sourceField: string, mapping: FieldMapping): string {
  return mapping.fieldMappings[sourceField] || sourceField;
}

/**
 * Transform field value according to mapping rules
 */
export function transformValue(
  fieldName: string,
  value: any,
  mapping: FieldMapping
): any {
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
    
    // Try to find a matching transformation
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
        return typeConverters.toFloat(value);
      case 'integer':
        return typeConverters.toInteger(value);
      case 'boolean':
        return typeConverters.toBoolean(value);
      case 'timestamp':
        return typeConverters.toTimestamp(value);
      case 'decimal':
        return typeConverters.toDecimal(value, 2);
      default:
        return typeConverters.toString(value);
    }
  }

  return value;
}

/**
 * Map entire record from agent format to database format
 */
export function mapRecord(
  sourceRecord: Record<string, any>,
  mapping: FieldMapping
): Record<string, any> {
  const mappedRecord: Record<string, any> = {};

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

/**
 * Map array of records
 */
export function mapRecords(
  sourceRecords: Record<string, any>[],
  mapping: FieldMapping
): Record<string, any>[] {
  return sourceRecords.map(record => mapRecord(record, mapping));
}

/**
 * Get list of all expected database fields
 */
export function getExpectedFields(mapping: FieldMapping): string[] {
  return Object.values(mapping.fieldMappings);
}

/**
 * Normalize Spanish text (handle accents and special characters)
 */
export function normalizeSpanishText(text: string): string {
  if (!text) return text;
  
  // This preserves Spanish characters but normalizes whitespace
  return text.trim().replace(/\s+/g, ' ');
}

