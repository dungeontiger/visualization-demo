import psycopg2
from dotenv import load_dotenv
import os
from flask import Flask
from flask import render_template

load_dotenv()

app = Flask(__name__)

@app.route("/")
def index():
    return render_template('index.html')

@app.route("/landing")
def landing():
    return render_template('landing.html')

@app.route("/sensor_data")
def sensor_data():
    return render_template('sensor_data.html')


@app.route("/api/sensor_data")
def get_sensor_data():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("""
SELECT 
    initial_exceedance, 
    to_char(start_at, 'YYYY-MM-DD HH24:MI:SS') as start_at, 
    channel, 
    lower_threshold, 
    upper_threshold, 
    direction,
    initial_exceedance > upper_threshold as exceeds_upper,
    initial_exceedance < lower_threshold as exceeds_lower
FROM 
    sensor_data 
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