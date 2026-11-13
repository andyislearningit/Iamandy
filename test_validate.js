const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

// Find all src="..." attributes
const imgRegex = /src=["']([^"']+)["']/g;
let match;
const missingImages = [];
const foundImages = [];
while ((match = imgRegex.exec(html)) !== null) {
  const src = match[1];
  if (!src.startsWith('http') && !src.startsWith('data:')) {
    if (!fs.existsSync(src)) {
      missingImages.push(src);
    } else {
      foundImages.push(src);
    }
  }
}
console.log('Checked images count:', foundImages.length);
console.log('Missing images:', missingImages);

// Find all anchor links with #...
const hrefRegex = /href=["']#([^"']+)["']/g;
const missingTargets = [];
const foundTargets = [];
while ((match = hrefRegex.exec(html)) !== null) {
  const targetId = match[1];
  const regex = new RegExp(`id=["']${targetId}["']`);
  if (!regex.test(html)) {
    missingTargets.push(targetId);
  } else {
    foundTargets.push(targetId);
  }
}
console.log('Checked anchor targets count:', foundTargets.length);
console.log('Missing anchor targets:', missingTargets);
