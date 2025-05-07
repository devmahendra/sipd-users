/**
 * Maps PostgreSQL error codes to custom messages and log levels
 * @param {Error} error - The error object thrown by PostgreSQL
 * @returns {{ message: string, level: string }}
 */
const handlePostgresError = (error) => {
    switch (error.code) {
      case '23505': { // unique_violation
        let message = 'Duplicate entry';
        let httpCode = 409; 
        switch (error.constraint) {
          case 'users_username_key':
            message = 'Username already exists';
            break;
          case 'users_email_key':
            message = 'Email already exists';
            break;
        }
        return { message, level: 'warn', httpCode };
      }
  
      case '23502': // not_null_violation
        return {
            message: `Missing required field: ${error.column || 'unknown'}`,
            httpCode: 400,
        };
  
      case '23503': // foreign_key_violation
        return {
            message: 'Related resource not found (foreign key violation)',
            httpCode: 404,
        };
  
      case '23514': // check_violation
        return {
            message: 'Data validation failed (check constraint violation)',
            httpCode: 422,
        };
  
      default:
        return {
            message: error.message || 'Unhandled database error',
            httpCode: 500,
        };
    }
  };
  
  module.exports = {
    handlePostgresError,
  };
  