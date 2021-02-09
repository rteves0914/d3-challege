var csvFile = 'assets/data/data.csv'

// Create svg canvas and margins
var svgWidth = 1000;
var svgHeight = 500;

var margin = {
    top: 50,
    bottom: 80,
    left: 100,
    right: 100
};
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Use d3 to append svg group that will hold chart
var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import data using d3 and create function 
d3.csv(csvFile).then(function (csvData) {

    // Parse data and cast as numbers (not strings)
    csvData.forEach(function (item) {
        item.poverty = +item.poverty;
        item.healthcare = +item.healthcare;
    });

    // Create linear scales
    var xLinearScale = d3.scaleLinear()
        .domain(d3.extent(csvData, d => d.poverty))
        .range([0, width]);
    var yLinearScale = d3.scaleLinear()
        .domain(d3.extent(csvData, d => d.healthcare))
        .range([height, 0]);

    // Create the axis
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Append the axes to the chart
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);
    chartGroup.append("g")
        .call(leftAxis);

    // Create the circles inside the plot
    var circlesGroup = chartGroup.selectAll("circle")
        .data(csvData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", "15")
        .attr("class", "stateCircle")
        .attr("opacity", ".5");

    // Create the abbreviation insdie the circles
    var abbrevGroup = chartGroup.selectAll("stateText")
        .data(csvData);

    abbrevGroup.enter()
        .append("text")
        .attr("class", "stateText")
        .attr("x", d => xLinearScale(d.poverty))
        .attr("y", d => yLinearScale(d.healthcare))
        .style("text-anchor", "middle")
        .attr("dy", 4)
        .text(d => d.abbr)
        .attr("fill-opacity", 1);

    // Initialize and create tool tip
    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function (d) {
            return (`${d.abbr}<br>Poverty: ${d.poverty}<br>Healthcare: ${d.healthcare}`);
        });
    chartGroup.call(toolTip);

    // Create event listeners to display tool tip
    circlesGroup.on("click", function (data) {
        toolTip.show(data, this);
    })

        .on("mouseout", function (data, index) {
            toolTip.hide(data);
        });

    // Create axes labels
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("% in Poverty");

    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
        .attr("class", "axisText")
        .text("% Without Healthcare");
}).catch(function (error) {
    console.log(error);

});