$(document).ready(function () {

  /**
   * Initialize calendar
   */
  $('#calendar').fullCalendar({
    defaultView: 'agendaWeek',
    allDaySlot: true,
    allDayText: 'TBA',
    height: (window.innerHeight - 50),
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
  $("#courses-text").focus(function () {
    $(".header h2").slideUp(250);
    $(".header").animate({
      height: "80px"
    }, 250);
  });


  function addNewEvent(eventTitle, startT, endT, color, classStatus, class_campus){

    var newEvent = new Object();
    newEvent.title = eventTitle;
    newEvent.start = startT;
    newEvent.end = endT;
    newEvent.allDay = (~endT.indexOf("01:00:00")) ? true : false;
    newEvent.backgroundColor = "#fff";
    newEvent.borderColor = color;
    newEvent.textColor = "rgb(13, 103, 65)"
    newEvent.className = classStatus + " " + class_campus

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
          // ** background color == campus color
          var class_campus_color = 'rgb(231, 231, 231)'; // no campus color == a shade of gray
          var class_campus = 'na';
          for (key in Parser.CAMPUS_COLORS) {

            Parser.CLASS_CAMPUS[key].forEach(function (val, index) {
              if (eachClass['class_room'].indexOf(val) > -1) {
                class_campus_color = Parser.CAMPUS_COLORS[key]
                class_campus = key
              }
            });
          }

          var class_status = "class-status "+Tools.trimString(eachClass['class_status'].toString().toLowerCase());

          addNewEvent(title, date+"T"+startTime, date+"T"+endTime, class_campus_color, class_status, class_campus.toString().toLowerCase());
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
