// Split composite images into individual character icons
const fs = require('fs');
const path = require('path');

// The user said one image has 8 emoji packs arranged as 2 columns x 4 rows
const files = [
  { name: 'emojis_goose', file: 'Screenshot_2026-06-14-19-40-43-689_com.xingin.xhs-removebg-preview.png' },
  { name: 'emojis_duck_neutral', file: 'Screenshot_2026-06-14-19-40-58-878_com.xingin.xhs-removebg-preview.png' }
];

const dir = 'C:\\Users\\34712\\Desktop\\goose-duck';
const outDir = path.join(dir, 'icons', 'emoji');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

// Each image: 335x745, split into 2 columns x 4 rows
// Cell size: ~167 x ~186
const COLS = 2, ROWS = 4;
const IW = 335, IH = 745;
const CW = Math.floor(IW / COLS);  // 167
const CH = Math.floor(IH / ROWS);  // 186

for (const { name, file } of files) {
  const srcPath = path.join(dir, file);
  if (!fs.existsSync(srcPath)) {
    console.log(`Not found: ${file}`);
    continue;
  }
  const buf = fs.readFileSync(srcPath);
  console.log(`${file}: ${buf.length} bytes`);

  // Generate split commands for Python (which can actually crop PNGs)
  // For now, just report the grid layout
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const idx = r * COLS + c;
      const outFile = path.join(outDir, `${name}_${idx}.png`);
      console.log(`  Cell [${r},${c}] -> ${name}_${idx}.png (${c*CW},${r*CH} ${CW}x${CH})`);
    }
  }
}

console.log('\n=== Split info ===');
console.log(`Grid: ${COLS}x${ROWS} = 8 cells per image`);
console.log(`Each cell: ${CW}x${CH}px`);
console.log(`Output: ${outDir}`);
