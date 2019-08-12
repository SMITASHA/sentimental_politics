var container = d3.select("#bar"),
      width = 400,
      height = 300,
      margin = {top: 30, right: 20, bottom: 30, left: 50},
      barPadding = .2,
      axisTicks = {qty: 8, outerSize: 0, dateFormat: '%m-%d'};
  
var svg = container
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

var xScale0 = d3.scaleBand().range([0, width - margin.left - margin.right]).padding(barPadding);
var xScale1 = d3.scaleBand();
var yScale = d3.scaleLinear().range([height - margin.top - margin.bottom, 0]);

var xAxis = d3.axisBottom(xScale0).tickSizeOuter(axisTicks.outerSize);
var yAxis = d3.axisLeft(yScale).ticks(axisTicks.qty).tickSizeOuter(axisTicks.outerSize);

// GRETEL - MAYBE WE NEED TO ADD A CONDITIONAL STATEMENT - LIKE IF WE ARE HOVERING OVER A POSITIVE BAR, ETC
// var posToolTip = d3.tip()
//   .attr("class", "d3-tip")
//   .offset([-10, 0])
//   .html(function (d) {
//       return (`${d.positive_count} Positive Tweets`);
// });

// var negToolTip = d3.tip()
//   .attr("class", "d3-tip")
//   .offset([-10, 0])
//   .html(function (d) {
//       return (`${d.negative_count} Negative Tweets`);
// });

var candidate = "@JoeBiden";

// Construct url for path to twitter data for candidate
var url = `/candidate/${candidate}`;

// Fetch tweet data for candidate
d3.json(url).then(function(twitterData) {
    
    // twitterData = twitterData.map(d => {
    //     d.date = d.date;
    //         return d;
    //     });

    xScale0.domain(twitterData.map(d => d.date));
    xScale1.domain(["positive_count", "negative_count"]).range([0, xScale0.bandwidth()]);
    yScale.domain([0, d3.max(twitterData, d => d.positive_count > d.negative_count ? d.positive_count : d.negative_count)]);
    
    var date = svg.selectAll(".date")
        .data(twitterData)
        .enter().append("g")
        .attr("class", "date")
        .attr("transform", d => `translate(${xScale0(d.date)},0)`);
    
    /* Add positive_count bars */
    date.selectAll(".bar.positive_count")
        .data(d => [d])
        .enter()
        .append("rect")
        .attr("class", "bar positive_count")
        .style("fill","blue")
        .attr("x", d => xScale1('positive_count'))
        .attr("y", d => yScale(d.positive_count))
        .attr("width", xScale1.bandwidth())
        .attr("height", d => {
            return height - margin.top - margin.bottom - yScale(d.positive_count)
        })
        .on("mouseover", function(d) {
            d3.select(this).style("fill", "green");
        })
        // .on("mouseover", posToolTip.show)
        .on("mouseout", function(d) {
            d3.select(this).style("fill", "blue");
        });
        // .on("mouseout", posToolTip.hide);
    
    /* Add negative_count bars */
    date.selectAll(".bar.negative_count")
        .data(d => [d])
        .enter()
        .append("rect")
        .attr("class", "bar negative_count")
        .style("fill","red")
        .attr("x", d => xScale1('negative_count'))
        .attr("y", d => yScale(d.negative_count))
        .attr("width", xScale1.bandwidth())
        .attr("height", d => {
            return height - margin.top - margin.bottom - yScale(d.negative_count)
        })
        .on("mouseover", function(d) {
            d3.select(this).style("fill", "green");
        })
        .on("mouseout", function(d) {
            d3.select(this).style("fill", "red");
        });
        // 
        // .on("mouseover", toolTip.show)
        // .on("mouseout", toolTip.hide);
    // Add the X Axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", `translate(0,${height - margin.top - margin.bottom})`)
        .call(xAxis)
    
    // Add the Y Axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);
    
    // GRETEL - FIGURE OUT HOW TO DO THIS FOR BOTH SENTIMENTS
    // Creat a tolltip object


    // Add tooltips for chart
    container.call(posToolTip);
    container.call(negToolTip);
    
    
});
