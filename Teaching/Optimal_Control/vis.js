const kernelDensityEstimator = (kernel, X) => (
  V => X.map(
    x => ([x, d3.mean(V, v => kernel(x - v))])
  )
);
const kernelEpanechnikov = k => (
  v => (Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0)
);

const $container = document.querySelector('#vis');

const wavesCount = 50;
const pointsCount = 80;
const data = [];
const colors = {};

for (let i = 0; i < pointsCount; i++) {
  const item = {};

  for (let j = 0; j < wavesCount; j++) {
    item[j] = Math.round(Math.random() * 100);
  }
  data.push(item);
}
for (let j = 0; j < wavesCount; j++) {
  const l = 0.5 + Math.random() * 0.5;
  colors[j] = `hsl(204, 61%, ${l * 100}%)` ;
}

const categories = Object.keys(data[0]);

let size = 0;

const svg = d3
  .select($container)
  .append('svg');
const group = svg.append('g');

const x = d3.scaleLinear().domain([0, 100]);
const y = d3.scaleLinear().domain([0, 0.4]);
const yName = d3.scaleBand().domain(categories);

const onResize = () => {
  size = Math.min(
    $container.clientWidth * 0.75,
    $container.clientHeight * 0.75
  );
  
  svg.attr('width', size).attr('height', size);
  
  x.range([0, size]);
  y.range([size, 0]);
  yName.range([0, size]);
};

const onRender = () => {
  const kde = kernelDensityEstimator(
    kernelEpanechnikov(3),
    x.ticks(75)
  );

  const allDensity = [];

  for (let i = 0; i < wavesCount; i++) {
    const key = categories[i];
    const density = kde(data.map(d => d[key]));

    allDensity.push({ key, density });
  }
  
  const line = d3.line()
    .curve(d3.curveBasis)
    .x(d => x(d[0]))
    .y(d => y(d[1]));
  
  svg.selectAll('path')
    .remove();

  svg.selectAll('path')
    .data(allDensity)
    .enter()
    .append('path')
    .attr('transform', d => `translate(0,${yName(d.key) - size + 10})`)
    .attr('fill', d => colors[d.key])
    .datum(d => d.density)
    .attr('d', line);
};

const loop = () => {
  for (let i = 0; i < wavesCount; i++) {
    for (let j = 0; j < pointsCount - 1; j++) {
      data[j][i] = data[j + 1][i];
    }
    data[pointsCount - 1][i] = Math.round(Math.random() * 100);
  }
  
  onRender();
  requestAnimationFrame(loop);
}

onResize();
loop();

window.addEventListener('resize', onResize);