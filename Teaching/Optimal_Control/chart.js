chart = {
    const width = 928;
    const height = 600;
    const marginTop = 10;
    const marginRight = 20;
    const marginBottom = 30;
    const marginLeft = 40;
  
    const values = Float64Array.from(aapl, d => d.Close);
  
    const x = d3.scaleTime()
        .domain(d3.extent(aapl, d => d.Date))
        .rangeRound([marginLeft, width - marginRight]);
  
    const y = d3.scaleLog()
        .domain(d3.extent(values))
        .rangeRound([height - marginBottom - 20, marginTop]);
  
    const line = d3.line()
        .defined((y, i) => !isNaN(aapl[i].Date) && !isNaN(y))
        .x((d, i) => x(aapl[i].Date))
        .y(y);
    
    const svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto;");
  
    svg.append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(d3.axisBottom(x).ticks(width / 80))
        .call(g => g.select(".domain").remove());
  
    svg.append("g")
        .attr("transform", `translate(${marginLeft},0)`)
        .call(d3.axisLeft(y).tickValues(d3.ticks(...y.domain(), 10)).tickFormat(d => d))
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick line").clone()
            .attr("x2", width - marginLeft - marginRight)
            .attr("stroke-opacity", 0.1))
        .call(g => g.select(".tick:last-of-type text").clone()
            .attr("x", 3)
            .attr("text-anchor", "start")
            .attr("font-weight", "bold")
            .text("↑ Daily close ($)"));
  
    svg.append("g")
        .attr("fill", "none")
        .attr("stroke-width", 1.5)
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
      .selectAll()
      .data([values, ...bollinger(values, N, [-K, 0, +K])])
      .join("path")
        .attr("stroke", (d, i) => ["#aaa", "green", "blue", "red"][i])
        .attr("d", line);
  
    return svg.node();
  }