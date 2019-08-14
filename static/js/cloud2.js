function createCloud(candidate) {
  /**
      /* Defines actions for when candidate is selected
      /* @param {string}    candidate    Name of selected candidate
      */

  // Construct url for path to twitter data for candidate
  var url = `/cloud/${candidate}`;

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
