Visualization Demo
=
Demo that creates a visualization application. It can easily be expanded to include more visualizations.

Run setup.sh to get the project ready.

This uses postgres in docker as the database.  If you have your own database, just changes the values in the .env file to connect to it.

You will want to run the import_sample_data to initialize the database.

7am start
8:30am project setup and data imported (1.5 hr)
8:40am basic flask server running (10 min)
9:10am basic chart with actual data rendering (30 min)

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

This is not perfect good but is good enough.  They are many different ways to accomplish the features shown in this demo.  This is meant to show how quick and easy it is,not architectural or code elegance