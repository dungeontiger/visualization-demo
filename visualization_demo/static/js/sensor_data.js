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
        drop_downs = [
            ["group_id", group_id],
            ["worldsensing_node_id", worldsensing_node_id],
            ["channel", channel]
        ]
        drawDimensionBar(drop_downs);
    }

    var sensor_trace = {
        name: 'Initial Exceedance',
        x: start_at,
        y: initial_exceedance,
        mode: 'lines+markers',
        type: 'scatter',
    };

    var lower_limit_trace = {
        name: 'Lower Tolerance',
        x: start_at,
        y: lower_threshold,
        mode: 'lines',
        type: 'scatter',
        line: {
            color: "#bf3608"
        }
    };

    var upper_limit_trace = {
        name: 'Upper Tolerance',
        x: start_at,
        y: upper_threshold,
        mode: 'lines',
        type: 'scatter',
        line: {
            color: "#fc4103",
        }
    };

    var layout = {
        showlegend: true,
        xaxis: {
            type: 'date',
            tickformat: '%Y-%m-%0d' // For more time formatting types, see: https://github.com/d3/d3-time-format/blob/master/README.md
        }
    }

    Plotly.newPlot("sensor_data_chart", [sensor_trace, upper_limit_trace, lower_limit_trace], layout);
}