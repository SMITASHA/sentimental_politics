var pieContainer = d3.select("#pie"),
      width = 400,
      height = 300,
      margin = 30;
  
var pieSvg = pieContainer
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

// Calculate radius
const radius = Math.min(width, height) / 2 - margin;

var candidate = "@JoeBiden";

// Construct url for path to twitter data for candidate
var url = `/candidate/${candidate}`;



// Fetch tweet data for candidate
d3.json(url).then(function(twitterData) {

    var totalPositive = 0;
    var totalNegative = 0;

    twitterData.forEach(function (d) {
        totalPositive += d.positive_count;
        totalNegative += d.negative_count;
    });

    const data = {positive: totalPositive, negative: totalNegative};

    // set the color scale
    var color = d3.scaleOrdinal()
        .domain(data)
        .range(["#98abc5", "#8a89a6"]);

    // Compute the position of each group on the pie:
    var pie = d3.pie()
    .value(function(d) {return d.value; });
    var data_ready = pie(d3.entries(data));

    // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    pieSvg.selectAll('slice')
        .data(data_ready)
        .enter()
        .append('path')
        .attr('d', d3.arc()
            .innerRadius(0)
            .outerRadius(radius)
        )
        .attr('fill', function(d){ return(color(d.data.key)) })
        .attr("stroke", "black")
        .style("stroke-width", "2px")
        .style("opacity", 0.7);
});

