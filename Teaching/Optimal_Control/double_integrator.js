MathJax.Hub.Config({ TeX: { extensions: ["color.js"] }});

function get_val(y, t0, y0, cond){
  if (cond) {
    traj =  2*t0*(y+2*t0) - (y+2*t0)*(y+2*t0)/2 - t0*t0
    if (y>y0){traj=NaN}
    if (y < -Math.sqrt(2*Math.abs(traj))){traj=NaN}
    
  } else {
    traj = -2*t0*(-y+2*t0)+(-y+2*t0)*(-y+2*t0)/2 + t0*t0 
    if (y<y0){traj=NaN}
    if (traj>0 & y>Math.sqrt(2*traj)){traj=NaN}
    if (traj<0 & y>Math.sqrt(-2*traj)){traj=NaN}


  }
    return traj
}
function get_val2(y, t0, y0, cond){
  if (cond) {
    traj =  2*t0*(y+2*t0) - (y+2*t0)*(y+2*t0)/2 - t0*t0
    inrsct = -Math.sqrt(2*Math.abs(traj))
    traj = -Math.sign(y)*y*y/2
    if (y>0){traj=NaN} 
    if (y<=inrsct ){traj=NaN}
    
  } else {
    traj = -2*t0*(-y+2*t0)+(-y+2*t0)*(-y+2*t0)/2 + t0*t0 
    inrsct = Math.sqrt(2*Math.abs(traj))
    traj = -Math.sign(y)*y*y/2
    if (y<0){traj=NaN} 
    if (y>inrsct ){traj=NaN}

  }
    return traj
}

function sampleData(data, n) {
var step = Math.floor(data.length / n);
var sampledData = [];
for (var i = 0; i < data.length; i += step) {
  sampledData.push(data[i]);
}
return sampledData;
}

var N_ARROWS = 2.5
var ARROW_SIZE = 2
var PATH_WIDTH = 1.5

// set the dimensions and margins of the graph
var margin = {top: 30, bottom: 30, right: document.getElementById("double_integrator_figure").offsetWidth/8, left: document.getElementById("double_integrator_figure").offsetWidth/8},
width = document.getElementById("double_integrator_figure").offsetWidth*3/4 - document.getElementById("double_integrator_figure").offsetWidth/4,
height = 350 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#double_integrator_figure")
.append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform",
    "translate(" + margin.left + "," + margin.top + ")");


// Define arrow markers for graph lines
svg.append('defs').append('marker')
.attr('id', 'arrowR')
.attr('viewBox', '-0 -5 10 10')
.attr('refX', 0) /* must be smarter way to calculate shift */
.attr('refY', 0)
.attr('orient', 'auto')
.attr('markerWidth', 15)
.attr('markerHeight', 5)
.attr('xoverflow', 'visible')
.append('svg:path')
.attr('d', 'M 0,-5 L 0 ,5 L -10,0')
.style('stroke','none')
.style('fill', 'black');

// Define arrow markers for graph lines
svg.append('defs').append('marker')
.attr('id', 'arrowL')
.attr('viewBox', '-0 -5 10 10')
.attr('refX', 0) 
.attr('refY', 0)
.attr('orient', 'auto')
.attr('markerWidth', 15)
.attr('markerHeight', 5)
.attr('xoverflow', 'visible')
.append('svg:path')
.attr('d', 'M 0,-5 L 10 ,0 L 0,5')
.style('stroke','none')
.style('fill', 'black');


// Add X axis 
var x = d3.scaleLinear()
.domain([-50,50])
.range([ 0, width ]);

// Add Y axis
var y = d3.scaleLinear()
.domain([-10, 10]) 
.range([ height, 0 ]);

// Define arrow markers for graph lines
svg.append('defs').append('marker')
.attr('id', 'arrowhead')
.attr('viewBox', '-0 -5 10 10')
.attr('refX', 0) 
.attr('refY', -0.5)
.attr('orient', 'auto')
.attr('markerWidth', 8)
.attr('markerHeight', 8)
.attr('xoverflow', 'visible')
.append('svg:path')
.attr('d', 'M 0,-5 L 10 ,0 L 0,5')
.style('stroke','none');

var xAxis = d3.axisBottom(x).tickSizeOuter(0).tickSizeInner(0);
var yAxis = d3.axisLeft(y).tickSizeOuter(0).tickSizeInner(0);

svg.append("g")
.attr("transform", "translate(0," + y(0) + ")") // This centers the x-axis at y=0
.call(xAxis)
.selectAll("text").style("display", "none"); // hides ticks and tick labels
svg.append("path")
.attr("marker-end", "url(#arrowhead)")
.attr("d", `M ${x(0)},${y(0)} L ${x(50)},${y(0)}`);

svg.append("g")
.attr("transform", "translate(" + x(0) + ",0)") // This centers the y-axis at x=0
.call(yAxis)
.selectAll("text").style("display", "none"); // hides ticks and tick labels
svg.append("path")
.attr("marker-start", "url(#arrowhead)")
.attr("d", `M ${x(0)},${y(9.999)}  ${x(0)},${y(10)}`);

// For x-axis label
svg.append("g")             
.attr("transform",
      "translate(" + x(52) + " ," + (y(0) + 20) + ")")
.append("svg:foreignObject")
    .attr("width", 40)
    .attr("height", 20)
    .attr("transform", "translate(-20,-15)")
    .append("xhtml:div")
    .html("\\(x\\)");


// For y-axis label
svg.append("g")             
.attr("transform",
      "translate(" + (x(0) - 15) + " ," +  y(10) + ")")
.append("svg:foreignObject")
    .attr("width", 40)
    .attr("height", 20)
    .attr("transform", "translate(-20,-15)")
    .append("xhtml:div")
    .html("\\(v\\)");




// For f=1 label
svg.append("g")             
.attr("transform",
      "translate(" + (x(52) + 15) + " ," + 
                    (y(-10) + 5) + ")")
.append("svg:foreignObject")
.attr("width", 80)
.attr("height", 20)
.attr("transform", "translate(-30,-10)")
.append("xhtml:div")
.html("\\(f=+1\\)");


// For f=-1 label
svg.append("g")             
.attr("transform",
      "translate(" + (x(-52) - 15) + " ," + 
                    (y(10) + 5) + ")")
.append("svg:foreignObject")
    .attr("width", 80)
    .attr("height", 20)
    .attr("transform", "translate(-30,-10)")
    .append("xhtml:div")
    .html("\\(\\definecolor{blue}{RGB}{0,0,255}{\\color{blue} f=-1}\\)");


// Define the line
var line = d3.line()
.x(function(d) { return x(d.x); })
.y(function(d) { return y(d.y); }); 

// Generate data points for x from 1 to 100
var data = d3.range(-1001,1001).map(function(d) {
d = d/100
return {"x": get_val(d, 6, 6, 1), 
      "y": d}; 
});

var data2 =  d3.range(-1001,1001).map(function(d) {
d = d/100
return {"x": get_val2(d, 6, 6, 1), 
      "y": d}; 
});;

data = data.filter(function(d) {return !isNaN(d.x);});
data2 = data2.filter(function(d) {return !isNaN(d.x);});

var data_t0 = d3.range(-101,101).map(function(d) {
d = d/10
return {"x": -Math.sign(d)*d*d/2, 
      "y": d}; 
});
var data_t1 = d3.range(-101,101).map(function(d) {
           d = d/10
          return {"x": get_val(d, 2.5, 10, 1), 
                  "y": d};
                  });
var data_t2 = d3.range(-101,101).map(function(d) {
           d = d/10
          return {"x": get_val(d, 5, 10, 1), 
                  "y": d};
                  });
var data_t3 = d3.range(-101,101).map(function(d) {
           d = d/10
          return {"x": get_val(d, 7.5, 10, 1), 
                  "y": d};
                  });
data_t1 = data_t1.filter(function(d) {return !isNaN(d.x);});
data_t2 = data_t2.filter(function(d) {return !isNaN(d.x);});
data_t3 = data_t3.filter(function(d) {return !isNaN(d.x);});
var data_t4 = d3.range(-101,101).map(function(d) {
           d = d/10
          return {"x": get_val(d, 2.5, -10, 0), 
                  "y": d};
                  });
var data_t5 = d3.range(-101,101).map(function(d) {
           d = d/10
          return {"x": get_val(d, 5, -10, 0), 
                  "y": d};
                  });
var data_t6 = d3.range(-101,101).map(function(d) {
           d = d/10
          return {"x": get_val(d, 7.5, -10, 0), 
                  "y": d};
                  });
data_t4 = data_t4.filter(function(d) {return !isNaN(d.x);});
data_t5 = data_t5.filter(function(d) {return !isNaN(d.x);});
data_t6 = data_t6.filter(function(d) {return !isNaN(d.x);});

// Add the line
var path = svg.append("path")
.datum(data)
.attr("fill", "none")
.attr("stroke", "black")
.attr("stroke-width", PATH_WIDTH)
.attr("d", line);
var path_m = svg.append("path")
.datum(sampleData(data, N_ARROWS))
.attr("fill", "none")
.attr("stroke", "none")
.attr("stroke-width", ARROW_SIZE)
.attr("d", line)
.attr("marker-mid", "url(#arrowR)");
var path_m2 = svg.append("path")
.datum(sampleData(data2, N_ARROWS))
.attr("fill", "none")
.attr("stroke", "none")
.attr("stroke-width", ARROW_SIZE)
.attr("d", line)
.attr("marker-mid", "url(#arrowL)");;

var path2 = svg.append("path")
.datum(data2)
.attr("fill", "none")
.attr("stroke", "black")
.attr("stroke-width", PATH_WIDTH)
.attr("d", line);


var traj_0 = svg.append("path")
.datum(data_t0)
.attr("fill", "none")
.attr("stroke", "rgba(0, 0, 255, 0.25)")
.attr("stroke-width", 1)
.attr("d", line);
var traj_1 = svg.append("path")
.datum(data_t1)
.attr("fill", "none")
.attr("stroke", "rgba(128, 128, 128, 0.25)")
.attr("stroke-width", 1)
.attr("d", line);
var traj_2 = svg.append("path")
.datum(data_t2)
.attr("fill", "none")
.attr("stroke", "rgba(128, 128, 128, 0.25)")
.attr("stroke-width", 1)
.attr("d", line);
var traj_3 = svg.append("path")
.datum(data_t3)
.attr("fill", "none")
.attr("stroke", "rgba(128, 128, 128, 0.25)")
.attr("stroke-width", 1)
.attr("d", line);
var traj_4 = svg.append("path")
.datum(data_t4)
.attr("fill", "none")
.attr("stroke", "rgba(128, 128, 128, 0.25)")
.attr("stroke-width", 1)
.attr("d", line);
var traj_5 = svg.append("path")
.datum(data_t5)
.attr("fill", "none")
.attr("stroke", "rgba(128, 128, 128, 0.25)")
.attr("stroke-width", 1)
.attr("d", line);
var traj_6 = svg.append("path")
.datum(data_t6)
.attr("fill", "none")
.attr("stroke", "rgba(128, 128, 128, 0.25)")
.attr("stroke-width", 1)
.attr("d", line);

// Create a rect on top of the svg area: this rectangle recovers mouse position
svg.append('rect')
.style("fill", "none")
.style("pointer-events", "all")
.attr('width', width)
.attr('height', height)
.on('mousemove', mousemove);

// What happens when the mouse move -> change the slope of the line.
function mousemove() {
// recover coordinate we need
var x0 = x.invert(d3.mouse(this)[0]);
var y0 = y.invert(d3.mouse(this)[1]);

var t0 = NaN
var traj = NaN
var inrsct = NaN

var cond1 = (x0>0 & -Math.sqrt(2*x0)<y0) | (x0<=0 & Math.sqrt(-2*x0)<y0)
var cond2 = (x0<=0 & Math.sqrt(-2*x0)>y0) | (x0>0 & -Math.sqrt(2*x0)>y0)

if (cond1){      t0 = Math.sqrt(y0*y0/2 + x0)} 
else if (cond2) {t0 = Math.sqrt(y0*y0/2 - x0)}

// Update the data to reflect the new trajectory
data = d3.range(-1001,1001).map(function(d) {
  d = d/100
  return {"x": get_val(d, t0, y0, cond1), 
          "y": d};
});    
data2 = d3.range(-1001,1001).map(function(d) {
  d = d/100
  return {"x": get_val2(d, t0, y0, cond1), 
          "y": d};
});

//Filter out NaNs
data = data.filter(function(d) { return !isNaN(d.x);});
data2 = data2.filter(function(d) {return !isNaN(d.x);});

// Update the line
path.datum(data)
  .attr("d", line);
path2.datum(data2)
  .attr("d", line);
if (cond1){
path_m.datum(sampleData(data, N_ARROWS)).attr("d", line);
path_m2.datum(sampleData(data2, N_ARROWS)).attr("d", line);
} else{ 
path_m.datum(sampleData(data2, N_ARROWS)).attr("d", line);
path_m2.datum(sampleData(data, N_ARROWS)).attr("d", line);
}

}




