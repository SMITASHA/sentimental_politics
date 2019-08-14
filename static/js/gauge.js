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
  var total = totalPositive + totalNegative

  var level = total * 180 / 5;

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
    text: ['Awesome', 'Positive', 'Neutral', 'Negative', 'Horrible', "  "],
    textinfo: 'text',
    textposition: 'inside',
    marker: {
      colors: ['#1a9641','#a6d96a', '#ffffbf','#fdae61','#d7191c', 'rgba(255, 255, 255, 0)']
    },
    labels: ['Super Positive', 'Positive', 'Neutral', 'Negative', 'Horrible', "  "],
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
    width: 450,
    margin: {r: 150},
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
});
