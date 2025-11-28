/**
 * CSS Selector Validation Engine
 * Validates user CSS selectors against target elements
 */

export class SelectorEngine {
  /**
   * Validate a CSS selector against correct answers
   * @param {string} userSelector - The selector written by the user
   * @param {string[]} correctSelectors - Array of valid selector solutions
   * @param {string} htmlStructure - HTML string to test against
   * @returns {object} Validation result with isValid, message, efficiency, matchedElements
   */
  static validateSelector(userSelector, correctSelectors, htmlStructure) {
    if (!userSelector || userSelector.trim() === '') {
      return {
        isValid: false,
        message: 'Please enter a CSS selector.',
        efficiency: 0,
        matchedElements: []
      };
    }

    // Create a virtual DOM to test selectors
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlStructure, 'text/html');

    let userMatches = [];
    let isValidSyntax = true;

    // Try to execute user's selector
    try {
      userMatches = Array.from(doc.querySelectorAll(userSelector));
    } catch (e) {
      return {
        isValid: false,
        message: `Invalid CSS selector syntax: ${e.message}`,
        efficiency: 0,
        matchedElements: []
      };
    }

    // Get matches from the optimal/correct selector
    let correctMatches = [];
    try {
      // Use the first correct selector as the baseline
      correctMatches = Array.from(doc.querySelectorAll(correctSelectors[0]));
    } catch (e) {
      console.error('Error with correct selector:', e);
    }

    // Check if user matched the same elements
    const userMatchesSet = new Set(userMatches);
    const correctMatchesSet = new Set(correctMatches);

    const matchedCount = [...userMatchesSet].filter(el => correctMatchesSet.has(el)).length;
    const totalCorrect = correctMatchesSet.size;

    const isValid = matchedCount === totalCorrect && userMatchesSet.size === correctMatchesSet.size;

    // Calculate efficiency (shorter selectors = more efficient)
    const efficiency = isValid
      ? Math.min(100, Math.round((correctSelectors[0].length / Math.max(1, userSelector.length)) * 100))
      : Math.round((matchedCount / Math.max(1, totalCorrect)) * 100);

    let message = '';
    if (!isValid) {
      if (userMatchesSet.size === 0) {
        message = 'Your selector matches 0 elements. Try again!';
      } else if (userMatchesSet.size > correctMatchesSet.size) {
        message = `Your selector matches too many elements (${userMatchesSet.size} instead of ${correctMatchesSet.size}).`;
      } else if (userMatchesSet.size < correctMatchesSet.size) {
        message = `Your selector matches too few elements (${userMatchesSet.size} instead of ${correctMatchesSet.size}).`;
      } else {
        message = 'Your selector matches the wrong elements.';
      }
    } else {
      message = 'Perfect match! Well done! 🎉';
    }

    return {
      isValid,
      message,
      efficiency,
      matchedElements: userMatches.map(el => el.tagName.toLowerCase())
    };
  }

  /**
   * Get hints for a specific level
   * @param {number} hintIndex - Which hint to show
   * @param {object} level - Level object with hints array
   * @returns {string} Hint text
   */
  static getHint(hintIndex, level) {
    if (hintIndex >= 0 && hintIndex < level.hints.length) {
      return level.hints[hintIndex];
    }
    return '';
  }

  /**
   * Check if selector is optimal (matches one of the correct solutions exactly)
   * @param {string} userSelector
   * @param {string[]} correctSelectors
   * @returns {boolean}
   */
  static isOptimal(userSelector, correctSelectors) {
    const normalized = userSelector.trim().replace(/\s+/g, ' ');
    return correctSelectors.some(
      correct => correct.trim().replace(/\s+/g, ' ') === normalized
    );
  }
}
