
d3.csv("/src/static/data/time_series_state.csv").then(data => timeseries(data));

function timeseries(data) {
    var
        states = data.columns.slice(1);

    // modify data in place
    //states.forEach(element => data.forEach(d => data[element] = +data[element]));
    console.log(data);

    var
        padding = {
		    top: 10,
		    bottom: 50,
		    left: 80,
		    right: 50
        },

        svgWidth = 900,
        svgHeight = 450,
		width = svgWidth - padding.left - padding.right,
		height = svgHeight - padding.left - padding.right,

        svg = d3.select("#time").append("svg")
            .attr("width", svgWidth)
            .attr("height", svgHeight),

        xScale = d3.scaleBand().range([0, width]).padding(0.2)
            .domain(data.map(d => d.Date)),

        // yScale domain changes and will be added in another function
        yScale = d3.scaleLinear().range([height, 0]);

        options = d3.select("#state-selector").selectAll("option")
		        .data(states).enter().append("option")
                .text(d => d);

    svg.append("g")
		.attr("transform", "translate(" + padding.left + "," + padding.top + ")")
        .attr("class", "y-axis"); // to be associated with yScale later

    svg.append("g")
		.attr("transform", "translate(" + padding.left + "," + (padding.top + height) + ")")
        .attr("class", "x-axis")
        .call(d3.axisBottom(xScale).tickValues(xScale.domain().filter(function(d,i){ return !((i)%10)})));
        //.selectAll("text").attr("transform", "rotate(45)").style("text-anchor", "start");

    svg.append("g")
        .attr("transform", "translate(" + padding.left + "," + padding.top + ")")
        .attr("class", "plot-line-chart");

    var state = "Total";
    plotLineChart(data, state, xScale, yScale, height);

    // apply the selected value to update the plot
    var selection = d3.select("#state-selector");
    selection.on("change", () => plotLineChart(data, selection.node().value, xScale, yScale, height));
}

function plotLineChart(data, state, xScale, yScale, height) {

    // add yAxis
    yScale.domain([0, d3.max(data, d => +d[state])]);
    //console.log(yScale(+data[170][state]));
    // var height = d3.select("#time").select("svg").attr("height");

    d3.select("g.y-axis").transition().duration(500)
        .call(d3.axisLeft(yScale));

    // line object formed after y-domain is determined
    // this was finally not used since the circle density is high enough
    var line = d3.line()
            .x((d, i) => xScale(i)) // set the x values for the line generator
            .y(d => yScale(+d[state])) // set the y values for the line generator
            .curve(d3.curveMonotoneX) // apply smoothing to the line

    d3.select(".plot-line-chart").selectAll("circle").remove();
    var plotArea = d3.select(".plot-line-chart").selectAll("circle").data(data).enter().append("circle")
            .attr("class", "dot")
            .attr("r", 4)
            .attr("cx", d => xScale(d.Date))
            .attr("cy", d => yScale(height))
        .transition().duration(2000)
            .attr("cy", d => yScale(+d[state]));
    //console.log(plotArea);

    d3.select(".tooltip-notation").style("opacity", 0).html("");

    if (state === "Total") setTimeout(plotAnnotation, 2000);
}

function plotAnnotation(){
    d3.select(".plot-line-chart").append("circle")
            .attr("class", "annotation")
            .attr("cx", 630)
            .attr("cy", 137)
            .attr("r", 40);
    d3.select("#time").append("div")
            .attr("class", "tooltip-notation")
            .attr("opacity", 1)
            .style("left", "560px")
            .style("top", "360px")
            .style("height", "20px")
            .style("width", "130px")
            .html("<p>Second turning point</p>");
}