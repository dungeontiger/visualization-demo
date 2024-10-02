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
    initial_exceedance FLOAT,
    start_at TIMESTAMP,
    channel INT,
    lower_threshold FLOAT NULL,
    upper_threshold FLOAT NULL,
    direction TEXT NULL
)
""")
conn.commit()


with open('../data/sensor_data.csv', 'r') as f:
    reader = csv.reader(f)
    next(reader) # Skip the header row.
    for row in reader:
        lower = row[3] if row[3] else 'NULL'
        upper = row[4] if row[4] else 'NULL'
        direction = f"'{row[5]}'" if row[5] else 'NULL'
        values = f"{row[0]}, '{row[1]}', {row[2]}, {lower}, {upper}, {direction}"
        cur.execute(f"INSERT INTO sensor_data (initial_exceedance, start_at, channel, lower_threshold, upper_threshold, direction) VALUES ({values})")
conn.commit()