$(document).ready(function () {

  /**
   * Initialize calendar
   */
  $('#calendar').fullCalendar({
    defaultView: 'agendaWeek',
    allDaySlot: false,
    allDayText: 'TBA',
    height: (window.innerHeight - 90), // TODO: update on window.resize
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
    // run animations
    $(".header h2").slideUp(250);
    $(".header").animate({
      height: "80px"
    }, 250);

    // do stuff with text
    setTimeout(function () {
      // clean calendar
      $("#calendar").fullCalendar('removeEvents');

      var coursesInput = $("#courses-text").val();

      addCalendarData(coursesInput);

    }, 300);
  });


  function addNewEvent(eventTitle, startT, endT, color, b_color){

    var newEvent = new Object();
    newEvent.title = eventTitle;
    newEvent.start = startT;
    newEvent.end = endT;
    // console.log(endT);
    // TODO: remove this hack
    newEvent.allDay = (~endT.indexOf("01:00:00")) ? true : false;
    newEvent.backgroundColor = color;

    if (b_color != "default") {
      newEvent.borderColor = b_color;
    }

    $('#calendar').fullCalendar('renderEvent', newEvent);
  }

  function addCalendarData(data) {

    var classes = Parser.parse(data)
    console.log(classes);

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

});


// // initial calculations
//

//
// var cal_height = window.innerHeight - 90;
//

//
//
// /**
//  * Calendar Initialization
//  */
//
//
//
// // add an event to calendar

//
//
//
// function displayErrorParsing(){
//   // give input red border and do a pop up style animation
//   $("#coursesInput").css("border", "1px solid red").css("border-top","none").addClass("shakeAnimation");
//   // remove the class after 0.4s when the animation is over
//   setTimeout(function(){ $("#coursesInput").removeClass("shakeAnimation");}, 400);
// }
//

//
// /**
//  * On paste in the box
//  */
// $('#coursesInput').on('paste', function () {
//   $(this).css("font-size", "12px");
//   setTimeout(function () {
//     $("#calendar").fullCalendar('removeEvents');
//     var coursesInput = $("#coursesInput").val();
//     addCalendarData(coursesInput);
//     $("#coursesInput").blur().val("").css("font-size","18px");
//   }, 300);
// });
//
// /**
//  * Key and Click events
//  */
// $(window).keydown(function(evt) {
//   if (evt.which == 73) { // 'i'
//     $("#instructions").show();
//   }
// }).keyup(function(evt) {
//   if (evt.which == 73) { // 'i'
//     $("#instructions").hide();
//   }
// });
//
// $(window).keydown(function(evt) {
//   if (evt.which == 72) { // 'h'
//     $("#notesWrapper").show();
//   }
// });
//
// $("#left.instr").click(function(){
//   var win = window.open("assets/images/instructions.jpg", '_blank');
//   win.focus();
// });
//
// $("#right.instr").click(function(){
//   html2canvas(document.getElementById("calendar"), {
//     onrendered: function(canvas) {
//       var myImage = canvas.toDataURL("image/png"); // maybe octet stream for downloading it straight
//       window.open(myImage);
//     }
//   });
// });
//
// if(Tools.isMobile()){
//   $("#left.instr span").text("Click");
//   $("#right.instr span").text("Click");
// }
//
// // take screenshot
// $(window).keydown(function(evt) {
//   if (evt.which == 74) {} // j
// }).keyup(function(evt) {
//   if (evt.which == 74) { // 'j'
//     html2canvas(document.getElementById("calendar"), {
//       onrendered: function(canvas) {
//         var myImage = canvas.toDataURL("image/png"); // maybe octet stream for downloading it straight
//         window.open(myImage);
//       }
//     });
//   }
// });


// $(window).resize(function(){
//   var cal_height = window.innerHeight - 500;
//   $('#calendar').fullCalendar('option', 'height', cal_height);
// });
