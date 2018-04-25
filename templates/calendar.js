
$(document).ready(function() {
    var calElement = document.getElementById("my-calendar");

    //get today's date
    var today = new Date();

    var dayCheckFormat = dateFormat(today, "selected");

    var defaultDay = dateFormat(today, "default");

    //default display today's data
    getDayData(today);

    // Create the calendar set on today's date
    var cal = jsCalendar.new(calElement, defaultDay, {
        language: "en",
        zeroFill: false, //disables date's number zero fill
        monthFormat: "month", // february would be formatted as February
        navigator: true, //enables month's navigation buttons
        navigatorPosition: "both"
    });

    //set selected day as today
    cal._date = today;

    cal.onDateClick(function(event, date) {
        //set selected day to date clicked
        cal._date = date;
        // cal.set(date);
        var day = date.getDate();
        var month = date.getMonth() + 1;
        var year = date.getFullYear();

        if(day<10) {
            day = '0' + day
        }

        if(month<10) {
            month = '0' + month
        }
        var dateSelectedInt = parseInt(year + "" + month + "" + day);

        console.log(dateSelectedInt);
        console.log(dayCheckFormat);

        //check if date is today or preceding today's date
        if (dateSelectedInt > dayCheckFormat) {
            console.log("date too late");
        } else {
            console.log("fetching data");
            getData(date);
        }
    });

    // when month is changed on the calendar, if month view is currently selected
    // data for that month will appear
    cal.onMonthChange(function(event, date) {
        if($('#month').is(':checked')) {
            getMonthData(date);
        }
    })

    // when month toggle button is clicked, appropriate data is retrieved and displayed
    $('#month, #day').click(function() {
        getData(cal._date);
    });

});

function dateFormat(date, type) {
    var dd = date.getDate();
    var mm = date.getMonth()+1; //January is 0!
    var yyyy = date.getFullYear();

    if(dd<10) {
        dd = '0'+dd
    }

    if(mm<10) {
        mm = '0'+mm
    }

    if (type == "default") {
        return dd + '/' + mm + '/' + yyyy; // format dd/mm/yyy
    } else if (type == "selected") {
        return parseInt(yyyy+""+mm+""+dd); // format yyyymmdd
    }
}

function getData(date) {
    if($('#day').is(':checked')) {
        toggleView("D");
        getDayData(date);
    } else if($('#month').is(':checked')) {
        toggleView("M");
        getMonthData(date);
    }
}

function getDayData(date) {
    var dayHeader = document.getElementById("dayHeader");
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dayHeader.innerHTML = "Overview of " + date.toLocaleDateString("en-US", options);

    //get data from the SQL database for the date
    var dateForDatabase = dateFormat(date);
    //need to know how many entries there are
    //list emotions and responses

    var entries = document.getElementById("entries");
    entries.innerHTML = '';

    //for loop on length of response sent back from database (# of entries)
        var entry = document.createElement("entry");
        entry.style.lineHeight = '40px';
        var time = document.createElement("time");
        time.innerHTML = '<u style="color: white">' + 'Time of Entry:' + '</u>' + '  ' + '11:00AM' + '<br>'; // need time
        entry.appendChild(time);

        var location = document.createElement("location");
        location.innerHTML = '<u style="color: white">' + 'Location:' + '</u>' + '  ' + 'school' + '<br>'; // need time
        entry.appendChild(location);

        var emotions = document.createElement("emotions");
        emotions.innerHTML = '<u style="color: white">' + 'Emotions:' + '</u>' + '<br>' + '<img src="imgs/ems/happy.png" style="height:100px; width:100px">' + '  ' +
            '<img src="imgs/ems/worried.png" style="height:100px; width:100px">' + '  ' + '<img src="imgs/ems/excited.png" style="height:100px; width:100px">';

        // var emotionsUL = $('<ul></ul>');
        // //loop through emotions
        //     var li = $('<li>Happy</li>'); //make this the images of the emotions
        //     // li.html('Happy');
        //     emotionsUL.append(li);
        // emotions.append(emotionsUL);
        entry.appendChild(emotions);

        //if positive
        if (0) {
            var action = document.createElement("action");
            action.innerHTML = '<br>' + '<u style="color: white">' + 'What were you doing?' + '</u>' + '  ' + 'drawing' + '<br>'; // need time
            entry.appendChild(action);
        } else if (1) { // else if negative
            var action = document.createElement("action");
            action.innerHTML = '<br>' + '<u style="color: white">' + 'What did you do to feel better?' + '</u>' + '  ' + 'run/exercise' + '<br>'; // need time
            entry.appendChild(action);

            var adult = document.createElement("adult");
            adult.innerHTML = '<u style="color: white">' + 'Did you talk to an adult?' + '</u>' + '  ' + 'yes' + '<br>'; // need time
            entry.appendChild(adult);

            var action = document.createElement("action");
            action.innerHTML = '<u style="color: white">' + 'What did you do to feel better?' + '</u>' + '  ' + 'run/exercise' + '<br>'; // need time
            entry.appendChild(action);

            var freeWrite = document.createElement("freeWrite");
            freeWrite.innerHTML = '<u style="color: white">' + 'How have your emotions changed since last time?' + '</u>' + '  ' + 'i am more happy than before' + '<br>'; // need time
            entry.appendChild(freeWrite);

        }

        entries.appendChild(entry);


}

function getMonthData(date) {
    var monthHeader = document.getElementById("monthHeader");
    monthHeader.innerHTML = "Overview of " + date.toLocaleString("en-US", { month: "long", year: "numeric" });
    var dateForDatabase = dateFormat(date);

    //new stuff from Jared
    // $.get("/calendar/30days", function(data) { // how do i give u the date
    //     makeLineGraph(data[1], data[2]); // emotion values pos/neg
    //     makeBarGraph(data[0]); // emotion counts
    // }

    // $.get("/calendar/30days?month=" + date.getMonth() + 1, function(data) {
    //     makeLineGraph(data[1], data[2]); // emotion values pos/neg
    //     makeBarGraph(data[0]); // emotion counts
    // });

    makeLineGraph();
    makeBarGraph();
}

// function makeLineGraph(posValues, negValues) {
function makeLineGraph() {

    // var posPoints = [];
    // var negPoints = [];
    // for (var i = 0; i<posValues.length; i++) {
    //     var posItem = { label: `Day ${i+1}`, y: posValues[i] }
    //     negPoints.push(posItem);
    //     var negItem = { label: `Day ${i+1}`, y: negValues[i] }
    //     negPoints.push(negItem);
    // }

    //temporary fake placeholder points
    var posPoints = [{ label: "Day 1", y: 2 },
                { label: "Day 2", y: 0 },
                { label: "Day 3", y: 1 },
                { label: "Day 4", y: 2 },
                { label: "Day 5", y: 2 },
                { label: "Day 6", y: 2 },
                { label: "Day 7", y: 1 },
                { label: "Day 8", y: 1 },
                { label: "Day 9", y: 3 },
                { label: "Day 10", y: 1 },
                { label: "Day 11", y: 2 },
                { label: "Day 12", y: 3 },
                { label: "Day 13", y: 1 },
                { label: "Day 14", y: 0 },
                { label: "Day 15", y: 2 },
                { label: "Day 16", y: 5 },
                { label: "Day 17", y: 4 },
                { label: "Day 18", y: 1 },
                { label: "Day 19", y: 3 },
                { label: "Day 20", y: 2 },
                { label: "Day 21", y: 2 },
                { label: "Day 22", y: 1 },
                { label: "Day 23", y: 3 },
                { label: "Day 24", y: 4 },
                { label: "Day 25", y: 2 },
                { label: "Day 26", y: 3 },
                { label: "Day 27", y: 4 },
                { label: "Day 28", y: 1 },
                { label: "Day 29", y: 0 },
                { label: "Day 30", y: 2 }
            ]     //temporary fake placeholder points
    var negPoints = [
                { label: "Day 1", y: 3 },
                { label: "Day 2", y: 2 },
                { label: "Day 3", y: 3 },
                { label: "Day 4", y: 2 },
                { label: "Day 5", y: 3 },
                { label: "Day 6", y: 4 },
                { label: "Day 7", y: 0 },
                { label: "Day 8", y: 3 },
                { label: "Day 9", y: 1 },
                { label: "Day 10", y: 2 },
                { label: "Day 11", y: 2 },
                { label: "Day 12", y: 2 },
                { label: "Day 13", y: 3 },
                { label: "Day 14", y: 4 },
                { label: "Day 15", y: 2 },
                { label: "Day 16", y: 3 },
                { label: "Day 17", y: 0 },
                { label: "Day 18", y: 2 },
                { label: "Day 19", y: 1 },
                { label: "Day 20", y: 1 },
                { label: "Day 21", y: 1 },
                { label: "Day 22", y: 3 },
                { label: "Day 23", y: 2 },
                { label: "Day 24", y: 0 },
                { label: "Day 25", y: 1 },
                { label: "Day 26", y: 1 },
                { label: "Day 27", y: 0 },
                { label: "Day 28", y: 1 },
                { label: "Day 29", y: 2 },
                { label: "Day 30", y: 1 }
            ]

    var chart = new CanvasJS.Chart("lineContainer", {
        theme:"light2",
        animationEnabled: true,
        title:{
            // text: "Day to Day"
        },
        axisY :{
            includeZero: true,
            title: "Number of Times Logged",
        },
        toolTip: {
            shared: "true"
        },
        legend:{
            cursor:"pointer",
            itemclick : toggleDataSeries
        },
        data: [{
            type: "spline",
            visible: true,
            showInLegend: true,
            yValueFormatString: "##",
            name: "Positive Emotions",
            dataPoints: posPoints
        },

        {
            type: "spline",
            visible: false,
            showInLegend: true,
            yValueFormatString: "#",
            name: "Negative Emotions",
            dataPoints: negPoints
        }]
    });
        chart.render();

    function toggleDataSeries(e) {
        if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible ){
            e.dataSeries.visible = false;
        } else {
            e.dataSeries.visible = true;
        }
        chart.render();
    }
}

// function makeBarGraph(data) {
function makeBarGraph() {

    // var points = []
    // var emotions = ["Happy", "Sad", "Worried", "Content", "Fearful", "Excited", "Lonely", "Surprised", "Hurt"]
    // for (var i = 0; i<emotions.length; i++) {
    //     var item = { y: response.emotions[i], label: emotions[i] }
    //     points.push(item);
    // }

    //temporary fake placeholder points
    var points =  [
            { y: 16, label: "Happy" },
            { y: 18,  label: "Sad" },
            { y: 8,  label: "Worried" },
            { y: 23,  label: "Content" },
            { y: 5,  label: "Fearful" },
            { y: 7, label: "Excited" },
            { y: 12,  label: "Lonely" },
            { y: 0,  label: "Surprised" },
            { y: 2,  label: "Hurt" }
        ]

    var chart = new CanvasJS.Chart("barContainer", {
    animationEnabled: true,
    theme: "light2", // "light1", "light2", "dark1", "dark2"
    title:{
        // text: "Emotions Logged This Month"
    },
    axisY: {
        title: "Number of Times Logged"
    },
    data: [{
        type: "column",
        showInLegend: true,
        legendMarkerColor: "grey",

        dataPoints: points
    }]
});
chart.render();
}

function toggleView(view) {
    var day = document.getElementById("dayView");
    var month = document.getElementById("monthView");
    if (view == "M") {
        month.style.display = "block";
        day.style.display = "none";
    } else if (view == "D") {
        month.style.display = "none";
        day.style.display = "block";
    }
}


//on toggle clicks, trigger get day data or get month data
//on month change, trigger get month data
