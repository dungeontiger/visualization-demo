let g_dateFilters = {
    singleDayFilter: null,
    dateRangeFilter: null,
    recentDaysFilter: null
}

function showMostRecentDaysDialog() {
    if (g_dateFilters.recentDaysFilter) {
//        document.getElementById("recentDaysModal").innerText = g_dateFilters.recentDaysFilter
    }
    let modal = new bootstrap.Modal(document.getElementById("recentDaysModal"))
    modal.show()
}

function showSingleDayDialog() {
    if (g_dateFilters.singleDayFilter) {
        document.getElementById("singleDayValue").value = g_dateFilters.singleDayFilter
    }
    let modal = new bootstrap.Modal(document.getElementById("singleDayModal"))
    modal.show()
}

function showDateRangeDialog() {
    if (g_dateFilters.dateRangeFilter) {
        document.getElementById("dateRangeModal").innerText = g_dateFilters.dateRangeFilter
    }
    let modal = new bootstrap.Modal(document.getElementById("dateRangeModal"))
    modal.show()
}

function saveSingleDate() {
    g_dateFilters.singleDayFilter = document.getElementById("singleDayValue").value
    updateDateFilterText()
    filters = getDimensionFilters()
    if (g_dateFilters.singleDayFilter) {
        if (!filters) {
            filters = {}
        }
        filters["singleDayFilter"] = g_dateFilters.singleDayFilter
    }
    drawChart(filters, false)
}

function saveRecentDays() {
    g_dateFilters.recentDaysFilter = document.getElementById("mostRecentDays").value
    updateDateFilterText()
}

function saveDateRange() {
    g_dateFilters.dateRangeFilter = document.getElementById("startDateValue").value + " to " + document.getElementById("endDateValue").value
    updateDateFilterText()
}

function updateDateFilterText() {
    if (g_dateFilters.recentDaysFilter) {
        document.getElementById("recentDaysFilterValue").innerText = "(" + g_dateFilters.recentDaysFilter + ")"
    } else {
        document.getElementById("recentDaysFilterValue").innerText = "([all])"
    }

    if (g_dateFilters.singleDayFilter) {
        document.getElementById("singleDateFilterValue").innerText = "(" + g_dateFilters.singleDayFilter + ")"
    } else {
        document.getElementById("singleDateFilterValue").innerText = "([all])"
    }

    if (g_dateFilters.dateRangeFilter) {
        document.getElementById("dateRangeFilterValue").innerText = "(" + g_dateFilters.dateRangeFilter + ")"
    } else {
        document.getElementById("dateRangeFilterValue").innerText = "([all])"
    }
}