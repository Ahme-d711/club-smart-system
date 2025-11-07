const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'data');

// Create data directory if it doesn't exist
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
  console.log('Created data directory');
}

// Initialize empty JSON files if they don't exist
const files = {
  'orders.json': [],
  'padel.json': []
};

Object.entries(files).forEach(([filename, defaultContent]) => {
  const filePath = path.join(dataDir, filename);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultContent, null, 2));
    console.log(`Created ${filename}`);
  }
});

console.log('Setup complete!');

