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
    //GRETEL - THE FOLLOWING LINE IS SUPPOSED TO REMOVE SVG'S BUT DOESN'T APPEAR TO WORK
    // d3.selectAll("svg > *").remove();
    updateBar(twitterData);
    // createPie(twitterData);
    // createCloud(twitterData);
  });
}

function createBar() {
  /**
    /* Create empty bar chart
    */

  // Fetch all tweet data
  d3.json("/tweets").then(function(twitterData) {
    // Create container for bar chart attached to bar chart id
    var container = d3.select("#bar"),
      width = 500,
      height = 300,
      margin = { top: 30, right: 20, bottom: 30, left: 50 },
      barPadding = 0.2,
      axisTicks = { qty: 8, outerSize: 0, dateFormat: "%m-%d" };

    // Create svg attached to container
    var svg = container
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create scales
    var xScale0 = d3
      .scaleBand()
      .range([0, width - margin.left - margin.right])
      .padding(barPadding);
    var xScale1 = d3.scaleBand();
    var yScale = d3
      .scaleLinear()
      .range([height - margin.top - margin.bottom, 0]);

    // Create axis objects
    var xAxis = d3.axisBottom(xScale0).tickSizeOuter(axisTicks.outerSize);
    var yAxis = d3
      .axisLeft(yScale)
      .ticks(axisTicks.qty)
      .tickSizeOuter(axisTicks.outerSize);

    // Scale domains
    xScale0.domain(twitterData.map(d => d.date));
    xScale1
      .domain(["positive_count", "negative_count"])
      .range([0, xScale0.bandwidth()]);
    yScale.domain([0, d3.max(twitterData, d => d.max_tweets)]);

    // // Create date objects attached to svg
    // var date = svg.selectAll(".date")
    //     .data(twitterData)

    // // Append dates to svg
    // date.append("g")
    //     .attr("class", "date")
    //     .attr("transform", d => `translate(${xScale0(d.date)},0)`);

    // Add the X Axis
    svg
      .append("g")
      .attr("class", "x axis")
      .attr("transform", `translate(0,${height - margin.top - margin.bottom})`)
      .call(xAxis);

    // Add the Y Axis
    svg
      .append("g")
      .attr("class", "y axis")
      .call(yAxis);

    // I DON'T THINK I ADD TOOLTIPS AT THIS POINT, BUT UNSURE
    var posToolTip = d3
      .tip()
      .attr("class", "d3-tip")
      .offset([-8, 0])
      .html(function(d) {
        return `${d.positive_count} Positive Tweets`;
      });

    var negToolTip = d3
      .tip()
      .attr("class", "d3-tip")
      .offset([-8, 0])
      .html(function(d) {
        return `${d.negative_count} Negative Tweets`;
      });
  });
}

function updateBar(twitterData) {

  // Create scales
  var xScale0 = d3.scaleBand()
    .domain(twitterData.map(d => d.date))
    .range([0, width - margin.left - margin.right])
    .padding(barPadding);
  var xScale1 = d3.scaleBand()
    .domain(["positive_count", "negative_count"])
    .range([0, xScale0.bandwidth()]);
  var yScale = d3.scaleLinear()
    .range([height - margin.top - margin.bottom, 0])
    .domain([0, d3.max(twitterData, d => d.positive_count > d.negative_count ? d.positive_count : d.negative_count)]);

  // Create chart axes
  var xAxis = d3.axisBottom(xScale0);
  var yAxis = d3.axisLeft(yScale)
    .ticks(axisTicks.qty)
    .tickSizeOuter(axisTicks.outerSize);

  // Append group elements to barGroup area
  // Create axes inside of them
  // GRETEL - MAKE SURE THE HEIGHT IS APPROPRIATE HERE
  barGroup.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);
  barGroup.append("g")
    .call(yAxis);

  // xScale0.domain(twitterData.map(d => d.date));
  // xScale1
  //   .domain(["positive_count", "negative_count"])
  //   .range([0, xScale0.bandwidth()]);
  // yScale.domain([0, d3.max(twitterData, d => d.max_tweets)]);


  // Update X axis
  // xScale0.domain(twitterData.map(d => d.date));
  // xScale1.domain(["positive_count", "negative_count"])
  // .range([0, xScale0.bandwidth()]);
  // xAxis.call(d3.axisBottom(xScale0));

  // // Update Y axis
  // yScale.domain([0, d3.max(twitterData, d =>
  //     d.positive_count > d.negative_count ? d.positive_count : d.negative_count)
  // ]);
  // //  yScale.domain([0, d3.max(twitterData, d => d.max_tweets)]);
  // yAxis.call(d3.axisLeft(yScale));

  // var posToolTip = d3
  //   .tip()
  //   .attr("class", "d3-tip")
  //   .offset([-8, 0])
  //   .html(function(d) {
  //     return `${d.positive_count} Positive Tweets`;
  // });

  // var negToolTip = d3
  //   .tip()
  //   .attr("class", "d3-tip")
  //   .offset([-8, 0])
  //   .html(function(d) {
  //     return `${d.negative_count} Negative Tweets`;
  // });

  // barSvg.call(posToolTip);
  // barSvg.call(negToolTip);

  // Create date objects attached to svg
  var date = barSvg.selectAll(".date").data(twitterData);

  // Append dates to svg
  date
    .enter()
    .append("g")
    .merge(date)
    .attr("class", "date")
    .attr("transform", d => `translate(${xScale0(d.date)}, 0)`);

  /* Add positive_count bars */
  date
    .selectAll(".bar.positive_count")
    .data(d => [d])
    .enter()
    .append("rect")
    .merge(date)
    .transition()
    .duration(1000)
    .attr("class", "bar positive_count")
    .style("fill", "blue")
    .attr("x", d => xScale1("positive_count"))
    .attr("y", d => yScale(d.positive_count))
    .attr("width", xScale1.bandwidth())
    .attr("height", d => {
      return height - margin.top - margin.bottom - yScale(d.positive_count);
    // })
    // .on("mouseover", function(d) {
    //   posToolTip.show(d, this);
    //   d3.select(this).style("fill", "green");
    // })
    // .on("mouseout", function(d) {
    //   posToolTip.hide(d, this);
    //   d3.select(this).style("fill", "blue");
    });

  /* Add negative_count bars */
  date
    .selectAll(".bar.negative_count")
    .data(d => [d])
    .enter()
    .append("rect")
    .merge(date)
    .transition()
    .duration(1000)
    .attr("class", "bar negative_count")
    .style("fill", "red")
    .attr("x", d => xScale1("negative_count"))
    .attr("y", d => yScale(d.negative_count))
    .attr("width", xScale1.bandwidth())
    .attr("height", d => {
      return height - margin.top - margin.bottom - yScale(d.negative_count);
    // })
    // .on("mouseover", function(d) {
    //   negToolTip.show(d, this);
    //   d3.select(this).style("fill", "green");
    // })
    // .on("mouseout", function(d) {
    //   negToolTip.hide(d);
    //   d3.select(this).style("fill", "red");
    });


}

// Set chart parameters
var width = 500,
  height = 300,
  margin = { top: 30, right: 20, bottom: 30, left: 50 },
  barPadding = 0.2,
  axisTicks = { qty: 8, outerSize: 0, dateFormat: "%m-%d" };

// Create svg object attached at bar id
var barSvg = d3.select("#bar")
  .append("svg")
  .attr("width", width)
  .attr("height", height)

// Append group to SVG area
var barGroup = barSvg.append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

// GRETEL NOTE - WE DON'T HAVE DOMAIN YET 


// var xAxis = svg.append("g")
//   .attr("transform", "translate(0," + height + ")")



// THIS IS THE NEW CODE
// var yAxis = svg.append("g")
//   .attr("class", "y axis")
// //   END NEW CODE

// COMMENT OUT START HERE
// // Create axis objects
// var xAxis = d3.axisBottom(xScale0).tickSizeOuter(axisTicks.outerSize);
// var yAxis = d3
//   .axisLeft(yScale)
//   .ticks(axisTicks.qty)
//   .tickSizeOuter(axisTicks.outerSize);

// // Add the X Axis
// svg
//   .append("g")
//   .attr("class", "x axis")
//   .attr("transform", `translate(0,${height - margin.top - margin.bottom})`)
//   .call(xAxis);

// // Add the Y Axis
// svg
//   .append("g")
//   .attr("class", "y axis")
//   .call(yAxis);
// COMMENT OUT END HERE

// Fetch all tweet data
// d3.json("/tweets").then(function(twitterData) {

//   // Scale domains
//   xScale0.domain(twitterData.map(d => d.date));
//   xScale1
//     .domain(["positive_count", "negative_count"])
//     .range([0, xScale0.bandwidth()]);
//   yScale.domain([0, d3.max(twitterData, d => d.max_tweets)]);

  // // Create date objects attached to svg
  // var date = svg.selectAll(".date")
  //     .data(twitterData)

  // // Append dates to svg
  // date.append("g")
  //     .attr("class", "date")
  //     .attr("transform", d => `translate(${xScale0(d.date)},0)`);

  // // Add the X Axis
  // svg.append("g")
  //     .attr("class", "x axis")
  //     .attr("transform", `translate(0,${height - margin.top - margin.bottom})`)
  //     .call(xAxis);

  // // Add the Y Axis
  // svg.append("g")
  //     .attr("class", "y axis")
  //     .call(yAxis);
// });

// // Create chart axes
// var xAxis = d3.axisBottom(xScale0);
// var yAxis = d3.axisLeft(yScale)
//   .ticks(axisTicks.qty)
//   .tickSizeOuter(axisTicks.outerSize);

// // Append group elements to barGroup area
// // Create axes inside of them
// // GRETEL - MAKE SURE THE HEIGHT IS APPROPRIATE HERE
// barGroup.append("g")
//   .attr("transform", "translate(0," + height + ")")
//   .call(xAxis);
// barGroup.append("g")
//   .call(yAxis);

// Select the submit button
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

selectCandidate("@JoeBiden");
