function selectCandidate(candidate) {
  /**
    /* Defines actions for when candidate is selected
    /* @param {string}    candidate    Name of selected candidate
    */

  // Remove selection styling from other candidate cards
  

  // Apply selection styling to selected candidate card

  // Construct url for path to twitter data for candidate
  var url = `/candidate/${candidate}`;

  // Fetch tweet data for candidate
  d3.json(url).then(function(twitterData) {
    updateBar(twitterData);
    createPie(twitterData);
  });
}

function updateBar(twitterData) {

  xScale0.domain(twitterData.map(d => d.date));
  xScale1.domain(["positive_count", "negative_count"]).range([0, xScale0.bandwidth()]);
  // yScale.domain([0, d3.max(twitterData, d => d.positive_count > d.negative_count ? d.positive_count : d.negative_count)]);
  
  // Create object for bars
  var dates = chartGroup.selectAll(".date")
    .remove()
    .exit()
    .data(twitterData)
    .enter()
    .append("g")
    .attr("class", "date")
    .attr("transform", d => `translate(${xScale0(d.date)}, 0)`);

  /* Add positive_count bars */
  dates
    .selectAll(".bar.positive_count")
    .data(d => [d])
    .enter()
    .append("rect")
    .merge(dates)
    .transition()
    .duration(100)
    .attr("class", "bar positive_count")
    .style("fill", "green")
    .attr("x", d => xScale1("positive_count"))
    .attr("y", d => yScale(d.positive_count))
    .attr("width", xScale1.bandwidth())
    .attr("height", d => {
      return chartHeight - yScale(d.positive_count);
    });
    // .on("mouseover", function(d) {
    //   posToolTip.show(d, this);
    //   d3.select(this).style("fill", "green");
    //   })
    // .on("mouseout", function(d) {
    //   posToolTip.hide(d, this);
    //   d3.select(this).style("fill", "blue");
    //   });

    /* Add negative_count bars */
  dates
    .selectAll(".bar.negative_count")
    .data(d => [d])
    .enter()
    .append("rect")
    .merge(dates)
    .transition()
    .duration(100)
    .attr("class", "bar negative_count")
    .style("fill", "red")
    .attr("x", d => xScale1("negative_count"))
    .attr("y", d => yScale(d.negative_count))
    .attr("width", xScale1.bandwidth())
    .attr("height", d => {
      return chartHeight - yScale(d.negative_count);
    });
    // .on("mouseover", function(d) {
    //   negToolTip.show(d, this);
    //   d3.select(this).style("fill", "green");
    //   })
    // .on("mouseout", function(d) {
    //   negToolTip.hide(d);
    //   d3.select(this).style("fill", "red");
    // });

  // Attach tooltips to chart
  // chartGroup.call(posToolTip);
  // chartGroup.call(negToolTip);
  dates.exit().remove();
}

function createPie(twitterData) {

}


/* Set up bar chart */
// Define svg dimension parameters
var svgWidth = 500;
var svgHeight = 300;
var barPadding = 0.2;
var axisTicks = { qty: 8, outerSize: 0, dateFormat: "%m-%d" };
var chartMargin = {
  top: 30,
  right: 20,
  bottom: 50,
  left: 50
};
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

// Create svg object and append a group
var svgBar = d3
  .select("#bar")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svgBar
  .append("g")
  .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

// Create tooltip objects
var posToolTip = d3.tip()
  .attr("class", "d3-tip")
  .offset([-8, 0])
  .html(function(d) {
    return `${d.positive_count} Positive Tweets`;
  });

var negToolTip = d3.tip()
  .attr("class", "d3-tip")
  .offset([-8, 0])
  .html(function(d) {
    return `${d.negative_count} Negative Tweets`;
  });

// Configure scales
var xScale0 = d3
  .scaleBand()
  .range([0, chartWidth])
  .padding(barPadding);
var xScale1 = d3.scaleBand();
var yScale = d3
  .scaleLinear()
  .range([chartHeight, 0]);

// Define functions to create axes
var xAxis = d3.axisBottom(xScale0).tickSizeOuter(axisTicks.outerSize);
var yAxis = d3.axisLeft(yScale)
  .ticks(axisTicks.qty)
  .tickSizeOuter(axisTicks.outerSize);

// Fetch all tweet data to define axes
d3.json("/tweets").then(function(data) {
  
  // Configure scales
  xScale0.domain(data.map(d => d.date));
  yScale.domain([0, d3.max(data, d => d.max_tweets)]);

  // Append axes to chart
  chartGroup.append("g")
    .attr("class", "y axis")
    .call(yAxis);
  chartGroup.append("g")
    .attr("class", "x axis")
    .attr("transform", `translate(0,${chartHeight})`)
    .call(xAxis);
});


// Attach listeners
var biden = d3.select("#biden-button");
var sanders = d3.select("#sanders-button");
var warren = d3.select("#warren-button");
var harris = d3.select("#harris-button");

biden.on("click", function() {
  selectCandidate("@JoeBiden");
});

sanders.on("click", function() {
  selectCandidate("@BernieSanders");
});

warren.on("click", function() {
  selectCandidate("@ewarren");
});

harris.on("click", function() {
  selectCandidate("@KamalaHarris");
});
