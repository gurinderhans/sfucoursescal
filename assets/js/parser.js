$(document).ready(function(){

  var CLASS_STATUS_CODES = ["Open", "Closed", "Wait List"];

  if(window.innerWidth < 580) week_display = 'ddd';
  else week_display = 'dddd';

  var cal_height = window.innerHeight - 90;

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
    weekends:false,
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
        return "2014-11-17";//start day of this project
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

  function parseTime(time){
    var parsedTime = [];
    if(strContains("and", time)){
      var timesSplit = time.split("and");
      for(j=0;j<timesSplit.length;j++){
        var timeSplit = timesSplit[j].split(" ");
        timeSplit = timeSplit.filter(Boolean);
        parsedTime.push(timeSplit);
      }
    } else{
      parsedTime.push(time.split(" "));
    }
    return parsedTime;
  }

  function parse(coursesInput){
    var arrayCourses = coursesInput.split("\n");

    var classes = [];
    for(i=0;i<arrayCourses.length;i++){
      if(!isBlank(arrayCourses[i])) classes.push(arrayCourses[i].trim());
    }


    var classesSplit = [];
    var split=[0];
    for(i=0;i<classes.length;i++){
      if((CLASS_STATUS_CODES.indexOf(classes[i]) > -1)){
        split.push(i);
      }
    }

    for(i=0;i<split.length-1;i++){
      classesSplit.push(classes.slice(split[i], split[i+1]));
    }

    for(i=0;i<classesSplit.length;i++){
      var thisClass = classesSplit[i];
      for(j=0;j<thisClass.length;j++){
        if((CLASS_STATUS_CODES.indexOf(thisClass[j]) > -1)){
          thisClass.splice( j, 1 );
        }
        if(thisClass[j].indexOf("Delete") > -1) thisClass.splice(j,1);
      }
    }

    return classesSplit;
  }

  function parseClasses(cr){
    var classesSplit = parse(cr);
    for(i=0; i<classesSplit.length; i++){
      var parsedTimes = parseTime(classesSplit[i][2]);
      for(j=0;j<parsedTimes.length;j++){
        var color = "#3a87ad"; var borderColor = "default";
        if(strContains("Days", parsedTimes[j][0])){
          parsedTimes[j].splice(1,1);
          parsedTimes[j][3] = "2:00AM";
          color = "#cd0000";
          borderColor = "#ffffff";
        }
        var parsedCalDates = parseCalendarDate(parsedTimes[j][0]);
        for(k=0;k<parsedCalDates.length;k++){
          var dayDate = parsedCalDates[k];
          var startTime = parsedTimes[j][1];
          var endTime = parsedTimes[j][3];

          if(strContains("m",startTime.toLowerCase())){
            startTime = moment(startTime, "HH:mmA");
            endTime = moment(endTime, "HH:mmA");
          } else{
            startTime = moment(startTime, "HH:mm");
            endTime = moment(endTime, "HH:mm");
          }

          startTime = startTime.format("HH:mm:ss");
          endTime = endTime.format("HH:mm:ss");

          addNewEvent(classesSplit[i][0], (dayDate+"T"+startTime), (dayDate+"T"+endTime), color, borderColor);
        }
      }
    }
  }

  // ===== INIT APP =======================================

  $('#coursesInput').on('paste', function () {
    $(this).css("font-size","12px");
    setTimeout(function () {
      var coursesInput = $("#coursesInput").val();
      $("#calendar").fullCalendar('removeEvents');
      parseClasses(coursesInput);
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
