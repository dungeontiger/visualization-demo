function onLoad() {
    drawChart(null, false)
}

function drawChart(filters, update) {
    // get the data from the server and filter if necessary
    url = "/api/sensor_data?"
    if (filters) {
        for (column in filters) {
            url += column + "=" + filters[column] + "&"
        }
    }
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        renderChart(data, update);
      })
      .catch(error => {
        console.error('Error:', error);
      });
}

function renderChart(data, update) {
    // data is an array of arrays
    // group_id, worldsensing_node_id, channel, initial_exceedance, start_at, end_at,
    // lower_threshold, upper_threshold, direction, exceeds_upper, exceeds_lower

    const group_id  = data.map(row => row[0]);
    const worldsensing_node_id = data.map(row => row[1]);
    const channel = data.map(row => row[2]);
    const initial_exceedance = data.map(row => row[3]);
    const start_at = data.map(row => row[4]);
    const end_at = data.map(row => row[5]);
    const lower_threshold = data.map(row => row[6]);
    const upper_threshold = data.map(row => row[7]);
    const exceeds_upper = data.map(row => row[8]);
    const exceeds_lower = data.map(row => row[9]);

    // if we are updating the page, don't redraw the dimension bar; it takes care of itself
    if (!update) {
        // draw a dimension bar
        // dimension bars are a list of drop downs that cascade
        // a selection in the first one filters the next one
        // drop downs are disabled when the one before them has selected "[all]" (meaning no filter)

        // list of drop downs (in order) with label fo the control and the column index in the data for its values
        const drop_downs = [
            ["group_id", group_id],
            ["worldsensing_node_id", worldsensing_node_id],
            ["channel", channel]
        ]
        drawDimensionBar(drop_downs);
    }

    // Each series is going to be a single sensor
    // A single sensor is defined as the unique combination of:
       // group_id
       // worldsensing_node_id
       // channel

    let tracesMap = {} // map of sensor id to it's trace
    let upperLimitTracesMap = {}
    let lowerLimitTracesMap = {}
    // go through all the data and split it into traces
    for (let index in data) {
        const row = data[index]
        const id = row[0] + "." + row[1] + "." + row[2]
        if (!(id in tracesMap)) {
            tracesMap[id] = {
                name: "Initial Exceedance",
                x: [],
                y: [],
                mode: "lines+markers",
                type: "scatter",
                hovertemplate: "InitialExceedance: %{y:.2f}<br>Start: %{x}<br>Sensor: " + id
            }
            upperLimitTracesMap[id] = {
                name: "Upper Tolerance",
                x: [],
                y: [],
                mode: "lines",
                line: {
                    color: "#fc4103"
                }
            }
            lowerLimitTracesMap[id] = {
                name: "Lower Tolerance",
                x: [],
                y: [],
                mode: "lines",
                line: {
                    color: "#bf3608"
                }
            }
        }
        // this is the intial exceedance trace
        let trace = tracesMap[id]
        trace.x.push(row[4])
        trace.y.push(row[3])

        // set up the upper and lower limit traces
        let upper = upperLimitTracesMap[id]
        upper.x.push(row[4])
        upper.y.push(row[7])

        let lower = lowerLimitTracesMap[id]
        lower.x.push(row[4])
        lower.y.push(row[6])
    }

    let layout = {
        showlegend: true,
        xaxis: {
            type: 'date',
            tickformat: '%Y-%m-%0d' // For more time formatting types, see: https://github.com/d3/d3-time-format/blob/master/README.md
        }
    }
    let traces = []
    for (let key in tracesMap) {
        traces.push(tracesMap[key])
    }
    // only show the upper and lower bounds if there is just one trace
    if (traces.length == 1) {
        traces.push(upperLimitTracesMap[Object.keys(upperLimitTracesMap)[0]])
        traces.push(lowerLimitTracesMap[Object.keys(lowerLimitTracesMap)[0]])
    }

    Plotly.newPlot("sensor_data_chart", traces, layout);
}