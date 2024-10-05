function drawDimensionBar(dropDowns) {
    // data contains all the data
    // drop_downs is a list of select id and an array of data for its values
    for (index in dropDowns) {
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
    changedIndex = 0;
    for (var k = 0; k < dropDowns.length; k++) {
        if (id == dropDowns[k][0]) {
            changedIndex = k;
            break;
        }
    }
    for (var i = changedIndex; i < dropDowns.length; i++) {
        if (i > 0) {
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
                cur.append(first_option)
                filtered_values = []
                for (var j = 0; j < dropDowns[i - 1][1].length; j++) {
                    if (prev.value == dropDowns[i - 1][1][j]) {
                        filtered_values.push(dropDowns[i][1][j])
                    }
                 }
                 addOptions(cur, filtered_values)
            }
        }
    }
    // we need to update the chart with new data
    // for each control that is not [all] pass its value as a dictionary
    filters = {}
    for (var i = 0; i < dropDowns.length; i++) {
        cur = document.getElementById(dropDowns[i][0])
        if (cur.value != "[all]") {
            filters[cur.id] = cur.value
        }
    }

    drawChart(filters)
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
    option.id = value
    return option
}
