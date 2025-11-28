/**
 * CSS Battle - Level Definitions
 * 12 progressive levels teaching CSS from basics to advanced
 */

export const CSS_BATTLE_LEVELS = [
  // ========== BEGINNER LEVELS (1-4) ==========
  {
    id: 1,
    title: "CSS Basics",
    description: "Learn the three ways to add CSS and understand basic selectors. Foundation of all styling!",
    difficulty: "Easy",
    instructions: [
      "🎨 Three ways to add CSS: Inline (style=''), Internal (<style>), External (<link>)",
      "🎯 Selectors target HTML elements: element, .class, #id",
      "📝 Write 'p' to select all paragraphs",
      "✨ Class selectors start with dot (.), ID selectors with hash (#)"
    ],
    targetElements: ['p'],
    htmlStructure: `
      <div class="container">
        <h1>CSS Basics</h1>
        <p>This is a paragraph.</p>
        <p class="highlight">Important paragraph.</p>
        <span>This is a span.</span>
        <p id="special">Special paragraph!</p>
      </div>
    `,
    correctSelectors: ['p'],
    optimalSelector: 'p',
    hints: [
      "Element selectors use just the tag name",
      "Type 'p' to select all paragraph elements",
      "No dots or hashes needed for element selectors"
    ],
    selectorReference: {
      title: "CSS Basics - Adding Styles",
      items: [
        { code: "style='color: red'", description: "Inline CSS (directly on element)" },
        { code: "<style>p { }</style>", description: "Internal CSS (in <head> tag)" },
        { code: "<link href='style.css'>", description: "External CSS (separate file)" },
        { code: "element", description: "Select by tag name (p, div, h1)" }
      ],
      tip: "Type just 'p' to select all paragraph elements!"
    },
    parTime: 30,
    xpReward: 50
  },

  {
    id: 2,
    title: "Colors & Backgrounds",
    description: "Master color and background-color properties. Learn color formats: names, hex, rgb.",
    difficulty: "Easy",
    instructions: [
      "🎨 color property changes text color",
      "🖼️ background-color changes element background",
      "🌈 Color formats: 'red', '#ff0000', 'rgb(255,0,0)'",
      "✨ Select elements with class 'highlight' using .highlight"
    ],
    targetElements: ['.highlight'],
    htmlStructure: `
      <div class="page">
        <p class="highlight">Highlighted text</p>
        <p>Regular text</p>
        <span class="highlight">Also highlighted</span>
        <div class="box">
          <p class="highlight">Nested highlight</p>
        </div>
      </div>
    `,
    correctSelectors: ['.highlight'],
    optimalSelector: '.highlight',
    hints: [
      "Class selectors start with a dot (.)",
      "The class name is 'highlight'",
      "Answer: .highlight"
    ],
    selectorReference: {
      title: "Colors & Backgrounds",
      items: [
        { code: "color: red", description: "Named colors (red, blue, green)" },
        { code: "color: #ff0000", description: "Hex colors (#RRGGBB format)" },
        { code: "color: rgb(255,0,0)", description: "RGB colors (0-255 per channel)" },
        { code: "background-color", description: "Element background color" },
        { code: ".class", description: "Select by class attribute" }
      ],
      tip: "Class selectors start with a dot: .highlight"
    },
    parTime: 30,
    xpReward: 50
  },

  {
    id: 3,
    title: "Fonts & Text",
    description: "Control typography with font-size, font-family, text-align, and line-height.",
    difficulty: "Easy",
    instructions: [
      "📏 font-size: Controls text size (px, em, rem, %)",
      "🔤 font-family: Sets font type ('Arial', 'Georgia', sans-serif)",
      "📐 text-align: Aligns text (left, center, right, justify)",
      "📊 line-height: Space between lines (1.5, 2, etc.)",
      "🎯 Select the element with id 'header' using #header"
    ],
    targetElements: ['#header'],
    htmlStructure: `
      <div class="page">
        <header id="header">Main Header</header>
        <nav id="navigation">
          <a href="#">Link 1</a>
          <a href="#">Link 2</a>
        </nav>
        <main id="content">
          <p>Page content here</p>
        </main>
      </div>
    `,
    correctSelectors: ['#header'],
    optimalSelector: '#header',
    hints: [
      "ID selectors start with a hash (#)",
      "The ID is 'header'",
      "Answer: #header"
    ],
    selectorReference: {
      title: "Typography Properties",
      items: [
        { code: "font-size: 16px", description: "Set text size (px, em, rem, %)" },
        { code: "font-family: Arial", description: "Choose font ('Arial', sans-serif)" },
        { code: "text-align: center", description: "Align text (left, center, right)" },
        { code: "line-height: 1.5", description: "Space between text lines" },
        { code: "#id", description: "Select by ID attribute (unique)" }
      ],
      tip: "ID selectors start with #: #header"
    },
    parTime: 30,
    xpReward: 50
  },

  // ========== INTERMEDIATE LEVELS (4-8) ==========
  {
    id: 4,
    title: "Box Model",
    description: "Understand margin, padding, and border - the foundation of layout and spacing.",
    difficulty: "Medium",
    instructions: [
      "📦 Box Model: Content → Padding → Border → Margin (inside to outside)",
      "📏 margin: Space outside element (margin: 10px or margin-top: 10px)",
      "🎨 padding: Space inside element between content and border",
      "🖼️ border: Element outline (border: 1px solid black)",
      "🎯 Select all paragraphs inside .content using descendant selector"
    ],
    targetElements: ['.content p'],
    htmlStructure: `
      <div class="page">
        <p>Not in content</p>
        <div class="content">
          <p>Inside content</p>
          <div class="nested">
            <p>Deeply nested in content</p>
          </div>
        </div>
        <p>Also not in content</p>
      </div>
    `,
    correctSelectors: ['.content p', 'div.content p'],
    optimalSelector: '.content p',
    hints: [
      "Descendant combinator uses a space between selectors",
      "Format: parent descendant",
      "Answer: .content p"
    ],
    selectorReference: {
      title: "Box Model Properties",
      items: [
        { code: "margin: 10px", description: "Space OUTSIDE element" },
        { code: "padding: 10px", description: "Space INSIDE element" },
        { code: "border: 1px solid", description: "Element outline/border" },
        { code: "parent descendant", description: "Space = select all descendants" }
      ],
      tip: "Box Model order: Content → Padding → Border → Margin"
    },
    parTime: 45,
    xpReward: 60
  },

  {
    id: 5,
    title: "Display & Position",
    description: "Control element flow with display (inline, block, none) and positioning (relative, absolute, fixed).",
    difficulty: "Medium",
    instructions: [
      "🧱 display: inline (flows with text), block (takes full width), none (hidden)",
      "📍 position: static (default), relative (offset from normal), absolute (offset from parent)",
      "📌 position: fixed (stays in viewport), sticky (hybrid)",
      "🎯 Select direct children <li> of .menu using child combinator >"
    ],
    targetElements: ['.menu > li'],
    htmlStructure: `
      <ul class="menu">
        <li>Item 1</li>
        <li>Item 2
          <ul>
            <li>Nested item (not selected)</li>
          </ul>
        </li>
        <li>Item 3</li>
      </ul>
    `,
    correctSelectors: ['.menu > li', 'ul.menu > li'],
    optimalSelector: '.menu > li',
    hints: [
      "Direct child combinator is the > symbol",
      "Only selects immediate children, not grandchildren",
      "Answer: .menu > li"
    ],
    selectorReference: {
      title: "Display & Position",
      items: [
        { code: "display: block", description: "Full width, new line" },
        { code: "display: inline", description: "Flows with text" },
        { code: "display: none", description: "Hide element completely" },
        { code: "position: relative", description: "Offset from normal position" },
        { code: "position: absolute", description: "Offset from parent" },
        { code: "parent > child", description: "> = select direct children only" }
      ],
      tip: "Use > to select only immediate children, not all descendants"
    },
    parTime: 45,
    xpReward: 60
  },

  {
    id: 6,
    title: "Flexbox Basics",
    description: "Master modern layout with display: flex, justify-content, and align-items.",
    difficulty: "Medium",
    instructions: [
      "🔲 display: flex makes container use flexbox layout",
      "↔️ justify-content: Align items horizontally (flex-start, center, flex-end, space-between)",
      "↕️ align-items: Align items vertically (flex-start, center, flex-end, stretch)",
      "🎯 Select <p> that comes immediately after <h2> using adjacent sibling +"
    ],
    targetElements: ['h2 + p'],
    htmlStructure: `
      <article>
        <h2>Section Title</h2>
        <p>First paragraph (this one!)</p>
        <p>Second paragraph (not this)</p>
        <h2>Another Section</h2>
        <p>Another first paragraph (this too!)</p>
      </article>
    `,
    correctSelectors: ['h2 + p'],
    optimalSelector: 'h2 + p',
    hints: [
      "Adjacent sibling combinator is the + symbol",
      "Selects the element immediately after another",
      "Try: h2 + p"
    ],
    selectorReference: {
      title: "Flexbox Layout",
      items: [
        { code: "display: flex", description: "Enable flexbox layout" },
        { code: "justify-content", description: "Horizontal alignment (row)" },
        { code: "align-items", description: "Vertical alignment (column)" },
        { code: "flex-start", description: "Align to start" },
        { code: "center", description: "Center items" },
        { code: "element + sibling", description: "+ = select next sibling" }
      ],
      tip: "Adjacent sibling (+) selects element immediately after another"
    },
    parTime: 60,
    xpReward: 70
  },

  // ========== ADVANCED LEVELS (7-12) ==========
  {
    id: 7,
    title: "Flexbox Advanced",
    description: "Deep dive into flex-direction, flex-wrap, and gap for complex layouts.",
    difficulty: "Medium",
    instructions: [
      "🔄 flex-direction: row (default), column, row-reverse, column-reverse",
      "📦 flex-wrap: nowrap (default), wrap, wrap-reverse (control overflow)",
      "📏 gap: Space between flex items (gap: 10px or row-gap/column-gap)",
      "🎯 Select input elements with type='text' using attribute selector"
    ],
    targetElements: ['input[type="text"]'],
    htmlStructure: `
      <form>
        <input type="text" placeholder="Name">
        <input type="email" placeholder="Email">
        <input type="text" placeholder="Username">
        <input type="password" placeholder="Password">
        <button type="submit">Submit</button>
      </form>
    `,
    correctSelectors: ['input[type="text"]', '[type="text"]'],
    optimalSelector: 'input[type="text"]',
    hints: [
      "Attribute selectors use square brackets []",
      "Format: element[attribute='value']",
      "Answer: input[type='text']"
    ],
    selectorReference: {
      title: "Advanced Flexbox",
      items: [
        { code: "flex-direction: row", description: "Horizontal layout (default)" },
        { code: "flex-direction: column", description: "Vertical layout" },
        { code: "flex-wrap: wrap", description: "Allow items to wrap" },
        { code: "gap: 10px", description: "Space between flex items" },
        { code: "[attr='value']", description: "Select by attribute" }
      ],
      tip: "Attribute selectors: element[type='text'] selects inputs with that type"
    },
    parTime: 60,
    xpReward: 80
  },

  {
    id: 8,
    title: "Grid Basics",
    description: "Learn CSS Grid with grid-template-columns, grid-template-rows, and gap.",
    difficulty: "Advanced",
    instructions: [
      "🎛️ display: grid creates grid layout",
      "📊 grid-template-columns: Define column sizes (1fr 1fr 1fr or repeat(3, 1fr))",
      "📏 grid-template-rows: Define row sizes",
      "📐 gap: Space between grid items (same as flexbox gap)",
      "🎯 Select first <li> child using :first-child pseudo-class"
    ],
    targetElements: ['li:first-child'],
    htmlStructure: `
      <div>
        <ul>
          <li>First item (selected)</li>
          <li>Second item</li>
          <li>Third item</li>
        </ul>
        <ol>
          <li>First numbered (selected)</li>
          <li>Second numbered</li>
        </ol>
      </div>
    `,
    correctSelectors: ['li:first-child'],
    optimalSelector: 'li:first-child',
    hints: [
      "Pseudo-classes start with a colon (:)",
      "The pseudo-class is :first-child",
      "Try: li:first-child"
    ],
    selectorReference: {
      title: "CSS Grid Layout",
      items: [
        { code: "display: grid", description: "Enable grid layout" },
        { code: "grid-template-columns", description: "Define column sizes (1fr 2fr)" },
        { code: "grid-template-rows", description: "Define row sizes" },
        { code: "repeat(3, 1fr)", description: "Create 3 equal columns" },
        { code: ":first-child", description: "Select first child element" }
      ],
      tip: ":first-child selects the first child of any parent element"
    },
    parTime: 60,
    xpReward: 80
  },

  {
    id: 9,
    title: "Pseudo Classes",
    description: "Interactive states with :hover, :focus, :active for better user experience.",
    difficulty: "Advanced",
    instructions: [
      "👆 :hover triggers when mouse is over element",
      "🎯 :focus triggers when element is selected (tab key or click)",
      "👇 :active triggers when element is being clicked",
      "🎨 Use these for buttons, links, and form inputs",
      "🎯 Select odd items using :nth-child(odd)"
    ],
    targetElements: ['div:nth-child(odd)', '.item:nth-child(odd)'],
    htmlStructure: `
      <div class="container">
        <div class="item">Item 1 (odd)</div>
        <div class="item">Item 2 (even)</div>
        <div class="item">Item 3 (odd)</div>
        <div class="item">Item 4 (even)</div>
        <div class="item">Item 5 (odd)</div>
      </div>
    `,
    correctSelectors: ['div:nth-child(odd)', '.item:nth-child(odd)', 'div:nth-child(2n+1)'],
    optimalSelector: '.item:nth-child(odd)',
    hints: [
      ":nth-child() accepts keywords like 'odd' and 'even'",
      "You can use algebraic notation like 2n+1",
      "Try: .item:nth-child(odd)"
    ],
    selectorReference: {
      title: "Interactive Pseudo-Classes",
      items: [
        { code: ":hover", description: "When mouse is over element" },
        { code: ":focus", description: "When element is selected/active" },
        { code: ":active", description: "While element is being clicked" },
        { code: ":nth-child(odd)", description: "Select odd-numbered children" },
        { code: ":nth-child(2n+1)", description: "Algebraic: same as odd" }
      ],
      tip: "Use :nth-child(odd) or :nth-child(even) for striped patterns"
    },
    parTime: 90,
    xpReward: 90
  },

  {
    id: 10,
    title: "Pseudo Elements",
    description: "Add content with ::before and ::after pseudo-elements for decorative styling.",
    difficulty: "Advanced",
    instructions: [
      "✨ ::before inserts content before element (use content: '' property)",
      "✨ ::after inserts content after element",
      "🎨 Perfect for icons, decorations, or generated content",
      "📝 Must include content: '' even if empty",
      "🎯 Select elements with BOTH 'card' AND 'featured' classes"
    ],
    targetElements: ['.card.featured'],
    htmlStructure: `
      <div class="container">
        <div class="card">Regular card</div>
        <div class="card featured">Featured card (select this!)</div>
        <div class="featured">Just featured</div>
        <div class="card featured highlight">Also selected!</div>
      </div>
    `,
    correctSelectors: ['.card.featured', '.featured.card'],
    optimalSelector: '.card.featured',
    hints: [
      "Chain classes together without spaces",
      "Both classes must be present on the element",
      "Answer: .card.featured"
    ],
    selectorReference: {
      title: "Pseudo-Elements",
      items: [
        { code: "::before", description: "Insert content before element" },
        { code: "::after", description: "Insert content after element" },
        { code: "content: ''", description: "Required property for ::before/::after" },
        { code: ".class1.class2", description: "Element must have BOTH classes" }
      ],
      tip: "Chain classes without spaces: .card.featured selects elements with both"
    },
    parTime: 90,
    xpReward: 100
  },

  {
    id: 11,
    title: "Transitions & Animations",
    description: "Smooth changes with transition and create animations with @keyframes.",
    difficulty: "Expert",
    instructions: [
      "⏱️ transition: Smooth property changes (transition: all 0.3s ease)",
      "🎬 @keyframes: Define animation steps (from/to or 0%/100%)",
      "▶️ animation: Apply keyframes (animation: name 2s infinite)",
      "🎨 Combine with :hover for interactive effects",
      "🎯 Select all <li> EXCEPT those with class 'disabled'"
    ],
    targetElements: ['li:not(.disabled)'],
    htmlStructure: `
      <ul class="menu">
        <li>Active item</li>
        <li class="disabled">Disabled item</li>
        <li>Another active</li>
        <li class="disabled">Another disabled</li>
        <li>Last active</li>
      </ul>
    `,
    correctSelectors: ['li:not(.disabled)'],
    optimalSelector: 'li:not(.disabled)',
    hints: [
      "Use :not() to exclude elements",
      "Format: element:not(selector)",
      "Try: li:not(.disabled)"
    ],
    selectorReference: {
      title: "Transitions & Animations",
      items: [
        { code: "transition: all 0.3s", description: "Smooth property changes" },
        { code: "@keyframes name", description: "Define animation steps" },
        { code: "animation: name 2s", description: "Apply keyframe animation" },
        { code: ":not(selector)", description: "Exclude matching elements" }
      ],
      tip: ":not() excludes elements: li:not(.disabled) selects all li except disabled ones"
    },
    parTime: 90,
    xpReward: 100
  },

  {
    id: 12,
    title: "Responsive Design",
    description: "Master @media queries and relative units (em, rem, %, vw, vh) for responsive layouts.",
    difficulty: "Expert",
    instructions: [
      "📱 @media (max-width: 768px) { } for mobile styles",
      "🖥️ @media (min-width: 1024px) { } for desktop styles",
      "📏 Use relative units: em (relative to parent), rem (relative to root)",
      "📐 Viewport units: vw (% of width), vh (% of height)",
      "🎯 Master challenge: Combine descendant, attribute, and pseudo-class selectors"
    ],
    targetElements: ['.nav a[target="_blank"]:first-of-type'],
    htmlStructure: `
      <nav class="nav">
        <a href="/home">Home</a>
        <a href="https://example.com" target="_blank">External (first!)</a>
        <a href="https://google.com" target="_blank">Google</a>
        <a href="/about">About</a>
      </nav>
      <div class="content">
        <a href="https://test.com" target="_blank">Not in nav</a>
      </div>
    `,
    correctSelectors: [
      '.nav a[target="_blank"]:first-of-type',
      'nav.nav a[target="_blank"]:first-of-type'
    ],
    optimalSelector: '.nav a[target="_blank"]:first-of-type',
    hints: [
      "Start with .nav (parent)",
      "Then a[target='_blank'] (descendant with attribute)",
      "End with :first-of-type (only the first match)"
    ],
    selectorReference: {
      title: "Responsive Design",
      items: [
        { code: "@media (max-width: 768px)", description: "Mobile styles" },
        { code: "@media (min-width: 1024px)", description: "Desktop styles" },
        { code: "em/rem", description: "Relative font units" },
        { code: "vw/vh", description: "Viewport width/height units" },
        { code: "parent [attr]:pseudo", description: "Combine selectors" }
      ],
      tip: "Master selector: .nav a[target='_blank']:first-of-type combines all concepts!"
    },
    parTime: 120,
    xpReward: 150
  }
];

export default CSS_BATTLE_LEVELS;
