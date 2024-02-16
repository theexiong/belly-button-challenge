const url = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json';

// fetch the JSON data and log it
d3.json(url).then(function(data){
    //console.log(data);
});

//init chart 
function init() {
    let dropdown = d3.select("#selDataset");
    d3.json(url).then((data) => {
        let sample_ids = data.names;
        sample_ids.forEach((dataEntry) => {
            console.log(dataEntry);
            dropdown.append("option").text(dataEntry).property("value", dataEntry);
        });
        let initialSample = sample_ids[0];
        console.log(initialSample);
        meta(initialSample);
        bar(initialSample);
        bubble(initialSample);
        gauge(initialSample)
    });
};

//create metadata section
function meta(entry) {

    // fetch json data
    d3.json(url).then((data) => {

        // array of metadata
        let metaInfo = data.metadata;
        console.log(metaInfo);
        // filter array where id = to dropdown selector
        let value = metaInfo.filter(result => result.id == entry);
        console.log(value)

        // set first entry to a variable
        let firstMeta = value[0];
        console.log(firstMeta);

        // clear demographic info area
        d3.select("#sample-metadata").text('');

        // add key value pairs with object.entries
        Object.entries(firstMeta).forEach(([key,value]) => {

            // Log the individual key/value pairs as they are being appended to the metadata panel
            console.log(key,value);

            d3.select("#sample-metadata").append("h4").text(`${key}: ${value}`);
        });
    });
};

//create bar chart
function bar(entry) {
    d3.json(url).then((data) => {

        // array of samples 
        let sampleInfo = data.samples;
        console.log(sampleInfo);

        // filter to get keys and values
        let sample_filter = sampleInfo.filter(result => result.id == entry);
        console.log(sample_filter);

        // assign first sample_value to variable
        let sampleData = sample_filter[0];
        console.log(sampleData);

        // set labels
        let labels = sampleData.otu_labels;
        //set values
        let barValues = sampleData.sample_values;
        //set otu_ids
        let otuIds = sampleData.otu_ids;
        console.log(labels, barValues, otuIds);
    
        // trace data for bar chart
        let barChart = {
            x: barValues.slice(0,10).reverse(),
            y: otuIds.slice(0,10).map(otu_id => `OTU ${otu_id}`).reverse(),
            text: labels.slice(0,10).reverse(),
            type: 'bar',
            orientation: 'h'
        };
        //set layout for barchart
        let barLayout = {
            title: "Test Subject's Top 10 Belly Button Bacteria",
        };
        //plot bar chart
        Plotly.newPlot("bar",[barChart], barLayout);
    });
};

//create bubble chart
function bubble(entry) {
    d3.json(url).then((data) => {

        // array of samples 
        let sampleInfo = data.samples;

        // filter to get keys and values
        let sample_filter = sampleInfo.filter(result => result.id == entry);

        // assign first sample_value to variable
        let sampleData = sample_filter[0];

        // set labels
        let labels = sampleData.otu_labels;
        //set values
        let barValues = sampleData.sample_values;
        //set otu_ids
        let otuIds = sampleData.otu_ids; 

        // define bubble chart
        let bubbleChart = {
            x: otuIds,
            y: barValues,
            text: labels,
            mode: 'markers',
            marker: {
                size: barValues,
                color: otuIds,
                colorscale: "Earth"
            }
        };

        // define bubble layout
        let bubbleLayout = {
            title: "Test Subject's Bacteria",
            hovermode: 'closest',
            xaxis: {title: "OTU ID"},
            width: 1200,
            height: 600
        };

        // plot bubble chart
        Plotly.newPlot("bubble", [bubbleChart], bubbleLayout);
    });
};

function gauge(entry) {
    d3.json(url).then((data) => {

        let metaInfo = data.metadata;
     
        // filter array where id = to dropdown selector
        let value = metaInfo.filter(result => result.id == entry);

        // set first entry to a variable
        let firstMeta = value[0];

        // set gauge chart 
        let gaugeData = [
	        {
		        domain: { x: [0, 1], y: [0, 1] },
		        value: firstMeta.wfreq,
		        title: {text: "<b>Belly Button Washing Frequency</b><br> Scrubs per Week" },
		        type: "indicator",
                labels: ['0-1', '1-2', '2-3', '3-4', '4-5', '5-6','6-7','7-8','8-9'],
		        mode: "gauge+number",
                gauge: {
                    axis: {range: [null, 9]},
                    bar: {color: 'steelblue'},
                    steps: [
                        {range: [0, 1], color: 'linen'},
                        {range: [1, 2], color: 'rgb(228,213,211)'},
                        {range: [2, 3], color: 'rgb(193,178,162)'},
                        {range: [3, 4], color: 'rgb(190,170,156)'},
                        {range: [4, 5], color: 'rgb(224,198,173)'},
                        {range: [5, 6], color: 'rgb(230,200,175)'},
                        {range: [6, 7], color: 'rgb(239,219,178)'},
                        {range: [7, 8], color: 'rgb(195,198,168)'},
                        {range: [8, 9], color: 'rgb(163,178,164)'},
                    ]
                }
	        }
        ];   

        let gaugeLayout = {
            width: 600,
            height: 450,
            margin: { t: 25, r: 25, l: 25, b: 25 },
            paper_bgcolor: "lavender",
            font: { color: "dark gray", family: "Arial" }
        };
        
        Plotly.newPlot("gauge", gaugeData, gaugeLayout);
    });
};

function optionChanged(value) { 

    // Log the new value
    console.log(value); 

    // Call all functions 
    meta(value);
    bar(value);
    bubble(value);
    gauge(value);
};

init();