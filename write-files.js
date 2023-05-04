const { writeFileSync, mkdirSync, rmSync } = require('fs');
const { join } = require('path');

const outputPath = join(__dirname, process.argv[2]);
try {
  rmSync(outputPath, { recursive: true, force: true });
  mkdirSync(outputPath, { recursive: true });
} catch (e) {}

const iter = 7;
const depth = 3;

function writeFiles(path, currentDepth = 0) {
  if (currentDepth === depth) {
    try {
      mkdirSync(path, { recursive: true });
    } catch {}
  }
  for (let i = 0; i < iter; i++) {
    if (currentDepth === depth) {
      writeFileSync(join(path, `${i}-file.txt`), 'Hello World!');
    } else {
      const dir = join(path, i.toString());
      writeFiles(dir, currentDepth + 1);
    }
  }
}

writeFiles(outputPath);
