import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const tokensPath = path.join(__dirname, '../src/design-system/tokens.json');
const outputPath = path.join(__dirname, '../src/design-system/tokens.css');

const tokens = JSON.parse(fs.readFileSync(tokensPath, 'utf-8'));

let cssContent = ':root {\n';

// Colors
Object.entries(tokens.colors).forEach(([key, value]) => {
  cssContent += `  --color-${key.replace(/_/g, '-')}: ${value};\n`;
});

// Typography - gera CSS variables
Object.entries(tokens.typography).forEach(([key, props]) => {
  cssContent += `  --font-${key}: "${props['font-family']}";\n`;
  cssContent += `  --font-size-${key}: ${props['font-size']};\n`;
  cssContent += `  --font-weight-${key}: ${props['font-weight']};\n`;
  cssContent += `  --line-height-${key}: ${props['line-height']};\n`;
});

// Spacing
Object.entries(tokens.spacing).forEach(([key, value]) => {
  cssContent += `  --space-${key}: ${value};\n`;
});

// Border radius
Object.entries(tokens['border-radius']).forEach(([key, value]) => {
  cssContent += `  --radius-${key}: ${value};\n`;
});

// Shadows
Object.entries(tokens.shadows).forEach(([key, value]) => {
  cssContent += `  --shadow-${key}: ${value};\n`;
});

// Transitions
Object.entries(tokens.transitions).forEach(([key, value]) => {
  cssContent += `  --transition-${key}: ${value};\n`;
});

cssContent += '}\n';

fs.writeFileSync(outputPath, cssContent);
console.log(`✓ Generated ${outputPath}`);
