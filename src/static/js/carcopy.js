// test file
async function car() {
    const data = await d3.csv("/src/static/data/cars2017.csv ");
    console.log(data);
	var padding = {
		top: 20,
		bottom: 20,
		left: 20,
		right: 20
	};
    var
        svgWidth = 500,
        svgHeight = 300,
		width = svgWidth - padding.left - padding.right,
        height = svgHeight - padding.left - padding.right,

        svg = d3.select("#state").append("svg")
            .attr("width", svgWidth)
            .attr("height", height),
		plotArea = svg.append('g')
			.attr('transform',  'translate(' + padding.left + ',' + padding.top + ')'),
		xScale = d3.scaleLog().base(10).domain([10, 150]).range([0, width]),
        yScale = d3.scaleLog().base(10).domain([10, 150]).range([height, 0]);

	var
		update = plotArea.selectAll('circle').data(data),
		join = update.enter().append('circle').merge(update);

	join.attr('cx', function(d, i){return xScale(data[i].AverageCityMPG);})
		.attr('cy', function(d, i){return yScale(data[i].AverageHighwayMPG);})
        .attr('r', function(d, i){return 2 + parseInt(data[i]. EngineCylinders);})
        .attr('fill', 'lightblue')
        .attr('stroke', 'black');

	var
		xAxis = d3.axisBottom(xScale)
			.tickValues([10, 20, 50, 100])
			.tickFormat(d3.format("~s")),
		yAxis = d3.axisLeft(yScale)
			.tickValues([10, 20, 50, 100])
			.tickFormat(d3.format("~s"));

    svg.append('g')
	    .attr('transform', 'translate(' + padding.left + ',' + padding.top + ')').call(yAxis);
    svg.append('g')
	    .attr('transform', 'translate(' + padding.left + ',' + (padding.top + height) + ')').call(xAxis);
}