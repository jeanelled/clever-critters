let dataset = [];

const examples = {
  heights: { name: 'Heights (cm)', data: [50, 52, 51, 60, 55, 53, 54, 52, 51, 150] },
  scores: { name: 'Test Scores', data: [75, 80, 85, 90, 85, 88, 92, 85, 78, 82] },
  rain: { name: 'Days of Rain', data: [2, 3, 1, 4, 2, 0, 5, 2, 1, 3] },
  books: { name: 'Books Read', data: [3, 5, 4, 6, 5, 3, 7, 4, 8, 5] }
};

function addPoint(value) {
  const count = dataset.filter(v => v === value).length;
  if (count < 8) {
    dataset.push(value);
    update();
  }
}

function removePoint(index) {
  dataset.splice(index, 1);
  update();
}

function loadExample(key) {
  dataset = [...examples[key].data];
  update();
}

function resetData() {
  dataset = [];
  update();
}

function calculateMin(arr) {
  return arr.length ? Math.min(...arr) : 0;
}

function calculateMax(arr) {
  return arr.length ? Math.max(...arr) : 0;
}

function calculateSum(arr) {
  return arr.reduce((a, b) => a + b, 0);
}

function calculateMean(arr) {
  return arr.length ? (calculateSum(arr) / arr.length).toFixed(1) : 0;
}

function calculateMedian(arr) {
  if (!arr.length) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : ((sorted[mid - 1] + sorted[mid]) / 2).toFixed(1);
}

function calculateMode(arr) {
  if (!arr.length) return 'N/A';
  const freq = {};
  arr.forEach(val => freq[val] = (freq[val] || 0) + 1);
  const maxFreq = Math.max(...Object.values(freq));
  const modes = Object.keys(freq).filter(k => freq[k] === maxFreq).map(Number);
  return modes.length === arr.length ? 'N/A' : modes.join(', ');
}

function calculateRange(arr) {
  return arr.length ? calculateMax(arr) - calculateMin(arr) : 0;
}

function detectOutliers(arr) {
  if (arr.length < 4) return [];
  const sorted = [...arr].sort((a, b) => a - b);
  const q1 = sorted[Math.floor(sorted.length * 0.25)];
  const q3 = sorted[Math.floor(sorted.length * 0.75)];
  const iqr = q3 - q1;
  const lowerBound = q1 - 1.5 * iqr;
  const upperBound = q3 + 1.5 * iqr;
  return arr.filter(val => val < lowerBound || val > upperBound);
}

function calculateStats() {
  return {
    min: calculateMin(dataset),
    max: calculateMax(dataset),
    mean: calculateMean(dataset),
    median: calculateMedian(dataset),
    mode: calculateMode(dataset),
    sum: calculateSum(dataset),
    range: calculateRange(dataset),
    outliers: detectOutliers(dataset)
  };
}

function renderDotPlot() {
  const container = document.getElementById('dotPlot');
  container.innerHTML = '';

  if (!dataset.length) {
    container.innerHTML = '<p style="text-align: center; color: #999; padding: 2rem;">Click "Add Point" to start building a dataset!</p>';
    return;
  }

  const min = calculateMin(dataset);
  const max = calculateMax(dataset);
  const range = max - min || 1;
  const width = 600;
  const height = 250;
  const padding = 40;
  const plotWidth = width - 2 * padding;
  const plotHeight = height - 2 * padding;

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', width);
  svg.setAttribute('height', height);
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  svg.style.cssText = 'margin: 1rem 0;';

  // Axis line
  const axisLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  axisLine.setAttribute('x1', padding);
  axisLine.setAttribute('y1', height - padding);
  axisLine.setAttribute('x2', width - padding);
  axisLine.setAttribute('y2', height - padding);
  axisLine.setAttribute('stroke', '#006373');
  axisLine.setAttribute('stroke-width', '2');
  svg.appendChild(axisLine);

  // Axis labels
  const minLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  minLabel.setAttribute('x', padding);
  minLabel.setAttribute('y', height - 10);
  minLabel.setAttribute('text-anchor', 'middle');
  minLabel.setAttribute('font-size', '12');
  minLabel.setAttribute('fill', '#006373');
  minLabel.textContent = min;
  svg.appendChild(minLabel);

  const maxLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  maxLabel.setAttribute('x', width - padding);
  maxLabel.setAttribute('y', height - 10);
  maxLabel.setAttribute('text-anchor', 'middle');
  maxLabel.setAttribute('font-size', '12');
  maxLabel.setAttribute('fill', '#006373');
  maxLabel.textContent = max;
  svg.appendChild(maxLabel);

  // Count occurrences
  const valueCounts = {};
  dataset.forEach(val => {
    valueCounts[val] = (valueCounts[val] || 0) + 1;
  });

  // Draw dots
  Object.entries(valueCounts).forEach(([value, count]) => {
    const x = padding + ((value - min) / range) * plotWidth;
    const ySpacing = 25;
    for (let i = 0; i < count; i++) {
      const y = height - padding - (i + 1) * ySpacing;
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', x);
      circle.setAttribute('cy', y);
      circle.setAttribute('r', '8');
      circle.setAttribute('fill', '#006373');
      circle.setAttribute('opacity', '0.7');
      circle.setAttribute('stroke', '#f6c7b3');
      circle.setAttribute('stroke-width', '2');
      circle.style.cursor = 'pointer';
      circle.addEventListener('click', () => {
        removePoint(dataset.indexOf(Number(value)));
      });
      svg.appendChild(circle);
    }
  });

  container.appendChild(svg);
}

function renderStats() {
  const stats = calculateStats();
  const container = document.getElementById('statsDisplay');
  container.innerHTML = '';

  const statCards = [
    { label: 'MINdy the Minnow', emoji: '🐟', value: stats.min },
    { label: 'MAXimus the Manta Ray', emoji: '🌊', value: stats.max },
    { label: 'seMEANa the Seahorse', emoji: '🐚', value: stats.mean },
    { label: 'MEDusa the Moon Jellyfish', emoji: '🪼', value: stats.median },
    { label: 'amMODE the Angelfish', emoji: '🐠', value: stats.mode },
    { label: 'SUMmer the Sea Turtle', emoji: '🐢', value: stats.sum },
    { label: 'RANGElla the Reef Shark', emoji: '🦈', value: stats.range },
    { label: 'OUTLIERo the Octopus', emoji: '🐙', value: stats.outliers.length ? stats.outliers.join(', ') : 'None' }
  ];

  statCards.forEach(stat => {
    const card = document.createElement('div');
    card.className = 'stat-card';
    card.innerHTML = `<div class="stat-label">${stat.emoji} ${stat.label}</div><div class="stat-value">${stat.value}</div>`;
    container.appendChild(card);
  });
}

function update() {
  renderDotPlot();
  renderStats();
  document.getElementById('dataCount').textContent = `Data points: ${dataset.length}`;
}

document.addEventListener('DOMContentLoaded', () => {
  // Point buttons
  for (let i = 1; i <= 10; i++) {
    const btn = document.getElementById(`btn${i}`);
    if (btn) btn.addEventListener('click', () => addPoint(i));
  }

  // Example buttons
  document.getElementById('exHeights').addEventListener('click', () => loadExample('heights'));
  document.getElementById('exScores').addEventListener('click', () => loadExample('scores'));
  document.getElementById('exRain').addEventListener('click', () => loadExample('rain'));
  document.getElementById('exBooks').addEventListener('click', () => loadExample('books'));

  // Reset button
  document.getElementById('resetBtn').addEventListener('click', resetData);

  update();
});
