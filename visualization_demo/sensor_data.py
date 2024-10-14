# https://github.com/nipunbatra/mpld3-flask/blob/master/routes.py
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
plt.ioff()

from threading import Lock
lock = Lock()
import mpld3

def get_sensor_data_matplotlib():
    with lock:
        fig = plt.figure()
        plt.plot([1, 2, 3, 4])
        plt.ylabel('some numbers')
    return mpld3.fig_to_html(fig)
