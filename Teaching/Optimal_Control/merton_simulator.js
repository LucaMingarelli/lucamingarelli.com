// merton_simulator.js
// Monte Carlo simulator for Example 2 — Optimal Consumption-Investment (Merton problem)
(function () {

  // ------------------------- Parameters ---------------------------------
  const params = { mu: 0.08, r: 0.02, sigma: 0.20, rho: 0.10, T: 10, N: 30 };
  const W0 = 100;          // initial wealth
  const N_STEPS = 400;     // time steps
  const N_MAX = 200;       // max Monte Carlo runs

  const sliderDefs = [
    { key: 'mu',    label: 'μ (risky return)',   min: 0.00, max: 0.20, step: 0.005 },
    { key: 'r',     label: 'r (interest rate)',  min: 0.00, max: 0.10, step: 0.005 },
    { key: 'sigma', label: 'σ (volatility)',     min: 0.05, max: 0.50, step: 0.01  },
    { key: 'rho',   label: 'ρ (discount rate)',  min: 0.01, max: 0.30, step: 0.01  },
    { key: 'T',     label: 'T (horizon)',        min: 1,    max: 30,   step: 1     },
    { key: 'N',     label: 'Monte Carlo runs',   min: 1,    max: N_MAX, step: 1    },
  ];

  // ------------------------- Random noise -------------------------------
  // Pre-generate a fixed matrix of standard normals so that moving a slider
  // shows the ceteris-paribus effect of the parameter, not new randomness.
  let noise;
  function gaussian() {          // Box-Muller
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }
  function resampleNoise() {
    noise = d3.range(N_MAX).map(() => d3.range(N_STEPS).map(gaussian));
  }
  resampleNoise();

  // ------------------------- Model --------------------------------------
  function consumptionRate(t, rho, T, dt) {
    // c(t) = rho / (1 - exp(-rho (T - t))), capped so that at most
    // everything is consumed within one time step.
    const denom = 1 - Math.exp(-rho * (T - t));
    const c = denom > 1e-12 ? rho / denom : Infinity;
    return Math.min(c, 1 / dt);
  }

  function simulate(p) {
    const dt = p.T / N_STEPS;
    const Q = (p.mu - p.r) / (p.sigma * p.sigma);        // Merton fraction
    const kappa = (p.mu - p.r) / p.sigma;                // Sharpe ratio
    const drift = p.r + Q * (p.mu - p.r) - 0.5 * Q * Q * p.sigma * p.sigma;
    const vol = Q * p.sigma * Math.sqrt(dt);

    const times = d3.range(N_STEPS + 1).map(k => k * dt);

    // Monte Carlo paths (exact lognormal step: wealth stays positive)
    const paths = d3.range(p.N).map(i => {
      let W = W0;
      const path = [W];
      for (let k = 0; k < N_STEPS; k++) {
        const c = consumptionRate(times[k], p.rho, p.T, dt);
        W *= Math.exp((drift - c) * dt + vol * noise[i][k]);
        path.push(W);
      }
      return path;
    });

    // Monte Carlo mean
    const mcMean = d3.range(N_STEPS + 1).map(k => d3.mean(paths, path => path[k]));

    // Analytic expectation: dm/dt = (r + kappa^2 - c(t)) m
    let m = W0;
    const analytic = [m];
    for (let k = 0; k < N_STEPS; k++) {
      const c = consumptionRate(times[k], p.rho, p.T, dt);
      m *= Math.exp((p.r + kappa * kappa - c) * dt);
      analytic.push(m);
    }

    return { times, paths, mcMean, analytic, Q };
  }

  // ------------------------- Layout --------------------------------------
  const root = d3.select('#merton_figure');

  // Controls
  const controls = root.append('div')
    .style('display', 'grid')
    .style('grid-template-columns', 'repeat(auto-fit, minmax(220px, 1fr))')
    .style('gap', '4px 16px')
    .style('font-size', '13px')
    .style('text-align', 'left')
    .style('padding', '6px');

  const valueLabels = {};
  sliderDefs.forEach(def => {
    const row = controls.append('label');
    row.append('span').text(def.label + ': ');
    valueLabels[def.key] = row.append('b').text(params[def.key]);
    row.append('input')
      .attr('type', 'range')
      .attr('min', def.min).attr('max', def.max).attr('step', def.step)
      .attr('value', params[def.key])
      .style('width', '100%')
      .on('input', function () {
        params[def.key] = +this.value;
        valueLabels[def.key].text(this.value);
        render();
      });
  });

  const infoBar = root.append('div')
    .style('font-size', '13px')
    .style('padding', '4px');
  const qLabel = infoBar.append('b');
  infoBar.append('button')
    .text('Resample noise')
    .style('margin-left', '20px')
    .style('cursor', 'pointer')
    .on('click', () => { resampleNoise(); render(); });

  // Chart
  const margin = { top: 15, right: 20, bottom: 35, left: 55 };
  const width = 700 - margin.left - margin.right;
  const height = 380 - margin.top - margin.bottom;

  const svg = root.append('svg')
    .attr('viewBox', `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
    .style('width', '100%').style('height', 'auto')
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  const xScale = d3.scaleLinear().range([0, width]);
  const yScale = d3.scaleLinear().range([height, 0]);
  const xAxisG = svg.append('g').attr('transform', `translate(0,${height})`);
  const yAxisG = svg.append('g');

  svg.append('text')                                   // axis labels
    .attr('x', width / 2).attr('y', height + 32)
    .attr('text-anchor', 'middle').style('font-size', '12px').text('t');
  svg.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', -height / 2).attr('y', -42)
    .attr('text-anchor', 'middle').style('font-size', '12px').text('Wealth  Wₜ');

  const pathsG = svg.append('g');
  const mcMeanPath = svg.append('path')
    .attr('fill', 'none').attr('stroke', '#1a1a2e').attr('stroke-width', 2.5);
  const analyticPath = svg.append('path')
    .attr('fill', 'none').attr('stroke', '#d62728')
    .attr('stroke-width', 2).attr('stroke-dasharray', '6,4');

  // Legend
  const legend = svg.append('g').attr('transform', 'translate(10,10)')
    .style('font-size', '12px');
  legend.append('line').attr('x1', 0).attr('x2', 25).attr('y1', 0).attr('y2', 0)
    .attr('stroke', 'steelblue').attr('stroke-opacity', 0.5);
  legend.append('text').attr('x', 30).attr('y', 4).text('Monte Carlo paths');
  legend.append('line').attr('x1', 0).attr('x2', 25).attr('y1', 18).attr('y2', 18)
    .attr('stroke', '#1a1a2e').attr('stroke-width', 2.5);
  legend.append('text').attr('x', 30).attr('y', 22).text('Monte Carlo mean');
  legend.append('line').attr('x1', 0).attr('x2', 25).attr('y1', 36).attr('y2', 36)
    .attr('stroke', '#d62728').attr('stroke-width', 2).attr('stroke-dasharray', '6,4');
  legend.append('text').attr('x', 30).attr('y', 40).text('Analytic 𝔼[Wₜ]');

  // ------------------------- Render --------------------------------------
  function render() {
    const { times, paths, mcMean, analytic, Q } = simulate(params);

    qLabel.text(`Merton fraction Q* = ${Q.toFixed(2)}`)
      .style('color', Q > 1 ? '#d62728' : '#1a1a2e');

    // Robust y-domain: 99th percentile of all simulated values (leverage can explode)
    const allValues = [];
    paths.forEach(p => p.forEach(v => allValues.push(v)));
    allValues.sort(d3.ascending);
    const yMax = Math.max(
      allValues[Math.floor(0.99 * (allValues.length - 1))],
      d3.max(analytic), W0) * 1.05;

    xScale.domain([0, params.T]);
    yScale.domain([0, yMax]);
    xAxisG.call(d3.axisBottom(xScale));
    yAxisG.call(d3.axisLeft(yScale));

    const line = d3.line()
      .x((d, k) => xScale(times[k]))
      .y(d => yScale(Math.min(d, yMax)));

    const sel = pathsG.selectAll('path').data(paths);
    sel.enter().append('path')
      .attr('fill', 'none').attr('stroke', 'steelblue')
      .attr('stroke-width', 1).attr('stroke-opacity', 0.35)
      .merge(sel)
      .attr('d', line);
    sel.exit().remove();

    mcMeanPath.attr('d', line(mcMean));
    analyticPath.attr('d', line(analytic));
  }

  render();
})();