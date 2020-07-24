async function usmap() {
    const
        height = 565,
        width = 900;

    var
        svg = d3.select("#us").append("svg")
            .attr("width", width)
            .attr("height", height),

        x = d3.scaleLinear()
            .domain([0, 180]) // TODO
            .rangeRound([550, 810]),

        color = d3.scaleThreshold()
            .domain(d3.range(20, 180, 20)) // TODO
            .range(d3.schemeBlues[9]),

    // main plot area for both map and scale bar
        g = svg.append("g")
            .attr("id", "plotarea")
            .attr("transform", "translate(0,30)"),

    // scale bar
        scale = g.append("g")
            .attr("id", "scale");

    scale.selectAll("rect")
        .data(color.range().map(bin => {
            bin = color.invertExtent(bin);
            if (bin[0] === undefined) bin[0] = x.domain()[0]; // left side of scale bar
            if (bin[1] === undefined) bin[1] = x.domain()[1]; // right side of scale bar
            return bin;
        }))
        .enter().append("rect")
        .attr("height", 8)
        .attr("x", bin => x(bin[0]))
        .attr("width", bin => x(bin[1]) - x(bin[0]))
        .attr("fill", bin => color(bin[0]));

    scale.append("text")
        .attr("x", x.range()[0])
        .attr("y", -6)
        .attr("fill", "#fff")
        .attr("text-anchor", "start")
        // .attr("font-weight", "bold")
        .text("Confirmed case");

    scale.call(d3.axisBottom(x)
        .tickSize(13)
        .tickFormat((x, i) => x)
        .tickValues(color.domain()))
        .select(".domain")
        .remove();

    // map area
    var
        confirmed = d3.map(), // TODO
        location = {
            county: d3.map(),
            state: d3.map()
        },
        path = d3.geoPath(),
        promises = [
            d3.json("/src/static/data/counties-albers-10m.json"),
            d3.csv("/src/static/data/confirmed_us_last_date.csv", d => {
                // if (d.Date === "6/10/20")
                // var date = "6/10/20";
                    confirmed.set(d.Fips, +d.Confirmed);
                    location.county.set(d.Fips, d.County);
                    location.state.set(d.Fips, d.State);
            })
        ];

    Promise.all(promises).then(([us]) => {
        var map = svg.append("g")
            .attr("id", "maparea")
            .attr("transform", "scale(0.93, 0.93)"); // from 960px to 900px

        map.append("g")
            .attr("class", "counties")
            .selectAll("path")
            .data(topojson.feature(us, us.objects.counties).features)
            .enter().append("path")
            .attr("fill", d => color(d.Confirmed = confirmed.get(+d.id)))
            .attr("d", path).attr("class", "counties-path")
            .append("title")
            // .attr("data-tooltip", d => ("Total confirmed: " + d.Confirmed));
            .text(d => (`State: ` + location.state.get(+d.id) + `\n`
                + `County: ` + location.county.get(+d.id) + `\n`
                + `Total confirmed: ` + d.Confirmed));

        var counties = d3.selectAll(".counties-path");

        counties.append("div").attr("class", "tooltip");

        map.append("path")
            .datum(topojson.mesh(us, us.objects.states, (a, b) => a !== b))
            .attr("class", "states")
            .attr("d", path);
    });
}
