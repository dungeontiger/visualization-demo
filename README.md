# Visualization Demo

This is a simple project which shows how to use `plotly.js` or `matplotlib` to build a simple visualization application.

The code is designed as a framework to allow for quick and easy addition of visualizations.

## Running the Demo

1. Install python as appropriate for your environment
2. Install docker desktop for your environment
3. Clone the git repo `git clone git@github.com:dungeontiger/visualization-demo.git`
4. Change to the project directory `cd visualization-demo`
5. Make a copy of `env-template` and call it `.env`
6. In `.env` fill in the connection information for your postgres database
5. If you are on a Unix type system, run setup.sh `./setup.sh` (this starts postgres in docker which is not needed if you are connecting to an external database)
   6. If not, do the following as appropriate for your system
   7. Create and activate a `venv`
   8. Install the python requirements in the requirements.txt
   9. Start postgres in docker (optional)
1. Change to the module directory `cd visualization_demo`
2. If on a Unix type system, run the run_local.sh `./run_local.sh`
   3. If not, start flask as appropriate for your environment

At this point, flask should be running. You can access the application from the browser on port 5000 `http://127.0.0.1:5000`

You should see the default landing page for the application.

## Using the Application

The following section describes how to use the application.

If you would like to learn how to add your own visualization, refer to either `ImplementPlotlyJs.md` or 
`ImplementMatplotlib.md`

### Navigation

Use the sidebar to navigate to different locations in the application.  The first 4 have been implemented:

1. Home - takes you to the landing page
2. Sensor Data (plotly.js) - takes to you an interactive visualization that uses synthetic sensor data
3. Sensor Data (matplotlib and mpld3) - takes you to a page that shows a server side rendered visualization in python
   4. This is still a work in progress
5. Blank Template - takes you to a blank page that you can use to display your own visualization
6. Settings and Sign out do nothing

### Global Filters

The sidebar contains built in date filters to make it convenient to filter your visualization by dates.

1. Most Recent Days - shows the current filter value, used to display a choice of "show the last x days" filter
   2. Does not filter charts yet
3. Single Data - shows the current filter value, used to display a date picker to filter by a single date
   4. Currenly only filters the plotly.js visualization
5. Date Range - shows the current filter value, used to show two date pickers to filter the date between two dates
   6. Does not filter charts yet

## Visualizations

### Sensor Data (plotly.js)

This visualization uses the data from `./data/sensor_data_v2.csv`. There are two synchronized plots shown.  The 
first shows "Initial Exceedance" by "Start Date". A single line (or series) is shown for each sensor which is 
identified by a "Group id", a "World Sensing Node id", and "Channel". 

NOTE: The legend contains many entries by default. This will be improved later.

You can hover over the points to see a tooltip of its details.  You can also use all the built-in plotly.js controls 
to pan and zoom. These controls are visible in the upper right corner when hovering over the chart.

The second chart shows the duration of each event. This is computed from the difference of "End Date" and "Start 
Date" and is shown in hours.

#### Dimension Bar

The dimension bar above the chart can be used to show a limited set of sensor data.  By default all data is shown.  

To use the dimension bar, change the first drop down to select a group. The chart will be filtered to only show data 
for this group and the world sensing node drop down will be enabled. 

Select a world sensing node value. The chart will be filtered to only show sensors from the selected group id and 
world sensing node and the channel drop down will be enabled.

Select a value from the channel drop down.  The chart will be filtered to show a single sensor.

NOTE: When a single sensor is show, lines are shown for the upper and lower tolerance limit for this sensor. 
Tolerance lines are not shown for more than one line at a time because that would be very confusing.

#### Future Considerations

The data contains a "Direction" value. This could be used show a different symbol for the point to indicate either 
upper or lower.

## Sensor Data (matplotlib and mpld3)

This is a work in progress. It currently displays a simple chart rendered in python on the server. Neither the 
dimension bar nor the date filters have any effect. 

TODO: Implement a copy of the plotly.js visualization and support the dimension bar and the date filters.
  
# Random Notes to Self

This uses postgres in docker as the database.  If you have your own database, just changes the values in the .env file to connect to it.

You will want to run the import_sample_data to initialize the database.

Put your code here.

TODO: need to do a production deployment, secrets, gnuincorn, etc

by convention functions
drawChart
drawDimensionBar

id = dimensionBar

dimensionBar controls ids need to match the column in the query they are showing
[all]

onLoad

code assumes all levels of a dimension are strings

the order of the dimension bar in the array must match the order in the ui
this is used to know which to update when

This is not perfect good but is good enough.  They are many different ways to accomplish the features shown in this demo.  This is meant to show how quick and easy it is,not architectural or code elegance