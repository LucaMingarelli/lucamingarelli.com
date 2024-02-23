// Define SVG dimensions
var svg_dp = d3.select("#dp0_figure")
    .append("svg")
    .attr("width", 700)
    .attr("height", 300)
;

// Define scales
var xScale = d3.scaleLinear().domain([0, 5.5]).range([50, 250]);
var yScale = d3.scaleLinear().domain([0.5, 3.5]).range([250, 50]);
var xScale2 = d3.scaleLinear().domain([0, 5.5]).range([300, 500]);
var yScale2 = d3.scaleLinear().domain([0.5, 3.5]).range([250, 50]);

// Define axes
var xAxis = d3.axisBottom(xScale).ticks(6);
var yAxis = d3.axisLeft(yScale).ticks(4);
var xAxis2 = d3.axisBottom(xScale2).ticks(6);
var yAxis2 = d3.axisLeft(yScale2).ticks(4);



// Draw axes
svg_dp.append("g")
    .attr("transform", "translate(0,250)")
    .call(xAxis)
    .append("svg:foreignObject")
    .attr("width", 20)
    .attr("height", 20)
    .attr("transform", "translate(260,-5)")
    .append("xhtml:div")
    .html("\\(t\\)");
    svg_dp.append("g")
    .attr("transform", "translate(100,250)")
    .call(xAxis2)
    .append("svg:foreignObject")
    .attr("width", 20)
    .attr("height", 20)
    .attr("transform", "translate(510,-5)")
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
    .attr("transform", "translate(400,0)")
    .call(yAxis2)
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
    .attr("transform", "translate(-25,145)")
    .append("xhtml:div")
    .html("\\(x_0\\)"); 
svg_dp.append("g")
    .attr("transform", "translate(400,0)")
    .call(yAxis2)
    .append("svg:foreignObject")
    .attr("width", 20)
    .attr("height", 20)
    .attr("transform", "translate(-25,145)")
    .append("xhtml:div")
    .html("\\(x_0\\)"); 



svg_dp.append("g")
    .attr("transform", "translate(50,0)")
    .call(yAxis)
    .append("svg:foreignObject")
    .attr("width", 20)
    .attr("height", 20)
    .attr("transform", "translate(-25,75)")
    .append("xhtml:div")
    .html("\\(x_1\\)"); 
svg_dp.append("g")
    .attr("transform", "translate(400,0)")
    .call(yAxis2)
    .append("svg:foreignObject")
    .attr("width", 20)
    .attr("height", 20)
    .attr("transform", "translate(-25,75)")
    .append("xhtml:div")
    .html("\\(x_1\\)"); 


svg_dp.append("g")
    .attr("transform", "translate(50,0)")
    .call(yAxis)
    .append("svg:foreignObject")
    .attr("width", 20)
    .attr("height", 20)
    .attr("transform", "translate(-25,210)")
    .append("xhtml:div")
    .html("\\(x_{-1}\\)"); 
svg_dp.append("g")
    .attr("transform", "translate(400,0)")
    .call(yAxis2)
    .append("svg:foreignObject")
    .attr("width", 20)
    .attr("height", 20)
    .attr("transform", "translate(-25,210)")
    .append("xhtml:div")
    .html("\\(x_{-1}\\)"); 



svg_dp.selectAll(".tick text").remove(); // Remove tick-labels



var DELTA_dp = 10-0.35
// Generate data for grid points
var data_grid = [];
for (var x = 1; x < 4; x++) {
    for (var t = 1; t <= 6; t++) {
        data_grid.push({x: x, t: t-1});
    }
}
for (var x = 1; x < 4; x++) {
    for (var t = 1+DELTA_dp; t <= 6+DELTA_dp; t++) {
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


var lines = [];
for (var t = 0; t <= 4; t++) {
    for (var x = 1; x <= 3; x++) {
      var point1 = data_grid.find(d => d.t === t && d.x === x);
      for (var x_nxt = 1; x_nxt <= 3; x_nxt++){
        for (var t_nxt = t; t_nxt <= 4; t_nxt++){
            var point2 = data_grid.find(d => d.t === t+1 && d.x === x_nxt);
            if (point1 && point2 && (x===2|t>0)) {
              lines.push([point1, point2]);
            }
        }
      }
    }
}

for (var t = DELTA_dp; t <= 4+DELTA_dp; t++) {
    for (var x = 1; x <= 3; x++) {
      var point1 = data_grid.find(d => d.t === t && d.x === x);
      for (var x_nxt = 1; x_nxt <= 3; x_nxt++){
          var point2 = data_grid.find(d => d.t === t+1 && d.x === x_nxt);
          if (point1 && point2 && (x===2|t>DELTA_dp)) {
            lines.push([point1, point2]);
          }
      }
    }
}

// Define line generator
var line = d3.line()
    .x(function(d) { return xScale(d.t); })
    .y(function(d) { return yScale(d.x); });

// Draw lines
svg_dp.selectAll(".line")
    .data(lines)
    .enter().append("path")
    .attr("class", "line")
    .attr("d", line)
    .style("stroke", "rgba(255,0,0,0.12)")
    .style("stroke-width", 1)
    .style("fill", "none");


