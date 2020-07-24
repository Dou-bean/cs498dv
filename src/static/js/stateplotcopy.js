// test file
async function stateplot() {
	const data = await d3.csv("/src/static/data/state.csv");
	data.forEach(d => {
		d.Active = +d.Active;
		d.Confirmed = +d.Confirmed;
		d.Deaths = +d.Deaths;
		d.Recovered = +d.Recovered;
		d.Hospitalization_Rate = +d.Hospitalization_Rate;
		d.Incident_Rate = +d.Incident_Rate;
		d.Mortality_Rate = +d.Mortality_Rate;
		d.Testing_Rate = +d.Testing_Rate;
	});
	console.log(data);

	var padding = {
		top: 10,
		bottom: 50,
		left: 50,
		right: 50
	};
    var
        svgWidth = 900,
        svgHeight = 400,
		width = svgWidth - padding.left - padding.right,
		height = svgHeight - padding.left - padding.right,

        svg = d3.select("#state").append("svg")
            .attr("width", svgWidth)
            .attr("height", svgHeight),
		plotArea = svg.append("g")
			.attr("transform",  "translate(" + padding.left + "," + padding.top + ")"),

		update = plotArea.selectAll("rect").data(data),
		join = update.enter().append("rect").merge(update),

		xScale = d3.scaleBand().range([0, width]).padding(0.2),
		yScale = d3.scaleLinear().range([height, 0]),
		zScale = d3.scaleOrdinal().range().domain(); // todo


	xScale.domain(data.map(d => d.Province_State));
	yScale.domain([0, d3.max(data, d => d.Confirmed)]);


	join.attr("x", (d, i) => xScale(d.Province_State))
		.attr("width", xScale.bandwidth())
		.attr("y", (d, i) => yScale(0))
		.attr("height", (d, i) => height - yScale(0))
        .attr("fill", "lightblue")
		.attr("stroke", "black")
		.transition().duration(2500)
		.attr("y", (d, i) => yScale(d.Confirmed))
		.attr("height", (d, i) => height - yScale(d.Confirmed));

	var
		xAxis = d3.axisBottom(xScale);
			//.tickValues([10, 20, 50, 100])
			//.tickFormat(d3.format("~s")),
		yAxis = d3.axisLeft(yScale);
			//.tickValues([10, 20, 50, 100])
			//.tickFormat(d3.format("~s"));

    svg.append("g")
	    .attr("transform", "translate(" + padding.left + "," + padding.top + ")").call(yAxis);
    svg.append("g")
		.attr("transform", "translate(" + padding.left + "," + (padding.top + height) + ")").call(xAxis)
		.selectAll("text").attr("transform", "rotate(45)").style("text-anchor", "start");
}