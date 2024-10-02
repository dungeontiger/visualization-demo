function draw() {
    // get the data from the server
fetch("/api/sensor_data")
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    renderChart(data);
  })
  .catch(error => {
    console.error('Error:', error);
  });
}

function renderChart(data) {
    // data is an array of arrays
    // columns are initial_exceedance, start_at, channel, lower_threshold, upper_threshold, direction, exceeds_upper, exceeds_lower
    // split the data into columnar arrays
    const initial_exceedance = data.map(row => row[0]);
    const start_at = data.map(row => row[1]);
    const lower_tolerance = data.map(row => row[3]);
    const upper_tolerance = data.map(row => row[4]);
    const exceeds_upper = data.map(row => row[6]);
    const exceeds_lower = data.map(row => row[7]);
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
        y: lower_tolerance,
        mode: 'lines',
        type: 'scatter',
        line: {
            color: "#bf3608"
        }
    };

    var upper_limit_trace = {
        name: 'Upper Tolerance',
        x: start_at,
        y: upper_tolerance,
        mode: 'lines',
        type: 'scatter',
        line: {
            color: "#fc4103",
        }
    };

    var exceeds_upper_trace = {
        x: start_at,
        y: initial_exceedance,
        z: exceeds_upper,
        name: 'Exceeds Upper Limit',
        mode: 'markers',
        marker: {
            size: 8,
            color: "#fc4103"
        },
        transforms: [
            {
                type: 'filter',
                target: 'z',
                operation: '=',
                value: true
            }
        ]
    }

    var exceeds_lower_trace = {
        x: start_at,
        y: initial_exceedance,
        z: exceeds_lower,
        name: 'Exceeds Lower Limit',
        mode: 'markers',
        marker: {
            size: 8,
            color: "#bf3608"
        },
        transforms: [
            {
                type: 'filter',
                target: 'z',
                operation: '==',
                value: true
            }
        ]
    }

    var layout = {
        showlegend: true,
        xaxis: {
            type: 'date',
            tickformat: '%Y-%m-%0d' // For more time formatting types, see: https://github.com/d3/d3-time-format/blob/master/README.md
        }
    }
    Plotly.newPlot("sensor_data_chart", [sensor_trace, upper_limit_trace, lower_limit_trace, exceeds_upper_trace, exceeds_lower_trace], layout);
}