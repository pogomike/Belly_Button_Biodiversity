function buildMetadata(sample) {
  
  console.log(sample);
  // Use d3 to select the panel with id of `#sample-metadata`
  var panelId=d3.select('#sample-metadata');

  // Use `.html("") to clear any existing metadata
  panelId.html("");

  // Use `d3.json` to fetch the metadata for a sample
  d3.json("metadata/"+sample).then((sampleMData)=>{
    console.log(sampleMData);
    // Use `Object.entries` to add each key and value pair to the panel
    Object.entries(sampleMData).forEach(([key,value])=>{
      console.log(`${key},${value}`);
      panelId.append('p').text(`${key}: ${value}`)
    });
  });   
}

function buildCharts(sample) {
  d3.json("samples/"+sample).then((sampleData)=>{
    
    //Bubble Chart
    var trace1 = {
      x:sampleData['otu_ids'],
      y:sampleData['sample_values'],
      mode:'markers',
      type:'scatter',
      text:sampleData[`otu_labels`],
      marker:{
        color: sampleData['otu_ids'],
        colorscale:"Rainbow",
        opacity:0.5,
        size:sampleData['sample_values']
      }
    };

  //Bubble Chart Information
  var data=[trace1];
  
  var layout ={
    title:`Bubble Chart For Sample ${sample}`,
    xaxis:{title:'otu ids'},
    yaxis:{title:'sample values'}
  };
  
  //Pie Chart Information
  var data2=[{
    "labels":sampleData['otu_ids'].slice(0,10),
    "values":sampleData['sample_values'].slice(0,10),
    "type": 'pie',
    "hovertext":sampleData['otu_labels']
  }]
  
  var layout2 = {title:`Pie Chart For Sample ${sample}`};

  Plotly.newPlot('bubble',data,layout);
  Plotly.newPlot('pie',data2,layout2);
  
  });
};  

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });
    
    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}
// Initialize the dashboard
init();