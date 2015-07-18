var Parser = (function () {

  // different class statuses
  const CLASS_STATUS_CODES = ["Open", "Closed", "Wait List"];

  var _parseCourseCart = function (data) {

    // return value
    var classes = []

    // clean input data
    var trimmedData = Tools.trimArray(data)

    // split data into seperate classes
    var classesArr = []
    var tmp_last_data_split_index = 0
    for (i = 0; i < trimmedData.length; i++) {
      if (CLASS_STATUS_CODES.indexOf(trimmedData[i]) > -1) {
        classesArr.push(trimmedData.slice(tmp_last_data_split_index, i))
        tmp_last_data_split_index = i
      }
    }

    // remove class status codes, and `Delete` string
    classesArr.forEach(function (thisClass, index) {
      for (i = 0; i < thisClass.length; i++) {
        if (CLASS_STATUS_CODES.indexOf(thisClass[i]) > -1)
          thisClass.splice(i, 1)

        if (thisClass[i].indexOf("Delete") > -1)
          thisClass.splice(i, 1)
      }

      classes.push({
        'class_name': thisClass[0],
        'class_id': thisClass[1],
        'class_time': _parseTime(thisClass[2]),
        'class_room': thisClass[3],
        'class_instructor': thisClass[4],
        'class_units': thisClass[5]
      })

    });

    return classes;
  }

  var _parseTime = function (timeString) {

    var parsedTime = [];

    if (Tools.strContains("and", timeString)) {

      var timesSplit = timeString.split("and");

      for(j = 0; j < timesSplit.length; j++){
        var timeSplit = timesSplit[j].split(" ");
        // remove empty items in arr w/ `filter`
        parsedTime.push(timeSplit.filter(Boolean));
      }
    } else {
      parsedTime.push(timeString.split(" "));
    }


    var classTimes = [];
    parsedTime.forEach(function (time, i) {

      // this is a special case where the `time` array is length size 4,
      // and in that case we just remove the `Days` string element
      if (time[0].indexOf("Days") > -1) {
        time.splice(0, 1)
        // we don't know the time for this class, so we'll put it up top,
        // with length of 1 hour
        time[1] = "0:00AM"
        time[3] = "1:00AM"
      }

      classTimes.push({
        'weekDays': time[0],
        'startTime': Tools.formatTime(time[1], "HH:mm:ss"),
        'endTime': Tools.formatTime(time[3], "HH:mm:ss"),
      })
    });

    return classTimes
  }

  var parse = function (rawdata) {
    var splitByLine = rawdata.split("\n")

    // TODO: header checks to decide how data will be parsed,
    // when getting data from multiple places

    return _parseCourseCart(splitByLine)
  }

  return {
    parse: parse,
  };

})();


/**
 * Tools module
 * - contains helper functions use throughout the code
 */
var Tools = (function () {

  const WEEK_DAYS = {
    "M": "2014-11-17",
    "Tu": "2014-11-18",
    "W": "2014-11-19",
    "Th": "2014-11-20",
    "F": "2014-11-21",
  }

  var _isBlank = function (str) {
    return (!str || /^\s*$/.test(str));
  }

  var strContains = function (str, inString) {
    return !(inString.indexOf(str) ==-1);
  }

  var trimArray = function (arr) {
    var trimmedData = []
    for (i = 0; i < arr.length; i++) {
      if (!_isBlank(arr[i])) {
        trimmedData.push(arr[i].trim())
      }
    }
    return trimmedData
  }

  var formatTime = function (timeString, formatStyle) {
    // if it contains AM/PM, keep that formatting
    if(strContains("m", timeString.toLowerCase())){
      return moment(timeString, "HH:mmA").format(formatStyle);
    } else{
      return moment(timeString, "HH:mm").format(formatStyle);
    }
  }

  var mapWeekDayToCalDate = function (dayNameStr) {

    // special case
    if (dayNameStr == "TBA") {
      var arr = [Tools.WEEK_DAYS["M"]
                , Tools.WEEK_DAYS["Tu"]
                , Tools.WEEK_DAYS["W"]
                , Tools.WEEK_DAYS["Th"]
                , Tools.WEEK_DAYS["F"]]
      return arr
    }

    var returnDate = [];
    if(Tools.strContains("Tu", dayNameStr) || Tools.strContains("Th", dayNameStr)){

      if(dayNameStr.toLowerCase() == "TuTh".toLowerCase()){ // just in case
        returnDate.push(Tools.WEEK_DAYS[dayNameStr.slice(0,2)]);
        returnDate.push(Tools.WEEK_DAYS[dayNameStr.slice(2,4)]);
      } else{
        returnDate.push(Tools.WEEK_DAYS[dayNameStr]);
      }
    } else{
      var splitDays = dayNameStr.split("");
      for (i = 0; i < splitDays.length; i++)
        returnDate.push(Tools.WEEK_DAYS[splitDays[i]]);
    }

    return returnDate;
  }

  var isMobile = function () {
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) )
      return true;
    return false;
  }

  return {
    trimArray: trimArray,
    strContains: strContains,
    formatTime: formatTime,
    mapWeekDayToCalDate: mapWeekDayToCalDate,
    isMobile: isMobile,
    WEEK_DAYS: WEEK_DAYS,
  };

})();
