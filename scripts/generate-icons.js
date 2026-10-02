import fs from 'fs';
import sharp from 'sharp';

async function generate() {
  const iconSvg = fs.readFileSync('public/icon.svg');
  const iconMaskableSvg = fs.readFileSync('public/icon-maskable.svg');

  // 1. 192x192
  await sharp(iconSvg)
    .resize(192, 192)
    .png()
    .toFile('public/pwa-192x192.png');
  console.log('Generated pwa-192x192.png');

  // 2. 512x512
  await sharp(iconSvg)
    .resize(512, 512)
    .png()
    .toFile('public/pwa-512x512.png');
  console.log('Generated pwa-512x512.png');

  // 3. Apple touch icon 180x180
  await sharp(iconSvg)
    .resize(180, 180)
    .png()
    .toFile('public/apple-touch-icon.png');
  console.log('Generated apple-touch-icon.png');

  // 4. Maskable 512x512
  await sharp(iconMaskableSvg)
    .resize(512, 512)
    .png()
    .toFile('public/pwa-maskable-512x512.png');
  console.log('Generated pwa-maskable-512x512.png');

  // 5. Favicon 32x32 PNG / ICO
  await sharp(iconSvg)
    .resize(32, 32)
    .png()
    .toFile('public/favicon.ico');
  console.log('Generated favicon.ico');

  console.log('All icons generated successfully!');
}

generate().catch((err) => {
  console.error(err);
  process.exit(1);
});
