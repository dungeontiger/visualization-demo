"""Imports sample data from data directory into the postgres database"""
import csv

from visualization_demo.app import get_connection

conn = get_connection()
cur = conn.cursor()

# drop table if it already exists
cur.execute("DROP TABLE IF EXISTS sensor_data")
conn.commit()
# create the table
cur.execute("""
CREATE TABLE sensor_data (
    group_id TEXT,
    worldsensing_node_id TEXT,
    channel TEXT,
    initial_exceedance FLOAT,
    start_at TIMESTAMP,
    end_at TIMESTAMP,
    lower_threshold FLOAT NULL,
    upper_threshold FLOAT NULL,
    direction TEXT NULL
)
""")
conn.commit()

with open('../data/sensor_data_v2.csv', 'r') as f:
    reader = csv.reader(f)
    next(reader) # Skip the header row.
    for row in reader:
        group_id = row[0]
        worldsensing_node_id = row[1]
        channel = row[2]
        intial_exceedance = row[3]
        start_at = row[4]
        end_at = row[5]
        direction = row[6]
        lower = row[7] if row[7] else 'NULL'
        upper = row[8] if row[8] else 'NULL'

        values = (f"'{group_id}', '{worldsensing_node_id}', '{channel}', {intial_exceedance}, '{start_at}', "
                  f"'{end_at}', {lower}, {upper}, '{direction}'")
        cur.execute(f"INSERT INTO sensor_data (group_id, worldsensing_node_id, channel, initial_exceedance, start_at,"
                    f" end_at, lower_threshold, upper_threshold, direction) VALUES ({values})")
conn.commit()
