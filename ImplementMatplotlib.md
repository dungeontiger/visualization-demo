# Implement a matplotlib chart

The following steps describe how to add your own server side rendered visualization to the application. How to use the Date Filters and the dimension bars is TBD.

1. Import your data into postgres
2. Write your visualization in python using matplotlib
   3. The file `matplotlib_test.py` shows how to test or prototype a matplotlib chart
   4. Create your own file to use the same file to get the visualization to look the way you want
5. Choose a name for your visualization, for these instructions we will assume `xxx`
6. Edit `base.html` and change the text `Other Visualization` to `xxx` and change the href to `/xxx`

```commandline
            </li>
            <li class="nav-item">
              <a class="nav-link d-flex align-items-center gap-2" href="/xxx">
                xxx
              </a>
            </li>
```

5. Make a copy of `blank_template.html` and call it `xxx.html`
6. In `xxx.html` make the following changes:
   1. Change the title block to whatever title you want, for example `<h1>xxx</h1>`
   2. Change the vis block to `{{ chart_html }}`

The file `xxx.html` should look like this:

```jinja
{% extends 'base.html' %}

<!-- include the js files needed for this page -->
{% block page_script %}
    <!-- TODO: Include JavaScript files necessary for this page -->
{% endblock %}

<!-- define the title for this visualizaiton page -->
{% block vis_title %}
    <h1>xxx<h1>
{% endblock %}

<!-- this page uses a dimension bar, define it here -->
{% block dimension_bar %}
    <!-- TODO: Include a dimension bar here if you want one -->
{% endblock %}

<!-- container for the actual visualization here -->
{% block vis %}
    {{ chart_html }}
{% endblock %}
```

7. Add a method to `app.py` (or add a separate file) to render your matplotlib chart.
   1. For an example, look at `sensor_data.py`
   2. Let's assume it is called `get_xxx_matplotlib`
   2. Be sure to include all the necessary imports
   3. Be sure to include your rendering in a `with lock` block
      4. TODO: This is not threadsafe???? WTF
   5. Be sure to start your rendering with `plt.figure()`
   6. Return the html for your chart by calling `mpld3.fig_to_html(fig)`
   7. The code will look like this:

```python
# https://github.com/nipunbatra/mpld3-flask/blob/master/routes.py
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
plt.ioff()

from threading import Lock
lock = Lock()
import mpld3

def get_xxx_matplotlib():
    with lock:
        fig = plt.figure()
        # TODO: do magic matplotlib stuff here
    return mpld3.fig_to_html(fig)

```

8. Create a new route in `app.py` to display your `xxx.html` page
   1. Be sure to call your function above that returns the html for your chart and pass it as a parameter to the page
   2. Be sure to give your page a unique url like `xxx` (must match what you put in `base.html`) and a unique python function name like `xxx_python`
   1. It should look like this:

```ptyhon
@app.route("/xxx")
def xxx_python():
    # the chart is rendered in python via matplotlib and then converted to html
    html = get_xxx_matplotlib()
    return render_template('xxx.html', chart_html=html)
```

9. Start the flask server (or restart it) and navigate to your page