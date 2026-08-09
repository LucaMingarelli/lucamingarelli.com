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
    const cRates = times.map(t => consumptionRate(t, p.rho, p.T, dt));

    // Monte Carlo wealth paths (exact lognormal step: wealth stays positive)
    const wealthPaths = d3.range(p.N).map(i => {
      let W = W0;
      const path = [W];
      for (let k = 0; k < N_STEPS; k++) {
        W *= Math.exp((drift - cRates[k]) * dt + vol * noise[i][k]);
        path.push(W);
      }
      return path;
    });

    // Consumption flow paths: C*_t = c(t) W_t
    const consPaths = wealthPaths.map(path => path.map((W, k) => cRates[k] * W));

    // Monte Carlo means
    const wealthMean = d3.range(N_STEPS + 1).map(k => d3.mean(wealthPaths, p_ => p_[k]));
    const consMean = d3.range(N_STEPS + 1).map(k => d3.mean(consPaths, p_ => p_[k]));

    // Analytic expectations: dm/dt = (r + kappa^2 - c(t)) m,  E[C_t] = c(t) m(t)
    let m = W0;
    const wealthAnalytic = [m];
    for (let k = 0; k < N_STEPS; k++) {
      m *= Math.exp((p.r + kappa * kappa - cRates[k]) * dt);
      wealthAnalytic.push(m);
    }
    const consAnalytic = wealthAnalytic.map((mv, k) => cRates[k] * mv);

    return {
      times, Q,
      wealth: { paths: wealthPaths, mcMean: wealthMean, analytic: wealthAnalytic },
      cons:   { paths: consPaths,   mcMean: consMean,   analytic: consAnalytic },
    };
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

  // Panels container (side by side, wrapping on narrow screens)
  const panelsDiv = root.append('div')
    .style('display', 'flex')
    .style('flex-wrap', 'wrap')
    .style('justify-content', 'center');

  // ------------------------- Chart factory -------------------------------
  const margin = { top: 20, right: 15, bottom: 35, left: 55 };
  const width = 400 - margin.left - margin.right;
  const height = 320 - margin.top - margin.bottom;

  let panelCount = 0;

  function makePanel(title, yLabel) {
    const clipId = 'merton_clip_' + (panelCount++);

    const svg = panelsDiv.append('div')
      .style('flex', '1 1 320px')
      .style('min-width', '280px')
      .style('max-width', '420px')
      .append('svg')
      .attr('viewBox', `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .style('width', '100%').style('height', 'auto')
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Clip region: anything outside the plot area is hidden, so paths
    // exceeding the y-limit exit through the top instead of being drawn
    // flat along the axis.
    svg.append('defs').append('clipPath')
      .attr('id', clipId)
      .append('rect')
      .attr('x', 0).attr('y', 0)
      .attr('width', width).attr('height', height);

    svg.append('text')
      .attr('x', width / 2).attr('y', -6)
      .attr('text-anchor', 'middle')
      .style('font-size', '13px').style('font-weight', 'bold')
      .text(title);
    svg.append('text')
      .attr('x', width / 2).attr('y', height + 32)
      .attr('text-anchor', 'middle').style('font-size', '12px').text('t');
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2).attr('y', -42)
      .attr('text-anchor', 'middle').style('font-size', '12px').text(yLabel);

    const clipped = svg.append('g').attr('clip-path', `url(#${clipId})`);

    const panel = {
      xScale: d3.scaleLinear().range([0, width]),
      yScale: d3.scaleLinear().range([height, 0]),
      xAxisG: svg.append('g').attr('transform', `translate(0,${height})`),
      yAxisG: svg.append('g'),
      pathsG: clipped.append('g'),
      mcMeanPath: clipped.append('path')
        .attr('fill', 'none').attr('stroke', '#1a1a2e').attr('stroke-width', 2.5),
      analyticPath: clipped.append('path')
        .attr('fill', 'none').attr('stroke', '#d62728')
        .attr('stroke-width', 2).attr('stroke-dasharray', '6,4'),
    };
    return panel;
  }

  function updatePanel(panel, times, data, T) {
    // Robust y-domain: 99th percentile of all simulated values (leverage can explode)
    const allValues = [];
    data.paths.forEach(p_ => p_.forEach(v => allValues.push(v)));
    allValues.sort(d3.ascending);
    const yMax = Math.max(
      allValues[Math.floor(0.99 * (allValues.length - 1))],
      d3.max(data.analytic)) * 1.05;

    panel.xScale.domain([0, T]);
    panel.yScale.domain([0, yMax]);
    panel.xAxisG.call(d3.axisBottom(panel.xScale).ticks(6));
    panel.yAxisG.call(d3.axisLeft(panel.yScale).ticks(6));

    // No clamping: out-of-range values are handled by the clipPath
    const line = d3.line()
      .x((d, k) => panel.xScale(times[k]))
      .y(d => panel.yScale(d));

    const sel = panel.pathsG.selectAll('path').data(data.paths);
    sel.enter().append('path')
      .attr('fill', 'none').attr('stroke', 'steelblue')
      .attr('stroke-width', 1).attr('stroke-opacity', 0.35)
      .merge(sel)
      .attr('d', line);
    sel.exit().remove();

    panel.mcMeanPath.attr('d', line(data.mcMean));
    panel.analyticPath.attr('d', line(data.analytic));
  }

  const wealthPanel = makePanel('Wealth Wₜ', 'Wₜ');
  const consPanel = makePanel('Consumption Cₜ* = c(t)Wₜ', 'Cₜ*');

  // Shared legend
  const legendDiv = root.append('div')
    .style('font-size', '12px').style('padding', '2px');
  legendDiv.html(
    '<span style="color:steelblue;">━</span> Monte Carlo paths &nbsp;&nbsp; ' +
    '<span style="color:#1a1a2e;">━</span> Monte Carlo mean &nbsp;&nbsp; ' +
    '<span style="color:#d62728;">╍</span> Analytic expectation'
  );

  // ------------------------- Render --------------------------------------
  function render() {
    const { times, Q, wealth, cons } = simulate(params);

    qLabel.text(`Merton fraction Q* = ${Q.toFixed(2)}`)
      .style('color', Q > 1 ? '#d62728' : '#1a1a2e');

    updatePanel(wealthPanel, times, wealth, params.T);
    updatePanel(consPanel, times, cons, params.T);
  }

  render();
})();