// Define svg_dp dimensions
var svg_dp = d3.select("#dp0_figure")
    .append("svg")
    .attr("width", 300)
    .attr("height", 300)
;

// Define scales
var xScale = d3.scaleLinear().domain([0, 4.5]).range([50, 250]);
var yScale = d3.scaleLinear().domain([0.5, 3.5]).range([250, 50]);

// Define axes
var xAxis = d3.axisBottom(xScale).ticks(6);
var yAxis = d3.axisLeft(yScale).ticks(4);

// Draw axes
svg_dp.append("g")
    .attr("transform", "translate(0,250)")
    .call(xAxis)
    .append("svg_dp:foreignObject")
    .attr("width", 20)
    .attr("height", 20)
    .attr("transform", "translate(260,-5)")
    .append("xhtml:div")
    .html("\\(t\\)");


svg_dp.append("g")
    .attr("transform", "translate(50,0)")
    .call(yAxis)
    .append("svg:foreignObject")
    .attr("width", 20)
    .attr("height", 20)
    .attr("transform", "translate(0,30)")
    .append("xhtml:div")
    .html("\\(x\\)"); 

svg_dp.append("g")
    .attr("transform", "translate(50,0)")
    .call(yAxis)
    .append("svg:foreignObject")
    .attr("width", 20)
    .attr("height", 20)
    .attr("transform", "translate(-20,145)")
    .append("xhtml:div")
    .html("\\(x_0\\)"); 


svg_dp.selectAll(".tick text").remove(); // Remove tick-labels




// Generate data for grid points
var data_grid = [];
for (var x = 1; x < 4; x++) {
    for (var t = 1; t <= 5; t++) {
        data_grid.push({x: x, t: t-1});
    }
}

// Draw grid points
svg_dp.selectAll(".point")
    .data(data_grid)
    .enter().append("circle")
    .attr("class", "point")
    .attr("r", 3)
    .attr("cx", function(d) { return xScale(d.t); })
    .attr("cy", function(d) { return yScale(d.x); });


// var lines = [];
// for (var t = 0; t <= 3; t++) {
//     for (var x = 1; x <= 3; x++) {
//       var point1 = data.find(d => d.t === t && d.x === x);
//       for (var x_nxt = 1; x_nxt <= 3; x_nxt++){
//           var point2 = data.find(d => d.t === t+1 && d.x === x_nxt);
//           if (point1 && point2 && (x===2|t>0)) {
//             lines.push([point1, point2]);
//           }
//       }
//     }
// }
// // Define line generator
// var line = d3.line()
//     .x(function(d) { return xScale(d.t); })
//     .y(function(d) { return yScale(d.x); });

// // Draw lines
// svg_dp.selectAll(".line")
//     .data(lines)
//     .enter().append("path_2")
//     .attr("class", "line")
//     .attr("d", line)
//     .style("stroke", "rgba(0,0,0,0.3)")
//     .style("stroke-width", 1)
//     .style("fill", "none");

svg_dp.append("defs").append("marker")
    .attr("id", "arrowhead_dp")
    .attr("refX", 6 + 3)
    .attr("refY", 2)
    .attr("markerWidth", 13)
    .attr("markerHeight", 9)
    .attr("orient", "right")
    .append("path_2")
    .attr("d", "M2,2 L2,13 L8,7 L2,2");

xa.select("path_2").attr("marker-end", "url(#arrowhead_dp)");
