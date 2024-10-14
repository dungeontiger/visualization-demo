import psycopg2
from dotenv import load_dotenv
import os
from flask import Flask
from flask import render_template
from flask import request

from visualization_demo import sensor_data

load_dotenv()

app = Flask(__name__)

# Include page routes here

@app.route("/")
def index_route():
    return render_template('index.html')

@app.route("/sensor_data")
def sensor_data_route():
    # everything is done client side here via plotly.js
    return render_template('sensor_data.html')

@app.route("/sensor_data_python")
def sensor_data_python_route():
    # the chart is rendered in python via matplotlib and then converted to html
    html = sensor_data.get_sensor_data_matplotlib()
    return render_template('sensor_data_python.html', chart_html=html)

@app.route("/blank_template")
def blank_template_route():
    return render_template('blank_template.html')

# Include REST APIs here

@app.route("/api/sensor_data")
def get_sensor_data_route():
    # URL parameters are filters
    where_clause = ""
    if len(request.args) > 0:
        print(request.args)
        where_clause = "WHERE "
        for column in request.args:
            if column == "singleDayFilter":
                where_clause += f"to_char(start_at, 'YYYY-MM-DD') = '{request.args[column]}' AND "
            else:
                where_clause += f"{column} = '{request.args[column]}' AND "
        where_clause = where_clause[:-5]
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(f"""
SELECT
    group_id,
    worldsensing_node_id,
    channel,
    initial_exceedance, 
    to_char(start_at, 'YYYY-MM-DD HH24:MI:SS') as start_at, 
    to_char(end_at, 'YYYY-MM-DD HH24:MI:SS') as end_at, 
    lower_threshold, 
    upper_threshold, 
    direction,
    initial_exceedance > upper_threshold as exceeds_upper,
    initial_exceedance < lower_threshold as exceeds_lower,
    EXTRACT(EPOCH FROM (end_at - start_at)) as duration
FROM 
    sensor_data
{where_clause}
ORDER BY 
    start_at
""")
    results = cur.fetchall()
    return results


def get_connection():
    return psycopg2.connect(database=os.environ["POSTGRES_DB"],
                            user=os.environ["POSTGRES_USER"],
                            password=os.environ["POSTGRES_PASSWORD"],
                            host=os.environ["POSTGRES_HOST"],
                            port=os.environ["POSTGRES_PORT"])