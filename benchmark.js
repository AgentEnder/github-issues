const { execSync } = require('child_process');
const iterations = 3;

console.time('longTask');
for (let i = 0; i < iterations; i++) {
    execSync('npx nx longTask')
}
console.timeEnd('longTask');

console.time('shortTask');
for (let i = 0; i < iterations; i++) {
    execSync('npx nx shortTask')
}
console.timeEnd('shortTask');
