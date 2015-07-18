$(document).ready(function(){

  if(window.innerWidth < 580) week_display = 'ddd';
  else week_display = 'dddd';

  var cal_height = window.innerHeight - 90;

  $(window).resize(function(){
    cal_height = window.innerHeight - 90;
    $('#calendar').fullCalendar('option', 'height', cal_height);
  });


  /**
   * Calendar Initialization
   */

  $('#calendar').fullCalendar({
    defaultView: 'agendaWeek',
    allDaySlot: false,
    height: cal_height,
    weekends: false,
    columnFormat: {
      week: week_display
    },
    scrollTime: "07:00:00",
    header: {
      left: '',
      center: '',
      right: ''
    },
    defaultDate: '2014-11-17',
    editable: false
  });



  function addNewEvent(eventTitle, startT, endT, color, b_color){

    var newEvent = new Object();
    newEvent.title = eventTitle;
    newEvent.start = startT;
    newEvent.end = endT;
    newEvent.allDay = false;
    newEvent.backgroundColor = color;

    if (b_color != "default") {
      newEvent.borderColor = b_color;
    }

    $('#calendar').fullCalendar('renderEvent', newEvent);
  }



  function displayErrorParsing(){
    // give input red border and do a pop up style animation
    $("#coursesInput").css("border", "1px solid red").css("border-top","none").addClass("shakeAnimation");
    // remove the class after 0.4s when the animation is over
    setTimeout(function(){ $("#coursesInput").removeClass("shakeAnimation");}, 400);
  }

  function addCalendarData(data) {

    var classes = Parser.parse(data)

    if(classes.length == 0) {
      displayErrorParsing()
      return
    }

    $("#coursesInput").css("border", "1px solid #09CF2A").css("border-top","none");

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

  // ===== INIT APP =======================================

  $('#coursesInput').on('paste', function () {
    $(this).css("font-size", "12px");
    setTimeout(function () {
      $("#calendar").fullCalendar('removeEvents');
      var coursesInput = $("#coursesInput").val();
      addCalendarData(coursesInput);
      $("#coursesInput").blur().val("").css("font-size","18px");
    }, 300);
  });

  // ===== KEY & CLICK EVENTS ====================================

  $(window).keydown(function(evt) {
    if (evt.which == 73) { // 'i'
      $("#instructions").show();
    }
  }).keyup(function(evt) {
    if (evt.which == 73) { // 'i'
      $("#instructions").hide();
    }
  });

  $(window).keydown(function(evt) {
    if (evt.which == 72) { // 'h'
      $("#notesWrapper").show();
    }
  });

  $("#left.instr").click(function(){
    var win = window.open("assets/images/instructions.jpg", '_blank');
    win.focus();
  });

  $("#right.instr").click(function(){
    html2canvas(document.getElementById("calendar"), {
      onrendered: function(canvas) {
        var myImage = canvas.toDataURL("image/png"); // maybe octet stream for downloading it straight
        window.open(myImage);
      }
    });
  });

  if(Tools.isMobile()){
    $("#left.instr span").text("Click");
    $("#right.instr span").text("Click");
  }

  //screenshot
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
});
