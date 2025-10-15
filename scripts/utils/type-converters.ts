/**
 * Type Converters Utility
 * Handles conversion of data types for normalization
 */

/**
 * Convert string or number to float
 */
export function toFloat(value: any): number | null {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  
  const num = typeof value === 'string' ? parseFloat(value) : Number(value);
  return isNaN(num) ? null : num;
}

/**
 * Convert string or number to integer
 */
export function toInteger(value: any): number | null {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  
  const num = typeof value === 'string' ? parseInt(value, 10) : Math.floor(Number(value));
  return isNaN(num) ? null : num;
}

/**
 * Convert various formats to boolean
 */
export function toBoolean(value: any): boolean | null {
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

/**
 * Convert string to timestamp
 * Handles multiple date formats
 */
export function toTimestamp(value: any): string | null {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  
  try {
    // If already a valid ISO string, return as is
    if (typeof value === 'string') {
      // Handle PostgreSQL timestamp format: "2025-09-19 10:04:21.1"
      // Or with timezone: "2025-09-19 10:04:33.379+00"
      const date = new Date(value);
      
      if (!isNaN(date.getTime())) {
        // Return in ISO format
        return date.toISOString();
      }
    }
    
    // Try to parse as Date object
    const date = new Date(value);
    if (!isNaN(date.getTime())) {
      return date.toISOString();
    }
  } catch (error) {
    // Invalid date format
    return null;
  }
  
  return null;
}

/**
 * Convert value to string with null handling
 */
export function toString(value: any): string | null {
  if (value === null || value === undefined) {
    return null;
  }
  
  return String(value);
}

/**
 * Normalize decimal numbers to specific precision
 */
export function toDecimal(value: any, precision: number = 2): number | null {
  const num = toFloat(value);
  if (num === null) {
    return null;
  }
  
  return parseFloat(num.toFixed(precision));
}

/**
 * Convert duration from seconds to milliseconds or vice versa
 */
export function convertDuration(value: any, toMs: boolean = false): number | null {
  const num = toFloat(value);
  if (num === null) {
    return null;
  }
  
  return toMs ? num * 1000 : num;
}

