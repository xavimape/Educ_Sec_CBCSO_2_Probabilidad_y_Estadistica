// Genera íconos PNG 192/512 y maskable 512 desde public/icon.svg (usa sharp).
// Uso: npm run iconos
import sharp from 'sharp';
import { readFileSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const aqui = dirname(fileURLToPath(import.meta.url));
const publicDir = resolve(aqui, '..', 'public');
const svg = readFileSync(join(publicDir, 'icon.svg'));

await sharp(svg).resize(192, 192).png().toFile(join(publicDir, 'icon-192.png'));
await sharp(svg).resize(512, 512).png().toFile(join(publicDir, 'icon-512.png'));

// Maskable: figura al ~80% (zona segura) centrada sobre el color de fondo.
const inner = await sharp(svg).resize(410, 410).png().toBuffer();
await sharp({ create: { width: 512, height: 512, channels: 4, background: '#1d4ed8' } })
  .composite([{ input: inner, top: 51, left: 51 }])
  .png()
  .toFile(join(publicDir, 'icon-maskable-512.png'));

console.log('Íconos generados: icon-192.png, icon-512.png, icon-maskable-512.png');
