const fs = require('fs');
const path = require('path');

// Mock browser environment
const mockCanvas = {
  width: 720,
  height: 720,
  getContext: () => ({
    clearRect: (x, y, w, h) => {
      console.log(`[Canvas Context] clearRect(${x}, ${y}, ${w}, ${h})`);
    },
    drawImage: (img, x, y, w, h) => {
      console.log(`[Canvas Context] drawImage(${img.src}, ${x}, ${y}, ${w}, ${h})`);
    }
  })
};

const mockDots = [
  { classList: { toggle: (name, active) => console.log(`[Dot 1 Class] toggle(${name}, active=${active})`) }, getAttribute: () => '1' },
  { classList: { toggle: (name, active) => console.log(`[Dot 2 Class] toggle(${name}, active=${active})`) }, getAttribute: () => '2' },
  { classList: { toggle: (name, active) => console.log(`[Dot 3 Class] toggle(${name}, active=${active})`) }, getAttribute: () => '3' }
];

const mockCard = {
  addEventListener: (event, handler) => {
    console.log(`[Card EventListener] added for event: ${event}`);
  }
};

global.window = {
  matchMedia: () => ({ matches: false }),
  addEventListener: () => {}
};

global.document = {
  getElementById: (id) => {
    console.log(`[DOM] getElementById: ${id}`);
    if (id === 'careers-hero-canvas') return mockCanvas;
    if (id === 'card') return mockCard;
    return null;
  },
  querySelectorAll: (selector) => {
    console.log(`[DOM] querySelectorAll: ${selector}`);
    if (selector === '.card-overlay-dots .dot-btn') return mockDots;
    return [];
  },
  addEventListener: (event, handler) => {
    console.log(`[DOM EventListener] added for event: ${event}`);
  }
};

// Mock Image class
global.Image = class {
  constructor() {
    this._src = '';
    this.complete = false;
  }
  set src(val) {
    this._src = val;
    console.log(`[Image] set src: ${val}`);
    // Simulate async loading in a microtask
    process.nextTick(() => {
      this.complete = true;
      if (this.onload) this.onload();
    });
  }
  get src() {
    return this._src;
  }
};

// Mock setInterval/clearInterval
let intervalCount = 0;
global.setInterval = (fn, delay) => {
  intervalCount++;
  const id = intervalCount;
  console.log(`[setInterval] started with ID: ${id}, delay: ${delay}ms`);
  return id;
};
global.clearInterval = (id) => {
  console.log(`[clearInterval] cleared ID: ${id}`);
};

// Read careers.html and extract the IIFE script
const htmlPath = path.join(__dirname, '../careers.html');
const htmlContent = fs.readFileSync(htmlPath, 'utf8');

// Find the sequence player script block
const match = htmlContent.match(/\/\/\s*Signature Carousel Card Frame Sequence Player Logic[\s\S]+?\}\)\(\);/);
if (!match) {
  console.error("Could not find sequence player IIFE script block in careers.html");
  process.exit(1);
}

const scriptCode = match[0];
console.log("=== Extracted Sequence Player Script ===");
console.log(scriptCode.substring(0, 300) + "\n...\n" + scriptCode.substring(scriptCode.length - 300));
console.log("========================================");

console.log("\n=== Executing Script in Mock Browser ===");
// Run the script
eval(scriptCode);

// Wait for async onload events to fire
setTimeout(() => {
  console.log("=== Mock Run Completed ===");
}, 500);
