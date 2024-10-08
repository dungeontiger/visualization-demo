let g_dropDowns
function drawDimensionBar(dropDowns) {
    // data contains all the data
    // drop_downs is a list of select id and an array of data for its values
    g_dropDowns = dropDowns
    for (let index in dropDowns) {
        dropDown = dropDowns[index]
        select = document.getElementById(dropDown[0])
        // hook up the onchange event
        select.addEventListener(
         'change',
         function() { valueChanged(this.id, dropDowns); },
         false
        );
        addOptions(select, dropDown[1])
    }
}

function valueChanged(id, dropDowns) {
    // the first control is always enabled
    // for each control, if the previous value is [all] then disable it and select all, otherwise enable it
    // we only need to check controls that follow the one that changed
    console.log("valueChange: " + id)
    let changedIndex = 0;
    for (let k = 0; k < dropDowns.length; k++) {
        if (id == dropDowns[k][0]) {
            changedIndex = k;
            break;
        }
    }

    for (var i = changedIndex + 1; i < dropDowns.length; i++) {
        prev = document.getElementById(dropDowns[i - 1][0])
        cur = document.getElementById(dropDowns[i][0])
        if (prev.value == "[all]") {
            cur.disabled = true;
            cur.value = "[all]"
        } else if (id != cur.id) {
            cur.disabled = false;
            // need to filter this control by the previous controls selected value
            first_option = cur.options[0]
            first_option.selected = true
            cur.innerHTML = ""
            cur.appendChild(first_option)
            filtered_values = []
            for (var j = 0; j < dropDowns[i - 1][1].length; j++) {
                if (prev.value == dropDowns[i - 1][1][j]) {
                    filtered_values.push(dropDowns[i][1][j])
                }
             }
             addOptions(cur, filtered_values)
        }
    }
    // we need to update the chart with new data
    // for each control that is not [all] pass its value as a dictionary
    filters = getDimensionFilters()
    date_filters = getDateFilters()
    if (date_filters) {
        if (date_filters.singleDayFilter) {
            if (!filters) {
                filters = {}
            }
            filters['singleDayFilter'] = date_filters.singleDayFilter
        }
    }
    drawChart(filters, false)
}

function addOptions(select, data) {
    // get the unique list of sorted values
    const uniqueValues = [...new Set(data)].sort()
    for (row in uniqueValues) {
        select.appendChild(createOption(uniqueValues[row]))
    }
}

function createOption(value) {
    option = document.createElement("option")
    option.text = value
    option.value = value
    return option
}

function getDimensionFilters() {
    filters = null
    for (var i = 0; i < g_dropDowns.length; i++) {
        if (!filters) {
            filters = {}
        }
        cur = document.getElementById(g_dropDowns[i][0])
        if (cur.value != "[all]") {
            filters[cur.id] = cur.value
        }
    }
    return filters
}