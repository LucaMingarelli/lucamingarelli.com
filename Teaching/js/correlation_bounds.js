// margin = { top: 20, right: 30, bottom: 40, left: 50 },
// width = +svg.attr("width") - margin.left - margin.right,
// height = +svg.attr("height") - margin.top - margin.bottom;

var margin = {top: 5, bottom: 70, right: 70, left: 70},
width = document.getElementById("correlation_bounds_interactive").offsetWidth*0.8,
height = width//350 - margin.top - margin.bottom;

var svg = d3.select("#correlation_bounds_interactive")
.append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform",
    "translate(" + margin.left + "," + margin.top + ")");



const xScale = d3.scaleLinear().domain([0, 1]).range([0, width]);
const yScale = d3.scaleLinear().domain([-1, 1]).range([height, 0]);

const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

g.append("g")
.attr("transform", `translate(0,${height})`)
.attr("class", "axis")
.call(d3.axisBottom(xScale));

g.append("g")
.attr("class", "axis")
.call(d3.axisLeft(yScale));

g.append("svg:foreignObject")
.attr("class", "axis-label")
.attr("x", width / 2 - 10)
.attr("y", height+15)
.style("text-anchor", "middle")
.attr("width", 40)
.attr("height", 20)
.append("xhtml:div")
.html("\\(p_X\\)");

g.append("svg:foreignObject")
.attr("class", "axis-label")
.attr("x", -45)
.attr("y", height/2-10)
.style("text-anchor", "middle")
.attr("width", 40)
.attr("height", 20)
.append("xhtml:div")
.html("\\(\\rho\\)");

const lineMin = g.append("path")
            .attr("fill", "none")
            .attr("stroke", "blue")
            .attr("stroke-width", 2);
const lineMax = g.append("path")
            .attr("fill", "none")
            .attr("stroke", "red")
            .attr("stroke-width", 2);

// Add legend
const legend = svg.append("g").attr("transform", `translate(${width - 100}, 20)`);

legend.append("rect")
.attr("x", 50)
.attr("y", 0)
.attr("width", 12)
.attr("height", 12)
.attr("fill", "blue");
legend.append("svg:foreignObject")
.attr("x", 70)
.attr("y", -3)
.attr("width", 40)
.attr("height", 20)
.append("xhtml:div")
.html("\\(\\rho_{\\text{min}}\\)");

legend.append("rect")
.attr("x", 50)
.attr("y", 20)
.attr("width", 12)
.attr("height", 12)
.attr("fill", "red");
legend.append("svg:foreignObject")
.attr("x", 70)
.attr("y", 17)
.attr("width", 40)
.attr("height", 20)
.append("xhtml:div")
.html("\\(\\rho_{\\text{max}}\\)");

function computePhi(p1, p2) {
let q1 = 1 - p1, q2 = 1 - p2;
// Fixed: use (p1*p2) in both denominators.
let phiMin = Math.max(-Math.sqrt((p1 * p2) / (q1 * q2)),
                  -Math.sqrt((q1 * q2) / (p1 * p2)));
let phiMax = Math.min(Math.sqrt((p1 * q2) / (p2 * q1)),
                  Math.sqrt((p2 * q1) / (p1 * q2)));
return { phiMin, phiMax };
}

function updatePlot(p2) {
let data = d3.range(0, 1.01, 0.001).map(p1 => {
let { phiMin, phiMax } = computePhi(p1, p2);
return { p1, phiMin, phiMax };
});

lineMin.datum(data)
   .attr("d", d3.line()
                .x(d => xScale(d.p1))
                .y(d => yScale(d.phiMin)));

lineMax.datum(data)
   .attr("d", d3.line()
                .x(d => xScale(d.p1))
                .y(d => yScale(d.phiMax)));

// Ensure MathJax is available before calling typesetPromise.
if (window.MathJax && MathJax.typesetPromise) {
MathJax.typesetPromise().catch(function (err) {
console.error("MathJax typeset failed: " + err.message);
});
}
}

d3.select("#p2-slider").on("input", function() {
let p2 = +this.value;
d3.select("#p2-value").text(p2.toFixed(2));
updatePlot(p2);
});

// Initial plot rendering.
updatePlot(0.3);