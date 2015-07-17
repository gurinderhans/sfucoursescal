$(document).ready(function(){

  var CLASS_STATUS_CODES = ["Open", "Closed", "Wait List"];

  if(window.innerWidth < 580) week_display = 'ddd';
  else week_display = 'dddd';

  var cal_height = window.innerHeight - 90;

  $(window).resize(function(){
    cal_height = window.innerHeight - 90;
    $('#calendar').fullCalendar('option', 'height', cal_height);
  });

  function isMobile(){
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) )
      return true;
    return false;
  }

  // == CALENDAR INITIALIZE START ==============================================
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
  // == CALENDAR INITIALIZE END ================================================


  function isBlank(str) {return (!str || /^\s*$/.test(str));}
  function strContains(st,inst){return !(inst.indexOf(st) ==-1);}

  function mapDaysToWeekDayNames(weekDayName){
    switch(weekDayName) {
      case "M":
        return "2014-11-17"; // first day of project
        break;
      case "Tu":
        return "2014-11-18";
        break;
      case "W":
        return "2014-11-19";
        break;
      case "Th":
        return "2014-11-20";
        break;
      case "F":
        return "2014-11-21";
        break;
      default:
        return "2014-11-17";
    }
  }

  function addNewEvent(eventTitle, startT, endT, color, b_color){
    var newEvent = new Object();
    newEvent.title = eventTitle;
    newEvent.start = startT;
    newEvent.end = endT;
    newEvent.allDay = false;
    newEvent.backgroundColor = color;
    if(b_color!="default"){ newEvent.borderColor = b_color; }
    $('#calendar').fullCalendar('renderEvent', newEvent);
  }

  function parseCalendarDate(dayName){
    var returnDate = [];
    if(strContains("Days", dayName)){
      returnDate.push(mapDaysToWeekDayNames("M"));
      returnDate.push(mapDaysToWeekDayNames("Tu"));
      returnDate.push(mapDaysToWeekDayNames("W"));
      returnDate.push(mapDaysToWeekDayNames("Th"));
      returnDate.push(mapDaysToWeekDayNames("F"));
    } else if(strContains("Tu", dayName) || strContains("Th", dayName)){
      if(dayName.toLowerCase() == "TuTh".toLowerCase()){ // just in case
        returnDate.push(mapDaysToWeekDayNames(dayName.slice(0,2)));
        returnDate.push(mapDaysToWeekDayNames(dayName.slice(2,4)));
      } else{
        returnDate.push(mapDaysToWeekDayNames(dayName));
      }
    } else{
      var splitDays = dayName.split("");
      for(k=0;k<splitDays.length;k++){
        returnDate.push(mapDaysToWeekDayNames(splitDays[k]));
      }
    }
    return returnDate;
  }

  function displayErrorParsing(){
    //give input red border and do a pop up style animation
    $("#coursesInput").css("border", "1px solid red").css("border-top","none").addClass("shakeAnimation");
    setTimeout(function(){ $("#coursesInput").removeClass("shakeAnimation");}, 400);
  }

  function formatTime(time) {
    // if it contains AM/PM, keep that formatting
    if(strContains("m", time.toLowerCase())){
      return moment(time, "HH:mmA");
    } else{
      return moment(time, "HH:mm");
    }
  }

  function parseStuff(data) {

    var classes = Parser.parse(data)

    if(classes.length == 0) displayErrorParsing();
    else $("#coursesInput").css("border", "1px solid #09CF2A").css("border-top","none");

    classes.forEach(function (eachClass, i) {
      // var ss = parseCalendarDate(eachClass['class_time'][0]['weekDays']);

      eachClass['class_time'].forEach(function (time, i) {
        var title = eachClass['class_name']

        var startTime = formatTime(time['startTime']).format("HH:mm:ss")
        var endTime = formatTime(time['endTime']).format("HH:mm:ss")

        parseCalendarDate(time['weekDays']).forEach(function (date, i) {
          console.log(startTime);
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
      // Parser.parse(coursesInput);
      parseStuff(coursesInput);
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

  if(isMobile()){
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
