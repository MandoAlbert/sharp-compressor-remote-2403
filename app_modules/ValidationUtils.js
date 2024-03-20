export default class ValidationUtils {
  /**
   * Validates an integer input within an optional minimum and maximum range.
   *
   * @param {any} input - The value to validate.
   * @param {number} min - The minimum allowed integer value (optional).
   * @param {number} max - The maximum allowed integer value (optional).
   * @returns {boolean} True if the input is a valid integer within the range, false otherwise.
   */
  static isInteger(input, min = -Infinity, max = Infinity) {
    // Validate input as an integer using Number.isInteger
    if (!Number.isInteger(input)) {
      return false;
    }

    // Check if the integer is within the specified range
    return input >= min && input <= max;
  }

  /**
  * Validates a string as a valid image URL with allowed extensions.
  *
  * @param {string} url - The image URL string to validate.
  * @param {array} allowedExtensions - Allowed image extensions.
  * @returns {boolean} True if the URL is valid and has an allowed extension, false otherwise.
  */
  static isValidImageUrl(url, allowedExtensions = ['jpg', 'jpeg', 'png']) {
    // Check if the URL is a valid URL format
    if (!url || !url.trim()) {
      return false;
    }

    try {
      new URL(url);
    } catch (error) {
      return false;
    }

    // Extract the file extension from the URL
    const extension = url.split('.').pop().toLowerCase();

    // Check if the extension is allowed
    return allowedExtensions.includes(extension);
  }

  /**
   * Validates a required value.
   *
   * @param {any} value - The value to check.
   * @returns {boolean} True if the value exists and is not empty, false otherwise.
   */
  static exists(value) {
    // Check for undefined, null, empty string, or whitespace-only string
    return value !== undefined && value !== null && value.toString().trim() !== '';
  }

  /**
   * Validates a string and optionally checks its length within a range.
   *
   * @param {string} text - The string to validate.
   * @param {number} minLength=0 - The minimum allowed length of the string (default: 0).
   * @param {number} maxLength=Infinity - The maximum allowed length of the string (default: Infinity, no upper limit).
   * @returns {boolean} True if the input is a valid string (even empty) and meets the length criteria (if provided), False otherwise.
   */
  static isString(text, minLength = 0, maxLength = Infinity) {
    // Check if the input is a string
    if (!text || typeof text !== 'string') {
      return false;
    }

    // Validate length if both minLength and maxLength are provided
    if (maxLength !== Infinity) {
      if (text.length < minLength || text.length > maxLength) {
        return false;
      }
    } else {
      // Validate length if only minLength is provided
      if (text.length < minLength) {
        return false;
      }
    }

    // Valid string, even if empty
    return true;
  }

  /**
   * Validates if a string exists within a provided array of valid values.
   *
   * @param {string} value - The string to validate.
   * @param {string[]} validValues - An array of valid strings to compare against.
   * @returns {boolean} True if the string is present in the validValues array, false otherwise.
   */
  static existsIn(value, validValues) {
    // Check if value is a string and validValues is an array (not empty)
    if (typeof value !== 'string' || !Array.isArray(validValues) || !validValues.length) {
      return false;
    }

    // Convert all values to lowercase for case-insensitive comparison
    const lowercaseValues = validValues.map(val => val.toLowerCase());

    // Check if the lowercase version of the value exists in the lowercase array
    return lowercaseValues.includes(value.toLowerCase());
  }
}