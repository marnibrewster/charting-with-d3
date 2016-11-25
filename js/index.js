var margin = {
    top: 30,
    right: 20,
    bottom: 70,
    left: 200
  },
  width = 1200 - margin.left - margin.right,
  height = 800 - margin.top - margin.bottom;

var x = d3.scale.ordinal().rangeRoundBands([0, width], 0);
var y = d3.scale.log()
   .base(2)
   .range([height, 100]);

// define the axis
var xAxis = d3.svg.axis()
  .scale(x)
  .orient("bottom")
  .tickFormat(function(d) {
    return ['1947', '1957', '1967', '1977', '1987', '1997', '2007', '2015'][d]
  });

var yAxis = d3.svg.axis()
  .scale(y)
  .orient("left")
  .ticks(5)
  .tickFormat(function(d) {return ( "$" + d +" Billion") })

var div = d3.select("body").append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {

    return "<strong>Date:</strong> <span style='color:gray'>" + d.Year + " <span style='color:white'><strong>GDP: </strong> <span style='color:gray'> " + d.GDP + "</span>";
  });

// add the SVG element
var svg = d3.select(".chart").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform",
    "translate(" + margin.left + "," + margin.top + ")");
//load tooltip
svg.call(tip);

// load the data
d3.json("https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json", function(error, data) {

  data = data.data;
  data.forEach(function(d) {
    d.Year = d[0];
    d.GDP = +d[1];
  });

  // scale the range of the data
  x.domain(data.map(function(d) {
    return d.Year;
  }));

  y.domain([200, d3.max(data, function(d){
    return d.GDP;
  })])
   
  svg.append("g")
    .attr("class", "x-axis")
    .attr("class", "h2")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    .append("text")
    //.style("text-anchor", "end")
    .attr("dx", "10em")
    .attr("dy", "2em")
    .text("Year (1947 to 2015)")

  svg.append("g")
    .attr("class", "y-axis")
    .attr("class", "h4")
    .call(yAxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", "1em")
    .attr("x", -400 )
    //.style("text-anchor", "end")
    .text("Gross Domestic Product, USA");

  // Add bar chart
  svg.selectAll("bar")
    .data(data)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", function(d) {
      return x(d.Year);
    })
    .attr("width", x.rangeBand())
    .attr("y", function(d) {
      return y(d.GDP);
    })
    .attr("height", function(d) {
      return height - y(d.GDP);
    })
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide);

});