function selectCandidate(candidate) {
  /**
    /* Defines actions for when candidate is selected
    /* @param {string}    candidate    Name of selected candidate
    */

  // Apply styling to selected candidate

  if (candidate == "@JoeBiden"){
    d3.selectAll(".box")
      .classed("selected", false);
    d3.select("#biden-box")
      .classed("selected", true);
  }
  else if (candidate == "@BernieSanders"){
    d3.selectAll(".box")
      .classed("selected", false);
    d3.select("#sanders-box")
      .classed("selected", true);
  }

  else if (candidate == "@ewarren"){
    d3.selectAll(".box")
      .classed("selected", false);
    d3.select("#warren-box")
      .classed("selected", true);
  }

  else if (candidate == "@KamalaHarris"){
    d3.selectAll(".box")
      .classed("selected", false);
    d3.select("#harris-box")
      .classed("selected", true);
  }

  // Remove old word cloud and create new cloud for candidate
  createCloud(candidate);
  // Construct url for path to twitter data for candidate
  var url = `/candidate/${candidate}`;

  // Fetch tweet data for candidate
  d3.json(url).then(function(twitterData) {
    updateBar(twitterData);
    createGauge(twitterData);
  });
}

function createCloud(candidate) {
  /**
      /* Defines actions for when candidate is selected
      /* @param {string}    candidate    Name of selected candidate
      */

  // Construct url for path to twitter data for candidate
  var url = `/cloud/${candidate}`;

  $('#cloud').jQCloud('destroy');

  $(document).ready(function() {
    // on page load this will fetch data from our flask-app asynchronously
    $.ajax({
      url: url,
      success: function(data) {
        // returned data is in string format we have to convert it back into json format
        var words_data = $.parseJSON(data);
        // we will build a word cloud into our div with id = word_cloud
        // we have to specify width and height of the word_cloud chart
        $("#cloud").jQCloud(words_data, {
          width: 800,
          height: 300,
          autoResize: true
        });
      }
    });
  });
}

function updateBar(twitterData) {

  xScale0.domain(twitterData.map(d => d.date));
  xScale1.domain(["positive_count", "negative_count"]).range([0, xScale0.bandwidth()]);
  
  // Create object for bars
  var dates = chartGroup.selectAll(".date")
    .remove()
    .exit()
    .data(twitterData)
    .enter()
    .append("g")
    .attr("class", "date")
    .attr("transform", d => `translate(${xScale0(d.date)}, 0)`);

  // Add bars for positive tweets
  dates
    .selectAll(".bar.positive_count")
    .data(d => [d])
    .enter()
    .append("rect")
    .merge(dates)
    .transition()
    .duration(500)
    .delay(function (d, i) {
      return i * 100;
    })
    .attr("class", "bar positive_count")
    .style("fill", "green")
    .attr("x", d => xScale1("positive_count"))
    .attr("y", d => yScale(d.positive_count))
    .attr("width", xScale1.bandwidth())
    .attr("height", d => {
      return chartHeight - yScale(d.positive_count);
    })
    // .on("mouseover", function(d) {
    //   posToolTip.show(d, this);
    //   d3.select(this).style("fill", "green");
    //   })
    // .on("mouseout", function(d) {
    //   posToolTip.hide(d, this);
    //   d3.select(this).style("fill", "blue");
    //   });

  

  // Add bars for negative tweets
  dates
    .selectAll(".bar.negative_count")
    .data(d => [d])
    .enter()
    .append("rect")
    .merge(dates)
    .transition()
    .duration(500)
    .delay(function (d, i) {
      return i * 100;
    })
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

function createGauge(twitterData) {

  // Calculate level of positive tweets
  var totalPositive = 0;
  var totalNegative = 0;

  twitterData.forEach(function(d) {
    totalPositive += d.positive_count;
    totalNegative += d.negative_count;
  });
  var level = totalPositive * 180/ (totalPositive + totalNegative)

    // Trig to calculate meter point
    var degrees = 180 - level,
      radius = .5;
    var radians = degrees * Math.PI / 180;
    var x = radius * Math.cos(radians);
    var y = radius * Math.sin(radians);        // Create gauge arrow
    var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
      pathX = String(x),
      space = ' ',
      pathY = String(y),
      pathEnd = ' Z';
    var path = mainPath.concat(pathX, space, pathY, pathEnd);

  // Construct gauge
  var data = [{
    type: 'scatter',
    x: [0], y: [0],
    marker: { size: 20, color: '850000' },
    showlegend: false,
    name: 'ratings',
    hoverinfo: "none",
    // text: `${total * 100}% Positive Tweets`,
  },
  {
    values: [1, 1, 1, 1, 1, 5],
    rotation: 90,
    text: ['Awesome', 'Positive', 'Even', 'Negative', 'Horrible', "  "],
    textinfo: 'text',
    textposition: 'inside',
    marker: {
      colors: ['#1a9641','#a6d96a', '#ffffbf','#fdae61','#d7191c', 'rgba(255, 255, 255, 0)']
    },
    labels: ['Super Positive', 'Positive', 'Even', 'Negative', 'Horrible', "  "],
    hoverinfo: "none",
    hole: .5,
    type: 'pie',
    showlegend: false
  }];

  var layout = {
    shapes: [{
      type: 'path',
      path: path,
      fillcolor: '850000',
      line: {
        color: '850000'
      }
    }],
    height: 400,
    width: 400,
    // margin: {r: 150},
    xaxis: {
      zeroline: false, showticklabels: false,
      showgrid: false, range: [-1, 1]
    },
    yaxis: {
      zeroline: false, showticklabels: false,
      showgrid: false, range: [-1, 1]
    }
  };
  Plotly.newPlot("gauge", data, layout);
}


/* Set up bar chart */
// Define svg dimension parameters
var svgWidth = 500;
var svgHeight = 250;
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
