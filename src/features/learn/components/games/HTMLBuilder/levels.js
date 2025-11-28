/**
 * HTML Builder Game - Level Definitions
 * 
 * DATA STRUCTURE:
 * - title: Level name
 * - description: What the user needs to build
 * - instructions: Step-by-step requirements
 * - starterCode: Initial HTML provided
 * - validationRules: Object defining required elements and structure
 * - hints: Array of progressive hints (max 3)
 * - parTime: Target completion time in seconds
 * - xpReward: Base XP for completion
 */

export const LEVELS = [
  {
    id: 1,
    title: "Introduction to HTML",
    description: "Learn the fundamental structure of an HTML document. Every webpage starts with these essential building blocks.",
    instructions: [
      "📚 HTML documents need <!DOCTYPE html> to tell browsers it's HTML5",
      "🌐 The <html> tag wraps everything and should have lang='en' for accessibility",
      "🧠 The <head> contains metadata like <title> that appears in browser tabs",
      "📄 The <body> holds all visible content like headings and paragraphs"
    ],
    starterCode: `<!-- Build your HTML structure here -->\n`,
    validationRules: {
      requiredTags: ['html', 'head', 'title', 'body', 'h1', 'p'],
      requiredAttributes: {
        html: ['lang']
      },
      forbiddenTags: [],
      maxNesting: 5,
      semanticRules: [
        { rule: 'DOCTYPE must be present', check: (doc) => doc.doctype !== null },
        { rule: 'Title must have content', check: (doc) => doc.querySelector('title')?.textContent.length > 0 },
        { rule: 'Body must have content', check: (doc) => doc.querySelector('body')?.children.length > 0 }
      ]
    },
    hints: [
      "Start with <!DOCTYPE html> at the very beginning",
      "The <html> tag should have a lang attribute like lang='en'",
      "The <title> goes inside the <head>, and it should describe your page"
    ],
    parTime: 120,
    xpReward: 10
  },

  {
    id: 2,
    title: "Text Fundamentals",
    description: "Master the essential text formatting tags. Learn how to structure content with headings, paragraphs, and text emphasis.",
    instructions: [
      "📑 Use <h1> for main heading, <h2> for subheadings (h1-h6 available)",
      "📝 Use <p> tags to create paragraphs of text",
      "💪 Use <strong> or <b> for bold text (strong is semantic, b is presentational)",
      "✨ Use <em> or <i> for italic text (em adds emphasis, i is for styling)",
      "🎯 Use <span> to style specific text portions without changing meaning"
    ],
    starterCode: `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <title>Text Formatting Practice</title>\n</head>\n<body>\n  <!-- Create a page with headings, paragraphs, bold, italic, and span -->\n  \n</body>\n</html>`,
    validationRules: {
      requiredTags: ['h1', 'h2', 'p', 'strong', 'em', 'span'],
      requiredAttributes: {},
      forbiddenTags: [],
      maxNesting: 4,
      semanticRules: [
        { rule: 'Must have h1 heading', check: (doc) => doc.querySelector('h1') !== null },
        { rule: 'Must have h2 subheading', check: (doc) => doc.querySelector('h2') !== null },
        { rule: 'Must have at least 2 paragraphs', check: (doc) => doc.querySelectorAll('p').length >= 2 },
        { rule: 'Must have bold text', check: (doc) => doc.querySelector('strong, b') !== null },
        { rule: 'Must have italic text', check: (doc) => doc.querySelector('em, i') !== null }
      ]
    },
    hints: [
      "Use <h1> for your main title, <h2> for a subtitle",
      "Wrap text in <strong> for bold, <em> for italic",
      "Use <span> to mark specific words for later styling"
    ],
    parTime: 150,
    xpReward: 15
  },

  {
    id: 3,
    title: "Links & Navigation",
    description: "Learn to create links that connect pages. Master internal links, external links, and link behavior.",
    instructions: [
      "🔗 Use <a href='url'>Link Text</a> to create clickable links",
      "🏠 Internal links: href='#section' or href='/page.html' for same site",
      "🌍 External links: href='https://example.com' for other websites",
      "🆕 Use target='_blank' to open links in new tabs",
      "♿ Add rel='noopener' with target='_blank' for security"
    ],
    starterCode: `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <title>Navigation Practice</title>\n</head>\n<body>\n  <!-- Create different types of links: internal, external, and new tab -->\n  \n</body>\n</html>`,
    validationRules: {
      requiredTags: ['a', 'nav', 'ul', 'li'],
      requiredAttributes: {
        a: ['href']
      },
      forbiddenTags: [],
      maxNesting: 5,
      semanticRules: [
        { rule: 'Must have internal link', check: (doc) => {
          const links = doc.querySelectorAll('a[href^="#"], a[href^="/"]');
          return links.length >= 1;
        }},
        { rule: 'Must have external link', check: (doc) => {
          const links = doc.querySelectorAll('a[href^="http"]');
          return links.length >= 1;
        }},
        { rule: 'Must have link with target=_blank', check: (doc) => doc.querySelector('a[target="_blank"]') !== null },
        { rule: 'Must have navigation with list', check: (doc) => doc.querySelector('nav ul') !== null }
      ]
    },
    hints: [
      "Create an internal link with href='#section' or href='/about.html'",
      "Create an external link with href='https://google.com'",
      "Add target='_blank' to one link to open in new tab"
    ],
    parTime: 180,
    xpReward: 20
  },

  {
    id: 4,
    title: "Images",
    description: "Learn to embed images in webpages. Master image attributes for accessibility and responsive design.",
    instructions: [
      "🖼️ Use <img src='path/to/image.jpg'> to display images (self-closing tag)",
      "♿ Always add alt='description' for accessibility and SEO",
      "📏 Use width='300' and height='200' to set image dimensions (in pixels)",
      "📱 Width and height prevent layout shift while images load",
      "🎨 The alt text describes the image for screen readers and when image fails to load"
    ],
    starterCode: `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <title>Image Gallery</title>\n</head>\n<body>\n  <!-- Add images with proper src, alt, width, and height attributes -->\n  <h1>My Image Gallery</h1>\n  \n</body>\n</html>`,
    validationRules: {
      requiredTags: ['img', 'h1'],
      requiredAttributes: {
        img: ['src', 'alt']
      },
      forbiddenTags: [],
      maxNesting: 3,
      semanticRules: [
        { rule: 'Must have at least 2 images', check: (doc) => doc.querySelectorAll('img').length >= 2 },
        { rule: 'All images must have alt attribute', check: (doc) => {
          const images = doc.querySelectorAll('img');
          return Array.from(images).every(img => img.hasAttribute('alt'));
        }},
        { rule: 'At least one image must have width', check: (doc) => doc.querySelector('img[width]') !== null },
        { rule: 'Alt text must not be empty', check: (doc) => {
          const images = doc.querySelectorAll('img');
          return Array.from(images).every(img => img.getAttribute('alt').length > 0);
        }}
      ]
    },
    hints: [
      "Use <img src='image.jpg' alt='Description'> to add images",
      "Add width='300' height='200' to set dimensions",
      "Alt text should describe what's in the image"
    ],
    parTime: 180,
    xpReward: 25
  },

  {
    id: 5,
    title: "Lists",
    description: "Master the three types of lists in HTML. Learn when to use ordered, unordered, and description lists.",
    instructions: [
      "📝 <ul> creates Unordered Lists (bullets) with <li> items",
      "🔢 <ol> creates Ordered Lists (numbered) with <li> items",
      "📖 <dl> creates Description Lists with <dt> (term) and <dd> (description) pairs",
      "🎯 Lists can be nested inside each other for sub-items",
      "✨ Use <ul> for items without order, <ol> when sequence matters"
    ],
    starterCode: `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <title>Lists Practice</title>\n</head>\n<body>\n  <!-- Create unordered, ordered, and description lists -->\n  <h1>Types of Lists</h1>\n  \n</body>\n</html>`,
    validationRules: {
      requiredTags: ['ul', 'ol', 'dl', 'li', 'dt', 'dd'],
      requiredAttributes: {},
      forbiddenTags: [],
      maxNesting: 5,
      semanticRules: [
        { rule: 'Must have unordered list', check: (doc) => doc.querySelector('ul') !== null },
        { rule: 'Must have ordered list', check: (doc) => doc.querySelector('ol') !== null },
        { rule: 'Must have description list', check: (doc) => doc.querySelector('dl') !== null },
        { rule: 'Unordered list must have items', check: (doc) => doc.querySelectorAll('ul li').length >= 3 },
        { rule: 'Ordered list must have items', check: (doc) => doc.querySelectorAll('ol li').length >= 3 },
        { rule: 'Description list must have terms', check: (doc) => doc.querySelectorAll('dl dt').length >= 2 },
        { rule: 'Description list must have descriptions', check: (doc) => doc.querySelectorAll('dl dd').length >= 2 }
      ]
    },
    hints: [
      "Create a <ul> with at least 3 <li> items for bullets",
      "Create an <ol> with at least 3 <li> items for numbers",
      "Create a <dl> with <dt> terms and <dd> descriptions"
    ],
    parTime: 240,
    xpReward: 30
  },

  {
    id: 6,
    title: "Tables",
    description: "Learn to create data tables with rows, columns, and headers. Perfect for displaying structured information.",
    instructions: [
      "📊 <table> wraps the entire table structure",
      "📏 <tr> creates table rows (horizontal)",
      "📝 <td> creates table data cells (normal cells)",
      "🏷️ <th> creates table header cells (bold, centered by default)",
      "🎨 Use <thead>, <tbody>, <tfoot> to organize table sections (optional but semantic)"
    ],
    starterCode: `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <title>Data Table</title>\n</head>\n<body>\n  <!-- Create a table with headers and data cells -->\n  <h1>Student Grades</h1>\n  \n</body>\n</html>`,
    validationRules: {
      requiredTags: ['table', 'tr', 'th', 'td'],
      requiredAttributes: {},
      forbiddenTags: [],
      maxNesting: 5,
      semanticRules: [
        { rule: 'Must have table element', check: (doc) => doc.querySelector('table') !== null },
        { rule: 'Must have at least 3 rows', check: (doc) => doc.querySelectorAll('table tr').length >= 3 },
        { rule: 'Must have header row with th', check: (doc) => doc.querySelectorAll('table th').length >= 2 },
        { rule: 'Must have data cells', check: (doc) => doc.querySelectorAll('table td').length >= 4 },
        { rule: 'First row should be headers', check: (doc) => {
          const firstRow = doc.querySelector('table tr');
          return firstRow && firstRow.querySelector('th') !== null;
        }}
      ]
    },
    hints: [
      "Start with <table>, then add <tr> for each row",
      "Use <th> for header cells in the first row",
      "Use <td> for data cells in other rows"
    ],
    parTime: 240,
    xpReward: 35
  },

  {
    id: 7,
    title: "Forms - Part 1",
    description: "Start building interactive forms. Learn the basics of form structure and common input types.",
    instructions: [
      "📋 <form> wraps all form elements (add action='url' and method='POST')",
      "🏷️ <label for='id'>Label Text</label> connects labels to inputs",
      "✏️ <input type='text' id='id' name='name'> for text input",
      "📧 <input type='email'> validates email format",
      "🔒 <input type='password'> hides characters, <input type='number'> for numbers"
    ],
    starterCode: `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <title>Contact Form</title>\n</head>\n<body>\n  <!-- Create a form with text, email, password, and number inputs -->\n  <h1>Contact Us</h1>\n  \n</body>\n</html>`,
    validationRules: {
      requiredTags: ['form', 'label', 'input'],
      requiredAttributes: {
        form: ['action', 'method'],
        input: ['type', 'id', 'name'],
        label: ['for']
      },
      forbiddenTags: [],
      maxNesting: 5,
      semanticRules: [
        { rule: 'Must have form element', check: (doc) => doc.querySelector('form') !== null },
        { rule: 'Must have text input', check: (doc) => doc.querySelector('input[type="text"]') !== null },
        { rule: 'Must have email input', check: (doc) => doc.querySelector('input[type="email"]') !== null },
        { rule: 'Must have password input', check: (doc) => doc.querySelector('input[type="password"]') !== null },
        { rule: 'All inputs must have labels', check: (doc) => {
          const inputs = doc.querySelectorAll('input:not([type="submit"])');
          return Array.from(inputs).every(input => {
            const id = input.getAttribute('id');
            return doc.querySelector(`label[for="${id}"]`);
          });
        }}
      ]
    },
    hints: [
      "Create a <form> with action='/submit' method='POST'",
      "Add <label for='name'>Name:</label> before each input",
      "Connect labels to inputs using matching 'for' and 'id' attributes"
    ],
    parTime: 300,
    xpReward: 40
  },

  {
    id: 8,
    title: "Forms - Part 2",
    description: "Master advanced form inputs. Learn dropdowns, text areas, radio buttons, and checkboxes.",
    instructions: [
      "📝 <textarea rows='5' cols='30'> for multi-line text input",
      "📋 <select><option>Choice 1</option></select> creates dropdown menus",
      "🔘 <input type='radio' name='group'> for single choice (same name groups them)",
      "☑️ <input type='checkbox' name='item'> for multiple selections",
      "✅ <button type='submit'>Submit</button> or <input type='reset'> for form actions"
    ],
    starterCode: `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <title>Survey Form</title>\n</head>\n<body>\n  <!-- Create a form with textarea, select, radio, checkbox, and buttons -->\n  <h1>User Survey</h1>\n  \n</body>\n</html>`,
    validationRules: {
      requiredTags: ['form', 'label', 'textarea', 'select', 'option', 'input', 'button'],
      requiredAttributes: {
        form: ['action', 'method']
      },
      forbiddenTags: [],
      maxNesting: 6,
      semanticRules: [
        { rule: 'Must have textarea', check: (doc) => doc.querySelector('textarea') !== null },
        { rule: 'Must have select dropdown', check: (doc) => doc.querySelector('select') !== null },
        { rule: 'Select must have options', check: (doc) => doc.querySelectorAll('select option').length >= 2 },
        { rule: 'Must have radio buttons', check: (doc) => doc.querySelectorAll('input[type="radio"]').length >= 2 },
        { rule: 'Must have checkbox', check: (doc) => doc.querySelector('input[type="checkbox"]') !== null },
        { rule: 'Must have submit button', check: (doc) => {
          return doc.querySelector('button[type="submit"]') || doc.querySelector('input[type="submit"]');
        }}
      ]
    },
    hints: [
      "Create <textarea rows='5' cols='30'> for multi-line input",
      "Create <select> with multiple <option> children",
      "Radio buttons with same 'name' create a group (only one selectable)"
    ],
    parTime: 360,
    xpReward: 45
  },

  {
    id: 9,
    title: "Semantic HTML",
    description: "Learn HTML5 semantic tags that give meaning to page structure. These improve SEO and accessibility.",
    instructions: [
      "📰 <header> for top section with logo/navigation",
      "🧭 <nav> specifically for navigation menus and links",
      "📄 <section> for thematic grouping of content",
      "📰 <article> for self-contained content like blog posts",
      "🦶 <footer> for bottom section with copyright/links, <aside> for sidebars"
    ],
    starterCode: `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <title>Semantic Page</title>\n</head>\n<body>\n  <!-- Build a page using semantic tags: header, nav, section, article, aside, footer -->\n  \n</body>\n</html>`,
    validationRules: {
      requiredTags: ['header', 'nav', 'section', 'article', 'aside', 'footer'],
      requiredAttributes: {},
      forbiddenTags: [],
      maxNesting: 6,
      semanticRules: [
        { rule: 'Must have header element', check: (doc) => doc.querySelector('header') !== null },
        { rule: 'Must have nav element', check: (doc) => doc.querySelector('nav') !== null },
        { rule: 'Must have section element', check: (doc) => doc.querySelector('section') !== null },
        { rule: 'Must have article element', check: (doc) => doc.querySelector('article') !== null },
        { rule: 'Must have aside element', check: (doc) => doc.querySelector('aside') !== null },
        { rule: 'Must have footer element', check: (doc) => doc.querySelector('footer') !== null },
        { rule: 'Nav should be in header', check: (doc) => doc.querySelector('header nav') !== null }
      ]
    },
    hints: [
      "Use <header> for the top section with logo and navigation",
      "Put <nav> inside <header> for navigation links",
      "Use <section> and <article> for main content, <aside> for sidebar, <footer> for bottom"
    ],
    parTime: 420,
    xpReward: 50
  },

  {
    id: 10,
    title: "Media & Embeds",
    description: "Final level: Embed audio, video, and external content. Learn modern media elements and iframe usage.",
    instructions: [
      "🎵 <audio controls src='audio.mp3'>Your browser doesn't support audio</audio>",
      "🎬 <video controls width='640' height='360' src='video.mp4'>No support</video>",
      "▶️ Add controls attribute to show play/pause buttons",
      "🪟 <iframe src='https://example.com' width='600' height='400'> embeds external pages",
      "🎯 Use iframe for YouTube videos, Google Maps, etc. Always set width and height"
    ],
    starterCode: `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <title>Media Page</title>\n</head>\n<body>\n  <!-- Add audio, video, and iframe elements -->\n  <h1>Multimedia Content</h1>\n  \n</body>\n</html>`,
    validationRules: {
      requiredTags: ['audio', 'video', 'iframe'],
      requiredAttributes: {
        audio: ['src'],
        video: ['src'],
        iframe: ['src']
      },
      forbiddenTags: [],
      maxNesting: 4,
      semanticRules: [
        { rule: 'Must have audio element', check: (doc) => doc.querySelector('audio') !== null },
        { rule: 'Must have video element', check: (doc) => doc.querySelector('video') !== null },
        { rule: 'Must have iframe element', check: (doc) => doc.querySelector('iframe') !== null },
        { rule: 'Audio must have controls', check: (doc) => {
          const audio = doc.querySelector('audio');
          return audio && audio.hasAttribute('controls');
        }},
        { rule: 'Video must have controls', check: (doc) => {
          const video = doc.querySelector('video');
          return video && video.hasAttribute('controls');
        }},
        { rule: 'Video must have dimensions', check: (doc) => {
          const video = doc.querySelector('video');
          return video && (video.hasAttribute('width') || video.hasAttribute('height'));
        }}
      ]
    },
    hints: [
      "Add <audio controls src='song.mp3'>Fallback text</audio>",
      "Add <video controls width='640' height='360' src='video.mp4'>Fallback</video>",
      "Add <iframe src='https://www.youtube.com/embed/...' width='560' height='315'></iframe>"
    ],
    parTime: 300,
    parTime: 300,
    xpReward: 100
  }
];

// Helper function to get level by ID
export const getLevelById = (id) => LEVELS.find(level => level.id === id);

// Helper function to get next level
export const getNextLevel = (currentId) => {
  const currentIndex = LEVELS.findIndex(level => level.id === currentId);
  return currentIndex < LEVELS.length - 1 ? LEVELS[currentIndex + 1] : null;
};

// Calculate total possible XP
export const TOTAL_POSSIBLE_XP = LEVELS.reduce((sum, level) => sum + level.xpReward, 0);
