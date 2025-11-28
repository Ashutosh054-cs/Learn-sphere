/**
 * HTML Validator - Production-ready validation engine
 * 
 * Validates user-submitted HTML code against level-specific rules
 * Returns detailed feedback for learning purposes
 */

export const validateHTML = (code, validationRules) => {
  const errors = [];
  const warnings = [];
  let semanticScore = 100;

  try {
    // Parse HTML using DOMParser
    const parser = new DOMParser();
    const doc = parser.parseFromString(code, 'text/html');

    // Check for parsing errors
    const parserErrors = doc.querySelectorAll('parsererror');
    if (parserErrors.length > 0) {
      errors.push('HTML syntax error: Code could not be parsed');
      return { isValid: false, errors, warnings, semanticScore: 0 };
    }

    // Check DOCTYPE (must be HTML5)
    if (!doc.doctype) {
      errors.push('Missing DOCTYPE declaration - add <!DOCTYPE html> at the top');
      semanticScore -= 10;
    } else if (doc.doctype.name.toLowerCase() !== 'html') {
      errors.push('Invalid DOCTYPE - use <!DOCTYPE html> for HTML5');
      semanticScore -= 5;
    }

    // Check required tags with helpful context
    validationRules.requiredTags.forEach(tag => {
      const elements = doc.getElementsByTagName(tag);
      if (elements.length === 0) {
        const context = getTagContext(tag);
        errors.push(`Missing required element: <${tag}>${context ? ' - ' + context : ''}`);
        semanticScore -= 15;
      }
    });

    // Check required attributes
    if (validationRules.requiredAttributes) {
      Object.entries(validationRules.requiredAttributes).forEach(([tag, attrs]) => {
        const elements = doc.getElementsByTagName(tag);
        Array.from(elements).forEach((el, idx) => {
          attrs.forEach(attr => {
            if (!el.hasAttribute(attr)) {
              errors.push(`<${tag}> element ${idx + 1} is missing required attribute: ${attr}`);
              semanticScore -= 10;
            }
          });
        });
      });
    }

    // Check forbidden tags
    if (validationRules.forbiddenTags) {
      validationRules.forbiddenTags.forEach(tag => {
        const elements = doc.getElementsByTagName(tag);
        if (elements.length > 0) {
          errors.push(`Forbidden element used: <${tag}>`);
          semanticScore -= 20;
        }
      });
    }

    // Check nesting depth
    const maxDepth = getMaxNestingDepth(doc.body);
    if (maxDepth > validationRules.maxNesting) {
      warnings.push(`Nesting too deep: ${maxDepth} levels (max: ${validationRules.maxNesting})`);
      semanticScore -= 5;
    }

    // Run semantic rules
    if (validationRules.semanticRules) {
      validationRules.semanticRules.forEach(({ rule, check }) => {
        try {
          if (!check(doc)) {
            errors.push(`Semantic error: ${rule}`);
            semanticScore -= 15;
          }
        } catch (e) {
          warnings.push(`Could not validate rule: ${rule}`);
        }
      });
    }

    // Additional best practice checks
    checkBestPractices(doc, warnings, semanticScore);

    // Ensure semantic score is non-negative
    semanticScore = Math.max(0, semanticScore);

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      semanticScore
    };

  } catch (error) {
    return {
      isValid: false,
      errors: ['Failed to validate HTML: ' + error.message],
      warnings: [],
      semanticScore: 0
    };
  }
};

/**
 * Get helpful context for missing tags
 */
function getTagContext(tag) {
  const contexts = {
    'html': 'wraps the entire document',
    'head': 'contains metadata and goes before <body>',
    'title': 'goes inside <head> and defines page title',
    'body': 'contains all visible content',
    'header': 'defines the top section of a page or article',
    'nav': 'contains navigation links',
    'main': 'wraps the main content of the page',
    'article': 'represents a self-contained composition',
    'section': 'groups related content together',
    'aside': 'content indirectly related to main content',
    'footer': 'defines the bottom section',
    'h1': 'main page heading',
    'ul': 'unordered list',
    'ol': 'ordered list',
    'li': 'list item, goes inside <ul> or <ol>',
    'a': 'link/anchor element',
    'form': 'contains interactive form controls',
    'label': 'text label for form input',
    'input': 'form input field'
  };
  return contexts[tag.toLowerCase()] || '';
}

/**
 * Calculate maximum nesting depth of HTML elements
 */
function getMaxNestingDepth(element, currentDepth = 0) {
  if (!element || !element.children || element.children.length === 0) {
    return currentDepth;
  }

  let maxDepth = currentDepth;
  Array.from(element.children).forEach(child => {
    const depth = getMaxNestingDepth(child, currentDepth + 1);
    maxDepth = Math.max(maxDepth, depth);
  });

  return maxDepth;
}

/**
 * Check HTML best practices
 */
function checkBestPractices(doc, warnings, semanticScore) {
  // Check for empty elements
  const emptyElements = doc.querySelectorAll(':empty:not(br):not(hr):not(img):not(input):not(meta):not(link)');
  if (emptyElements.length > 3) {
    warnings.push('Multiple empty elements detected - consider removing unnecessary tags');
  }

  // Check for missing lang attribute
  const html = doc.querySelector('html');
  if (html && !html.hasAttribute('lang')) {
    warnings.push('HTML element should have a lang attribute for accessibility');
  }

  // Check for inline styles (discourage)
  const elementsWithStyle = doc.querySelectorAll('[style]');
  if (elementsWithStyle.length > 0) {
    warnings.push('Inline styles detected - consider using CSS classes instead');
  }

  // Check for proper alt text on images
  const images = doc.querySelectorAll('img');
  Array.from(images).forEach((img, idx) => {
    const alt = img.getAttribute('alt');
    if (!alt) {
      warnings.push(`Image ${idx + 1} is missing alt text for accessibility`);
    } else if (alt.trim().length === 0) {
      warnings.push(`Image ${idx + 1} has empty alt text - provide description or use alt="" for decorative images`);
    }
  });

  // Check for proper heading hierarchy
  const headings = Array.from(doc.querySelectorAll('h1, h2, h3, h4, h5, h6'));
  if (headings.length > 0) {
    const levels = headings.map(h => parseInt(h.tagName[1]));
    for (let i = 1; i < levels.length; i++) {
      if (levels[i] - levels[i-1] > 1) {
        warnings.push('Heading hierarchy skipped a level - this affects accessibility');
        break;
      }
    }
  }

  // Check for multiple h1 tags (SEO consideration)
  const h1Count = doc.querySelectorAll('h1').length;
  if (h1Count > 1) {
    warnings.push('Multiple <h1> tags detected - typically only one per page for SEO');
  }

  // Check for links without text
  const links = doc.querySelectorAll('a');
  Array.from(links).forEach((link, idx) => {
    if (!link.textContent.trim() && !link.querySelector('img[alt]')) {
      warnings.push(`Link ${idx + 1} has no text content or image alt - add descriptive text`);
    }
  });

  // Check for buttons without type
  const buttons = doc.querySelectorAll('button');
  Array.from(buttons).forEach((btn, idx) => {
    if (!btn.hasAttribute('type')) {
      warnings.push(`Button ${idx + 1} should have a type attribute (button, submit, or reset)`);
    }
  });

  return semanticScore;
}

/**
 * Validate specific HTML structure patterns
 */
export const validateStructure = {
  // Check if element is properly nested within parent
  isNestedIn: (doc, childTag, parentTag) => {
    const child = doc.querySelector(childTag);
    if (!child) return false;
    
    let current = child.parentElement;
    while (current) {
      if (current.tagName.toLowerCase() === parentTag.toLowerCase()) {
        return true;
      }
      current = current.parentElement;
    }
    return false;
  },

  // Check if elements are siblings
  areSiblings: (doc, tag1, tag2) => {
    const el1 = doc.querySelector(tag1);
    const el2 = doc.querySelector(tag2);
    return el1 && el2 && el1.parentElement === el2.parentElement;
  },

  // Count direct children
  countDirectChildren: (doc, parentTag, childTag) => {
    const parent = doc.querySelector(parentTag);
    if (!parent) return 0;
    return Array.from(parent.children).filter(
      child => child.tagName.toLowerCase() === childTag.toLowerCase()
    ).length;
  }
};

/**
 * Get helpful suggestions based on errors
 */
export const getSuggestions = (errors) => {
  const suggestions = [];

  if (errors.some(e => e.includes('DOCTYPE'))) {
    suggestions.push('Add <!DOCTYPE html> as the first line of your code');
  }

  if (errors.some(e => e.includes('Missing required element: <html>'))) {
    suggestions.push('Wrap your entire document in <html> tags');
  }

  if (errors.some(e => e.includes('Missing required element: <head>'))) {
    suggestions.push('Add a <head> section before the <body>');
  }

  if (errors.some(e => e.includes('Missing required element: <title>'))) {
    suggestions.push('Add a <title> tag inside the <head> section');
  }

  if (errors.some(e => e.includes('lang'))) {
    suggestions.push('Add lang="en" attribute to your <html> tag');
  }

  if (errors.some(e => e.includes('Semantic error'))) {
    suggestions.push('Review the semantic structure - elements should be properly nested');
  }

  return suggestions;
};
