$(document).ready(function(){

  var CLASS_STATUS_CODES = ["Open", "Closed", "Wait List"];

  // == CALENDAR INITIALIZE START ==============================================
  $('#calendar').fullCalendar({
    defaultView: 'agendaWeek',
    allDaySlot: false,
    height: 680,
    weekends:false,
    columnFormat: {
      week: 'dddd'
    },
    minTime: "07:00:00",
    header: {
      left: '',
      center: '',
      right: ''
    },
    defaultDate: '2014-11-17',
    editable: false,
    eventLimit: true
  });
  // == CALENDAR INITIALIZE END ================================================


  function isBlank(str) {return (!str || /^\s*$/.test(str));}
  function strContains(st,inst){return !(inst.indexOf(st) ==-1);}

  var chunks = function(array, size) {
    var results = [];
    while (array.length) {results.push(array.splice(0, size));}
    return results;
  };

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

  function addNewEvent(eventTitle, startT, endT){
    var newEvent = new Object();
    newEvent.title = eventTitle;
    newEvent.start = startT;
    newEvent.end = endT;
    newEvent.allDay = false;
    $('#calendar').fullCalendar('renderEvent', newEvent);
  }

  function parseCalendarDate(dayName){
    var returnDate = [];
    if(strContains("Days", dayName)){
      //
    } else if(strContains("Tu", dayName) || strContains("Th", dayName)){
      returnDate.push(mapDaysToWeekDayNames(dayName));
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

  //DEBUG SECTION
  function parse(coursesInput){
    // var coursesInput = $("#coursesInput").val();
    var arrayCourses = coursesInput.split("\n");
    // console.log(arrayCourses);

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
    // console.log(split);

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
      // thisClass.pop(); //?? MAYBE
    }

    return classesSplit;
  }

  function parseClasses(cr){
    var classesSplit = parse(cr);
    // console.log(classesSplit);
    for(i=0; i<classesSplit.length; i++){
      var parsedTimes = parseTime(classesSplit[i][2]);// classesSplit[i][2] == MWF 12:30 - 13:20
      for(j=0;j<parsedTimes.length;j++){
        var parsedCalDates = parseCalendarDate(parsedTimes[j][0]);
        for(k=0;k<parsedCalDates.length;k++){
          // console.log(parsedCalDates);
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

          addNewEvent(classesSplit[i][0], (dayDate+"T"+startTime), (dayDate+"T"+endTime));
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

      // $("#formArea textarea").blur();
    }, 300);
  });

  // ===== KEY EVENTS ====================================

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
    if (evt.which == 78) { // 'n'
      $("#notesWrapper").show();
    }
  }).keyup(function(evt) {
    if (evt.which == 78) { // 'n'
      $("#notesWrapper").hide();
    }
  });

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
