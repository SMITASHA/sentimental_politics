var candidate = "@JoeBiden";

// Construct url for path to twitter data for candidate
var url = `/candidate/${candidate}`;


const width = 400;
const height = 300;
const radius = Math.min(width, height) / 2;

const svg = d3
  .select("#pie")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .append("g")
  .attr("transform", `translate(${width / 2}, ${height / 2})`);

const color = d3.scaleOrdinal([
  "#66c2a5",
  "#fc8d62",
]);

const pie = d3
  .pie()
  .value(d => d.value)
  .sort(null);

const arc = d3
  .arc()
  .innerRadius(0)
  .outerRadius(radius);

function arcTween(a) {
  const i = d3.interpolate(this._current, a);
  this._current = i(1);
  return t => arc(i(t));
}

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
  const path = svg.selectAll("path").data(pie(data));

  // Update existing arcs
  path
    .attr("fill", "blue")
    .transition()
    .duration(200)
    .attrTween("d", arcTween);

  // Enter new arcs
  path
    .enter()
    .append("path")
    .attr("fill", "red")
    .attr("d", arc)
    .attr("stroke", "white")
    .attr("stroke-width", "6px")
    .each(function(d) {
      this._current = d;
    });
});
