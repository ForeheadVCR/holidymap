import sharp from 'sharp';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const MAP_SIZE = 2048;
const PUBLIC_DIR = join(process.cwd(), 'public');

async function generateMapImage() {
  mkdirSync(join(PUBLIC_DIR, 'map'), { recursive: true });

  // Create a sandy desert-colored image
  await sharp({
    create: {
      width: MAP_SIZE,
      height: MAP_SIZE,
      channels: 3,
      background: { r: 194, g: 154, b: 108 }
    }
  })
  .png()
  .toFile(join(PUBLIC_DIR, 'map', 'deep-desert-grid.png'));
  
  console.log('Generated placeholder map image');
}

// Generate simple SVG icons for each category
function generateIcons() {
  const icons = [
    { name: 'cave', shape: 'triangle' },
    { name: 'shipwreck', shape: 'diamond' },
    { name: 'fallen-shipwreck', shape: 'diamond' },
    { name: 'testing-station', shape: 'circle' },
    { name: 'loot-container', shape: 'square' },
    { name: 'intel-pickup', shape: 'triangle' },
    { name: 'house-rep', shape: 'circle' },
    { name: 'spice-large', shape: 'diamond' },
    { name: 'spice-medium', shape: 'diamond' },
    { name: 'spice-small', shape: 'diamond' },
    { name: 'aluminum-ore', shape: 'circle' },
    { name: 'basalt-stone', shape: 'square' },
    { name: 'carbon-ore', shape: 'circle' },
    { name: 'copper-ore', shape: 'circle' },
    { name: 'erythrite-crystal', shape: 'diamond' },
    { name: 'flour-sand', shape: 'circle' },
    { name: 'granite-stone', shape: 'square' },
    { name: 'impure-fuel', shape: 'circle' },
    { name: 'iron-ore', shape: 'circle' },
    { name: 'jasmium-crystal', shape: 'diamond' },
    { name: 'plant-fiber', shape: 'circle' },
    { name: 'scrap-metal', shape: 'square' },
    { name: 'stravidium-mass', shape: 'diamond' },
    { name: 'titanium-ore', shape: 'circle' },
    { name: 'taxi-service', shape: 'square' },
    { name: 'community-pin', shape: 'circle' },
  ];

  const shapes = {
    circle: '<circle cx="12" cy="12" r="8" fill="white"/>',
    square: '<rect x="4" y="4" width="16" height="16" rx="2" fill="white"/>',
    triangle: '<polygon points="12,3 21,21 3,21" fill="white"/>',
    diamond: '<polygon points="12,2 22,12 12,22 2,12" fill="white"/>',
  };

  mkdirSync(join(PUBLIC_DIR, 'icons'), { recursive: true });

  for (const icon of icons) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">${shapes[icon.shape]}</svg>`;
    writeFileSync(join(PUBLIC_DIR, 'icons', `${icon.name}.svg`), svg);
  }
  console.log(`Generated ${icons.length} SVG icons`);
}

await generateMapImage();
generateIcons();
console.log('Done!');
