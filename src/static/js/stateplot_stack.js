
async function stateplot() {
	const data = await d3.csv("/src/static/data/state.csv");
	data.forEach(d => {
		d.Infected = +d.Active;
		d.Confirmed = +d.Confirmed;
		d.Deaths = +d.Deaths;
		d.Recovered = +d.Recovered;
		d.Hospitalization_Rate = +d.Hospitalization_Rate;
		d.Incident_Rate = +d.Incident_Rate;
		d.Mortality_Rate = +d.Mortality_Rate;
		d.Testing_Rate = +d.Testing_Rate;
	});
	// console.log(data);

	var
		states = [...new Set(data.map(d => d.Province_State))],
		keys = ["Deaths", "Infected", "Recovered"],
		keysColor = ["red", "#db9e2c", "lightblue"];


	var padding = {
		top: 10,
		bottom: 50,
		left: 50,
		right: 50
	};

    var
        svgWidth = 900,
        svgHeight = 450,
		width = svgWidth - padding.left - padding.right,
		height = svgHeight - padding.left - padding.right,

        svg = d3.select("#state").append("svg")
            .attr("width", svgWidth)
            .attr("height", svgHeight),
		plotArea = svg.append("g")
			.attr("transform",  "translate(" + padding.left + "," + padding.top + ")"),

		xScale = d3.scaleBand().range([0, width]).padding(0.2),
		yScale = d3.scaleLinear().range([height, 0]);
		zScale = d3.scaleOrdinal()
			.range(keysColor)
			.domain(keys);

	svg.append("g")
		.attr("transform", "translate(" + padding.left + "," + padding.top + ")")
		.attr("class", "y-axis");
    svg.append("g")
		.attr("transform", "translate(" + padding.left + "," + (padding.top + height) + ")")
		.attr("class", "x-axis")
		.selectAll("text").attr("transform", "rotate(45)").style("text-anchor", "start");

	update(2500);

	function update(speed){

		yScale.domain([0, d3.max(data, d => d.Confirmed)]);
		var	yAxis = d3.axisLeft(yScale);
		svg.selectAll(".y-axis")
			.transition().duration(speed)
			.call(yAxis);

		/*
		data.sort(d3.select("input.sort").property("checked")
			? (a, b) => b.total - a.total
			: (a, b) => states.indexOf(a.State) - states.indexOf(b.State));
		*/

		xScale.domain(data.map(d => d.Province_State));
		var	xAxis = d3.axisBottom(xScale);
		svg.selectAll(".x-axis")
			.transition().duration(speed)
			.call(xAxis)
			.selectAll("text").attr("transform", "rotate(45)").style("text-anchor", "start");

		var group = plotArea.selectAll("g.layer")
			.data(d3.stack().keys(keys)(data), d => d.key);

		group.exit().remove();

		group.enter().append("g")
			.classed("layer", true)
			.attr("fill", d => zScale(d.key));

		var bars = svg.selectAll("g.layer").selectAll("rect")
			.data(d => d, e => e.data.Province_State);

		bars.exit().remove();

		bars.enter().append("rect")
				.attr("width", xScale.bandwidth())
				.attr("x", d => xScale(d.data.Province_State))
				.attr("y", d => yScale(0))
				.attr("stroke", "black")
				.merge(bars)
			.transition().duration(speed)
				.attr("width", xScale.bandwidth())
				.attr("x", d => xScale(d.data.Province_State))
				.attr("y", d => yScale(d[1])) // d[0] means the bottom of a stack, d[1] for top
				.attr("height", d => yScale(d[0]) - yScale(d[1]));

	}

	// plot legend
	var lengend = plotArea.selectAll(".legend").data(keys).enter()
		.append("g")
		.attr("class", "lengend");

	lengend.append("rect")
		.attr("width", "18")
		.attr("height", "12")
		.attr("x", width - 20)
		.attr("y", (d, i) => 20 * i)
		.style("fill", (d, i) => keysColor[i])
		.style("stroke", "black");

	lengend.append("text")
		.attr("x", width - 24)
		.attr("y", (d, i) => 20 * i + 10)
		.style("text-anchor", "end")
		.attr("fill", "#fff")
		.text(d => d);

	/*
	d3.select("input.sort")
		.on("click", update(2500));
	*/
}