var csvFile = '../data/data.csv'

// Create svg canvas and margins
var svgWidth = 1000;
var svgHeight = 500;

var margin = {
    top: 50,
    bottom: 50,
    left: 100,
    right: 100
};
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Use d3 to append svg group that will hold chart
var svg = d3.select(".scatter")
            .append("svg")
            .attr("width", svgWidth)
            .attr("height", svgHeight);

var chartGroup = svg.append("g")
                    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import data using d3 and create function 
d3.csv(csvFile).then(function(csvData) {

    // Parse data and cast as numbers (not strings)
    csvData.forEach(function(item) {
        item.poverty = +item.poverty;
        item.healthcare = +item.healthcare;
    });

    // Create linear scales
    var xLinearScale = d3.scaleLinear()
                         .domain(d3.extent(csvData, d => d.poverty))
                         .range([0,width]);
    var yLinearScale = d3.scaleLinear()
                         .domain(d3.extent(csvData, d => d.healthcare))
                         .range([height,0]);

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
    // var circlesGroup = chartGroup.selectAll("circle")
    //                              .data(hairData)
    //                              .enter()
    //                              .append("circle")
    //                              .attr("cx", d => xLinearScale(d.hair_length))
    //                              .attr("cy", d => yLinearScale(d.num_hits))
    //                              .attr("r", "15")
    //                              .attr("fill", "pink")
    //                              .attr("opacity", ".5");

})