function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
};

// 1a. Create the buildCharts function.
function buildCharts(sample) {
  // 2a. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3a. Create a variable that holds the samples array. 
    var samples = data.samples;

    // 4a. Create a variable that filters the samples for the object with the desired sample number.
    var samplesArray = samples.filter(sampleObj => sampleObj.id == sample);

    // 1c. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadataArray = data.metadata.filter(sampleObj => sampleObj.id == sample);

    // 5a. Create a variable that holds the first sample in the array.
    var array = samplesArray[0];

    // 2c. Create a variable that holds the first sample in the metadata array.
    var metadata = metadataArray[0];

    // 6a. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIDs = array.otu_ids;
    var otuLabels = array.otu_labels;
    var sampleValues = array.sample_values;

    // 3c. Create a variable that holds the washing frequency.
    var washFreq = metadata.wfreq;

    // 7a. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otuIDs.slice(0,10).map(num => "OTU " + num).reverse();
    var xticks = sampleValues.slice(0,10).reverse()

    // 8a. Create the trace for the bar chart. 
    var barData = [{
      x: xticks,
      y: yticks,
      hovertext: otuLabels,
      type: "bar",
      orientation: "h",
    }];
    // 9a. Create the layout for the bar chart. 
    var barLayout = {
      title: 'Top 10 Bateria Cultures Found',
      showlegend:false,
      orientation:'h',
      yaxis:{autotick:false, type:'category'} 
    };
    // 10a. Use Plotly to plot the data with the layout. 
    Plotly.newPlot('bar', barData, barLayout);

    // 1b. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otuIDs,
      y: sampleValues,
      mode: "markers",
      hovertext: otuLabels,
      marker: {
        color: otuIDs,
        size: sampleValues,
        colorscale: 'Earth'
      }
    }];
  
    // 2b. Create the layout for the bubble chart.
    var bubbleLayout = {
      margin: { t: -.5 },
      hovermode: 'closest',
      title: 'Baterical Cultures Per Sample',
      showlegend:false,
      xaxis: {title: 'OTU ID'}
    };
  
      // 3b. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    // 4c. Create the trace for the gauge chart.
    var gaugeData = [{
      type: "indicator",
      mode: "gauge+number",
      value: washFreq,
      title: { text: "<b>Belly Button Washing Frequency</b> <br> Scrubs per Week", font: { size: 20 } },
      gauge: {
        axis: { range: [null, 10], tickwidth: 1, tickcolor: "black" },
        bar: { color: "black" },
        bgcolor: "white",
        steps: [
          {range: [0, 2], color: "red"},
          {range: [2, 4], color: "orange"},
          {range: [4, 6], color: "yellow"},
          {range: [6, 8], color: "#8bc34a"},
          {range: [8, 10], color: "green"},
        ],
      }
    }];
      
    // 5c. Create the layout for the gauge chart.
    var gaugeLayout = {
      margin: { t: 18, r: 40, l: 0, b: 18 },
      paper_bgcolor: "white" 
    };
  
    // 6c. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);  
  });
}
