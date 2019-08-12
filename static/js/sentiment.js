function createViz(candidate) {
  
    /**
    /* Creates visualizations
    /* @param {string}    candidate    Name of selected candidate
    */

    // Define SVG area dimensions
    var svgWidth = 600;
    var svgHeight = 400;
    
    // Define margins and dimensions of chart area
    var chartMargin = {
        top: 50,
        right: 30,
        bottom: 80,
        left: 60
    };
    var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
    var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

    // Create svg object and append a group
    var svg = d3.select("#bar")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight)
        
    var chartGroup = svg.append("g")
        .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`)

    // Creat a tolltip object
    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([-10, 0])
        .html(function (d) {
        return (`<strong>${d.sentiment}:</strong> ${d.twitter_count}`);
        });

    // Construct url for path to twitter data for candidate
    var url = `/candidate/${candidate}`;

    // Fetch tweet data for candidate
    d3.json(url).then(function(twitterData) {
        
        // Cast number of tweets as a number
        twitterData.forEach(function (d) {
            d.tweet_count = +d.tweet_count;
        });

        // Configure x and y scales
        var xBandScale = d3.scaleBand()
            .domain(twitterData.map(d => d.date))
            .range([0, chartWidth])
            .padding(0.2);
        var yLinearScale = d3.scaleLinear()
            .domain([0, d3.max(twitterData, d => d.tweet_count)])
            .range([chartHeight, 0]);
        
        // Define functions to create axes
        var bottomAxis = d3.axisBottom(xBandScale);
        var leftAxis = d3.axisLeft(yLinearScale).ticks(10);

        // Append axes to chart
        chartGroup.append("g")
            .call(leftAxis)
            .attr("stroke", "black")
            .attr("fill", "black");
        chartGroup.append("g")
            .attr("transform", `translate(0, ${chartHeight})`)
            .call(bottomAxis)
            .attr("fill", "black")
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("stroke", "black")
            .attr("transform", "rotate(-65)");
        
        //Create bars for chart
        chartGroup.selectAll("rect")
            .data(twitterData)
            .enter()
            .append("rect")
            .attr("width", xBandScale.bandwidth())
            .attr("height", d => chartHeight - yLinearScale(d.twitter_count))
            .attr("x", d => xBandScale(d.date))
            .attr("y", d => yLinearScale(d.twitter_count))
            .attr("fill", "blue")
            .on("mouseover", toolTip.show)
            .on("mouseout", toolTip.hide);

        // Add tooltips for chart
        chartGroup.call(toolTip);

        
        // createPie(twitterData);
        // createLine(twitterData);
    });
}


function createPie(candidate) {
  
    /**
    /* Creates pie chart for given candidate
    /* @param {string}    candidate    Name of selected candidate
    */

    // DO MATH TO GET PERCENTAGES
//    https://bl.ocks.org/mbostock/4341574
  
    var width = 960,
        height = 500,
        radius = Math.min(width, height) / 2 - 10;
    var data = d3.range(10).map(Math.random).sort(d3.descending);

    var color = d3.scale.category20();

    var arc = d3.svg.arc()
        .outerRadius(radius);

    var pie = d3.layout.pie();

    var svg = d3.select("body").append("svg")
        .datum(data)
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var arcs = svg.selectAll("g.arc")
        .data(pie)
        .enter().append("g")
        .attr("class", "arc");

    arcs.append("path")
        .attr("fill", function(d, i) { return color(i); })
        .transition()
        .ease("bounce")
        .duration(2000)
        .attrTween("d", tweenPie)

    function tweenPie(b) {
        b.innerRadius = 0;
        var i = d3.interpolate({startAngle: 0, endAngle: 0}, b);
        return function(t) { return arc(i(t)); };
    }


}

function createLine(candidate)  {
  
    /**
    /* Creates a line chart for given candidate
    /* @param {string}    candidate    Name of selected candidate
    */

}

function createCloud(candidate)  {
  
    /**
    /* Creates word cloud for given candidate
    /* @param {string}    candidate    Name of selected candidate
    */

//    https://github.com/jasondavies/d3-cloud

// set the dimensions and margins of the graph
var margin = {top: 10, right: 10, bottom: 10, left: 10},
    width = 450 - margin.left - margin.right,
    height = 450 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#cloud").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Constructs a new cloud layout instance. It run an algorithm to find the position of words that suits your requirements
var layout = d3.layout.cloud()
  .size([width, height])
  .words(myWords.map(function(d) { return {text: d}; }))
  .padding(10)
  .fontSize(60)
  .on("end", draw);
layout.start();

// This function takes the output of 'layout' above and draw the words
// Better not to touch it. To change parameters, play with the 'layout' variable above
function draw(words) {
  svg
    .append("g")
      .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
      .selectAll("text")
        .data(words)
      .enter().append("text")
        .style("font-size", function(d) { return d.size + "px"; })
        .attr("text-anchor", "middle")
        .attr("transform", function(d) {
          return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
        })
        .text(function(d) { return d.text; });
}

    // https://gist.github.com/joews/9697914

    function wordCloud(selector) {

        var fill = d3.scale.category20();
    
        //Construct the word cloud's SVG element
        var svg = d3.select(selector).append("svg")
            .attr("width", 500)
            .attr("height", 500)
            .append("g")
            .attr("transform", "translate(250,250)");
    
    
        //Draw the word cloud
        function draw(words) {
            var cloud = svg.selectAll("g text")
                            .data(words, function(d) { return d.text; })
    
            //Entering words
            cloud.enter()
                .append("text")
                .style("font-family", "Impact")
                .style("fill", function(d, i) { return fill(i); })
                .attr("text-anchor", "middle")
                .attr('font-size', 1)
                .text(function(d) { return d.text; });
    
            //Entering and existing words
            cloud
                .transition()
                    .duration(600)
                    .style("font-size", function(d) { return d.size + "px"; })
                    .attr("transform", function(d) {
                        return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                    })
                    .style("fill-opacity", 1);
    
            //Exiting words
            cloud.exit()
                .transition()
                    .duration(200)
                    .style('fill-opacity', 1e-6)
                    .attr('font-size', 1)
                    .remove();
        }
    
    
        //Use the module pattern to encapsulate the visualisation code. We'll
        // expose only the parts that need to be public.
        return {
    
            //Recompute the word cloud for a new set of words. This method will
            // asycnhronously call draw when the layout has been computed.
            //The outside world will need to call this function, so make it part
            // of the wordCloud return value.
            update: function(words) {
                d3.layout.cloud().size([500, 500])
                    .words(words)
                    .padding(5)
                    .rotate(function() { return ~~(Math.random() * 2) * 90; })
                    .font("Impact")
                    .fontSize(function(d) { return d.size; })
                    .on("end", draw)
                    .start();
            }
        }
    
    }
    
    //Some sample data - http://en.wikiquote.org/wiki/Opening_lines
    var words = [
        "You don't know about me without you have read a book called The Adventures of Tom Sawyer but that ain't no matter.",
        "The boy with fair hair lowered himself down the last few feet of rock and began to pick his way toward the lagoon.",
        "When Mr. Bilbo Baggins of Bag End announced that he would shortly be celebrating his eleventy-first birthday with a party of special magnificence, there was much talk and excitement in Hobbiton.",
        "It was inevitable: the scent of bitter almonds always reminded him of the fate of unrequited love."
    ]
    
    //Prepare one of the sample sentences by removing punctuation,
    // creating an array of words and computing a random size attribute.
    function getWords(i) {
        return words[i]
                .replace(/[!\.,:;\?]/g, '')
                .split(' ')
                .map(function(d) {
                    return {text: d, size: 10 + Math.random() * 60};
                })
    }
    
    //This method tells the word cloud to redraw with a new set of words.
    //In reality the new words would probably come from a server request,
    // user input or some other source.
    function showNewWords(vis, i) {
        i = i || 0;
    
        vis.update(getWords(i ++ % words.length))
        setTimeout(function() { showNewWords(vis, i + 1)}, 2000)
    }
    
    //Create a new instance of the word cloud visualisation.
    var myWordCloud = wordCloud('body');
    
    //Start cycling through the demo data
    showNewWords(myWordCloud);

}