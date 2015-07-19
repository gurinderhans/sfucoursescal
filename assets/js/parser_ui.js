$(document).ready(function () {

  /**
   * Initialize calendar
   */
  $('#calendar').fullCalendar({
    defaultView: 'agendaWeek',
    allDaySlot: true,
    allDayText: 'TBA',
    height: (window.innerHeight - 50), // TODO: update on window.resize
    weekends: false,
    columnFormat: {
      week: 'ddd',
    },
    scrollTime: "07:00:00",
    header: {
      left: '',
      center: '',
      right: ''
    },
    defaultDate: '2014-11-17',
    editable: false,
  });



  /**
   * on(textbox paste)
   */

  $('#courses-text').on('paste', function () {

    // must wait for textbox to fill up
    setTimeout(function () {
      // clean previous data
      $("#calendar").fullCalendar('removeEvents');
      // add new data
      addCalendarData($("#courses-text").val());

      $('#courses-text').blur().val("")

      $('.input.input--makiko').removeClass('input--filled');

    }, 300);
  });

  // animate input bar on click
  $("#courses-text").click(function () {
    $(".header h2").slideUp(250);
    $(".header").animate({
      height: "80px"
    }, 250);
  });


  function addNewEvent(eventTitle, startT, endT, color, b_color){

    var newEvent = new Object();
    newEvent.title = eventTitle;
    newEvent.start = startT;
    newEvent.end = endT;
    newEvent.allDay = (~endT.indexOf("01:00:00")) ? true : false;
    newEvent.backgroundColor = color;

    if (b_color != "default") {
      newEvent.borderColor = b_color;
    }

    $('#calendar').fullCalendar('renderEvent', newEvent);
  }

  function addCalendarData(data) {

    var classes = Parser.parse(data)

    classes.forEach(function (eachClass, i) {

      eachClass['class_time'].forEach(function (time, i) {
        var title = eachClass['class_name']
        var startTime = time['startTime']
        var endTime = time['endTime']

        Tools.mapWeekDayToCalDate(time['weekDays']).forEach(function (date, i) {
          addNewEvent(title, date+"T"+startTime, date+"T"+endTime, "#cd0000", "#fff");
        });
      })
    })
  }

  // screenshot
  $(window).keydown(function(evt) {
    if (evt.which == 74) {} // j
  }).keyup(function(evt) {
    if (evt.which == 74) { // 'j'
      html2canvas(document.getElementById("calendar"), {
        onrendered: function(canvas) {
          var myImage = canvas.toDataURL("image/png"); // maybe octet stream for downloading it straight
          window.open(myImage);
        }
      });
    }
  });


  // update calendar height on window resize
  $(window).resize(function(){
    $('#calendar').fullCalendar('option', 'height', (window.innerHeight - 50));
  });

});
