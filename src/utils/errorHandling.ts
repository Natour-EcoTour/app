import Toast from 'react-native-toast-message';

export interface ApiError {
  status: number;
  data: any;
  isValidationError: boolean;
  isNetworkError: boolean;
  isUnauthorized: boolean;
}

/**
 * Formats error messages with line breaks for better readability
 * @param message - The error message to format
 * @param maxLineLength - Maximum length before breaking (default: 60)
 * @returns Formatted message with line breaks
 */
export const formatErrorMessage = (message: string, maxLineLength: number = 60): string => {
  if (!message || message.length <= maxLineLength) {
    return message;
  }

  return message
    .replace(/(\. )/g, '.\n') // Break after periods
    .replace(/(, )/g, ',\n') // Break after commas for long lists
    .replace(/( e )/g, '\ne ') // Break before "e" (and)
    .replace(/( ou )/g, '\nou ') // Break before "ou" (or)
    .replace(/( que )/g, '\nque ') // Break before "que" (that)
    .replace(/( para )/g, '\npara ') // Break before "para" (for/to)
    .replace(/( com )/g, '\ncom ') // Break before "com" (with)
    .trim();
};

/**
 * Standardizes error handling for API responses
 * @param error - The error object from axios
 * @returns Standardized error object
 */
export const handleApiError = (error: any): ApiError => {
  const isNetworkError = !error.response;
  const isUnauthorized = error.response?.status === 401;
  const isValidationError = error.response?.status === 400;
  
  return {
    status: error.response?.status || 0,
    data: error.response?.data || null,
    isValidationError,
    isNetworkError,
    isUnauthorized,
    ...error
  };
};

/**
 * Displays validation errors from API response with formatted line breaks
 * @param errorData - The error data object from API
 * @param defaultTitle - Default title for the toast
 * @param showAllErrors - Whether to show all errors or just the first one
 */
export const displayValidationErrors = (
  errorData: any, 
  defaultTitle: string = 'Erro de validação',
  showAllErrors: boolean = false
) => {
  if (!errorData || typeof errorData !== 'object') {
    Toast.show({
      type: 'error',
      text1: defaultTitle,
      text2: 'Erro desconhecido',
    });
    return;
  }

  // Get the fields with errors
  const fields = Object.keys(errorData);
  if (fields.length === 0) {
    Toast.show({
      type: 'error',
      text1: defaultTitle,
      text2: 'Erro de validação',
    });
    return;
  }

  if (showAllErrors && fields.length > 1) {
    // Show all errors in one toast
    const allErrors = fields
      .map(field => {
        const fieldErrors = errorData[field];
        const errorMessage = Array.isArray(fieldErrors) ? fieldErrors[0] : fieldErrors;
        const fieldNameMap: Record<string, string> = {
          username: 'Nome de usuário',
          email: 'E-mail',
          password: 'Senha',
          name: 'Nome',
        };
        const friendlyFieldName = fieldNameMap[field] || field;
        return `${friendlyFieldName}: ${errorMessage}`;
      })
      .join('\n\n');

    Toast.show({
      type: 'error',
      text1: defaultTitle,
      text2: formatErrorMessage(allErrors, 80),
    });
  } else {
    // Show only the first error
    const firstField = fields[0];
    const fieldErrors = errorData[firstField];
    
    // Handle different error formats
    let errorMessage = '';
    if (Array.isArray(fieldErrors)) {
      errorMessage = fieldErrors[0];
    } else if (typeof fieldErrors === 'string') {
      errorMessage = fieldErrors;
    } else {
      errorMessage = 'Erro de validação';
    }

    // Add line breaks for long messages to improve readability
    const formattedErrorMessage = formatErrorMessage(errorMessage);

    // Create a user-friendly field name
    const fieldNameMap: Record<string, string> = {
      username: 'Nome de usuário',
      email: 'E-mail',
      password: 'Senha',
      name: 'Nome',
      // Add more field mappings as needed
    };

    const friendlyFieldName = fieldNameMap[firstField] || firstField;

    Toast.show({
      type: 'error',
      text1: `Erro no ${friendlyFieldName.toLowerCase()}`,
      text2: formattedErrorMessage,
    });
  }
};

/**
 * Returns the exact error structure from API
 * @param errorData - The error data object from API
 * @returns The exact error structure
 */
export const getExactError = (errorData: any) => {
  return errorData;
};

/**
 * Gets all validation errors for a specific field
 * @param errorData - The error data object from API
 * @param fieldName - The field name to get errors for
 * @returns Array of error messages for the field
 */
export const getFieldErrors = (errorData: any, fieldName: string): string[] => {
  if (!errorData || !errorData[fieldName]) {
    return [];
  }

  const fieldErrors = errorData[fieldName];
  if (Array.isArray(fieldErrors)) {
    return fieldErrors;
  } else if (typeof fieldErrors === 'string') {
    return [fieldErrors];
  }

  return [];
};
