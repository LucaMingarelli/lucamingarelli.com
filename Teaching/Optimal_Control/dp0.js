// var dp_width = document.getElementById("double_integrator_figure").offsetWidth
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
    .html("\\(0\\)"); 
svg_dp.append("g")
    .attr("transform", "translate(400,0)")
    .call(yAxis2)
    .append("svg:foreignObject")
    .attr("width", 20)
    .attr("height", 20)
    .attr("transform", "translate(-25,145)")
    .append("xhtml:div")
    .html("\\(0\\)"); 



svg_dp.append("g")
    .attr("transform", "translate(50,0)")
    .call(yAxis)
    .append("svg:foreignObject")
    .attr("width", 20)
    .attr("height", 20)
    .attr("transform", "translate(-25,75)")
    .append("xhtml:div")
    .html("\\(1\\)"); 
svg_dp.append("g")
    .attr("transform", "translate(400,0)")
    .call(yAxis2)
    .append("svg:foreignObject")
    .attr("width", 20)
    .attr("height", 20)
    .attr("transform", "translate(-25,75)")
    .append("xhtml:div")
    .html("\\(1\\)"); 


svg_dp.append("g")
    .attr("transform", "translate(50,0)")
    .call(yAxis)
    .append("svg:foreignObject")
    .attr("width", 20)
    .attr("height", 20)
    .attr("transform", "translate(-25,210)")
    .append("xhtml:div")
    .html("\\(-1\\)"); 
svg_dp.append("g")
    .attr("transform", "translate(400,0)")
    .call(yAxis2)
    .append("svg:foreignObject")
    .attr("width", 20)
    .attr("height", 20)
    .attr("transform", "translate(-25,210)")
    .append("xhtml:div")
    .html("\\(-1\\)"); 



svg_dp.selectAll(".tick text").remove(); // Remove tick-labels



var DELTA_dp = 10-0.35
// Generate data for grid points
var data_grid = [];
for (var x_ = 1; x_ < 4; x_++) {
    for (var t_ = 1; t_ <= 6; t_++) {
        data_grid.push({x: x_, t: t_-1});
    }
}
for (var x_ = 1; x_ < 4; x_++) {
    for (var t_ = 1+DELTA_dp; t_ <= 6+DELTA_dp; t_++) {
        data_grid.push({x: x_, t: t_-1});
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


var lines_dp = [];
for (var t_ = 0; t_ <= 4; t_++) {
    for (var x_ = 1; x_ <= 3; x_++) {
      var point1 = data_grid.find(d => d.t === t_ && d.x === x_);
      for (var x_nxt = 1; x_nxt <= 3; x_nxt++){
        for (var t_nxt = t_; t_nxt <= 4; t_nxt++){
            var point2 = data_grid.find(d => d.t === t_+1 && d.x === x_nxt);
            if (point1 && point2 && (x_===2|t_>0)) {
                lines_dp.push([point1, point2]);
            }
        }
      }
    }
}

for (var t_ = DELTA_dp; t_ <= 4+DELTA_dp; t_++) {
    for (var x_ = 1; x_ <= 3; x_++) {
      var point1 = data_grid.find(d => d.t === t_ && d.x === x_);
      for (var x_nxt = 1; x_nxt <= 3; x_nxt++){
          var point2 = data_grid.find(d => d.t === t_+1 && d.x === x_nxt);
          if (point1 && point2 && (x_===2|t_>DELTA_dp)) {
            lines_dp.push([point1, point2]);
          }
      }
    }
}

// Define line generator
var line_dp = d3.line()
    .x(function(d) { return xScale(d.t); })
    .y(function(d) { return yScale(d.x); });

// Draw lines
svg_dp.selectAll(".line")
    .data(lines_dp)
    .enter().append("path")
    .attr("class", "line")
    .attr("d", line_dp)
    .style("stroke", "rgba(255,0,0,0.12)")
    .style("stroke-width", 1)
    .style("fill", "none");


