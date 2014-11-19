$(document).ready(function(){
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
});
