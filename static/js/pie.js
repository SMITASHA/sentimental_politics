var candidate = "@JoeBiden";

// Construct url for path to twitter data for candidate
var url = `/candidate/${candidate}`;

// Fetch tweet data for candidate
d3.json(url).then(function(twitterData) {
  var totalPositive = 0;
  var totalNegative = 0;

  twitterData.forEach(function(d) {
    totalPositive += d.positive_count;
    totalNegative += d.negative_count;
  });

  var data = [
    { label: "Positive Tweets", value: totalPositive, color: "green" },
    { label: "Negative Tweets", value: totalNegative, color: "red" }
  ];

  var pieContainer = d3.select("#pie"),
    width = 400,
    height = 300,
    margin = 30;

  var pieSvg = pieContainer
    .append("svg:svg")
    .data([data])
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  // Calculate radius
  const radius = Math.min(width, height) / 2 - margin;

  const arc = d3.arc()
      .innerRadius(0)
      .outerRadius(radius);

  const pie = d3.pie() //this will create arc data for us given a list of values
    .value(function(d) {
      return d.value;
    });

  var arcs = pieSvg
    .selectAll("g.slice") //this selects all <g> elements with class slice (there aren't any yet)
    .data(pie) //associate the generated pie data (an array of arcs, each having startAngle, endAngle and value properties)
    .enter() //this will create <g> elements for every "extra" data element that should be associated with a selection. The result is creating a <g> for every object in the data array
    .append("svg:g") //create a group to hold each slice (we will have a <path> and a <text> element associated with each slice)
    .attr("class", "slice"); //allow us to style things in the slices (like text)

  arcs
    .append("svg:path")
    .attr("fill", function(d) {
      return d.color;
    })
    .attr("d", arc)
    .attr("stroke-width", "6px")
    .each(function(d) { this._current = d; });

  arcs
    .append("svg:text")
    .attr("transform", function(d) {
      d.innerRadius = 0;
      d.outerRadius = radius;
      return "translate(" + arc.centroid(d) + ")";
    })
    .attr("text-anchor", "middle")
    .text(function(d, i) {
      return data[i].label;
    });
});