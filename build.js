const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");
const MarkdownIt = require("markdown-it");


// ─────────────────────────────────────────────────────────────
// markdown-it-container setup
// Add this to wherever you initialise your markdown-it pipeline.
// Install once: npm install markdown-it-container
// ─────────────────────────────────────────────────────────────

const md = require('markdown-it')({ html: true, linkify: true, typographer: true });
const container = require('markdown-it-container');

// All container names used in the .md file
const containers = [
  'tagline',
  'lead',
  'meta-row',
  'metrics',
  'metric',
  'two-col',
  'col',
  'challenge',
  'outcomes',
  'impact',
  'callout-info',
  'process-grid',
  'process-card',
  'footer-note',
];

containers.forEach(name => {
  md.use(container, name, {
    render(tokens, idx) {
      const token = tokens[idx];
      // opening tag
      if (token.nesting === 1) {
        return `<div class="container-${name}">\n`;
      }
      // closing tag
      return '</div>\n';
    }
  });
});

// ── Usage ──────────────────────────────────────────────────────
// const matter = require('gray-matter');
//
// const raw    = fs.readFileSync('ux_writing_case_study.md', 'utf8');
// const { data: frontmatter, content } = matter(raw);
// const html   = md.render(content);
//
// Then inject `html` into your template.
// Link both CSS files in your <head>:
//   <link rel="stylesheet" href="your-existing-styles.css">
//   <link rel="stylesheet" href="case-study-containers.css">

const CONTENT_DIR = path.join(__dirname, "content");
const OUTPUT_DIR = path.join(__dirname, "dist");
const TEMPLATE_PATH = path.join(__dirname, "template.html");

// Ensure dist folder exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Read template once
const template = fs.readFileSync(TEMPLATE_PATH, "utf-8");

// Get all .md files
const files = fs.readdirSync(CONTENT_DIR).filter(file => file.endsWith(".md"));

files.forEach(file => {
  const filePath = path.join(CONTENT_DIR, file);
  const raw = fs.readFileSync(filePath, "utf-8");

  // Parse front matter + markdown content
  const { data, content } = matter(raw);

  // Convert markdown to HTML
  const htmlContent = md.render(content);

  // Use front matter title if present, else file name
  const fileName = path.basename(file, ".md");
  const title = data.title || fileName;

  // Insert into template
  const fullHtml = template
    .replace(/{{title}}/g, title)
    .replace(/{{content}}/g, htmlContent);

  // Output file: about.md -> about.html
  const outputPath = path.join(OUTPUT_DIR, `${fileName}.html`);
  fs.writeFileSync(outputPath, fullHtml, "utf-8");

  console.log(`Built: ${outputPath}`);
});

console.log("Done.");