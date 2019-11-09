/**
 * Parser module
 */
var Parser = (function () {

  // status codes of courses after enrollment
  const _AFTER_CLASS_STATUS_CODES = ["Enrolled", "Dropped", "Wait Listed"]

  const _AFTER_CLASS_CODES_MAPPING = {
    "Enrolled": "Open",
    "Dropped": "Closed",
    "Wait Listed": "Wait List",
  }

  // different class statuses
  const CLASS_STATUS_CODES = {
    "Open": "#16d016",
    "Closed": "red",
    "Wait List": "#ffcb00",
  }

  // classroom codes matching the campus
  const CLASS_CAMPUS = {
    "BUR": ["AQ", "AAB", "ASB", "BLU", "BEE", "CCC", "DAC", "DH", "DIS1", "DIS2", "EDB", "FM", "GH", "HC", "LDC", "MBC", "RCB", "RBC", "SWH", "SCB", "SCC", "SCK", "SCP", "SECB", "SSB", "SRA", "SH", "SHA", "T3", "TASC 1", "TASC 2", "TC", "TH", "LIB", "WMC", "WTB", "C900", "B9", "P9", "K9"],
    "SUR":  ["SUR", "SRY", "SRYE"],
    "HBC": ["HCC"],
  }

  // campus colors
  const CAMPUS_COLORS = {
    "BUR" : "rgb(130, 215, 134)",
    "SUR" : "rgb(255, 158, 158)",
    "HBC" : "rgb(109, 183, 255)",
  }

  var _parseCourseCart = function (data) {

    // return value
    var classes = []

    // clean input data
    var trimmedData = Tools.trimArray(data)

    // split data into seperate classes by creating array chunks
    var classesArr = []
    var tmp_last_data_split_index = 0
    for (i = 0; i < trimmedData.length; i++) {
      if (CLASS_STATUS_CODES.hasOwnProperty(trimmedData[i])) {

        var next = i+1;

        classesArr.push(trimmedData.slice(tmp_last_data_split_index, next))
        tmp_last_data_split_index = next
      }
    }

    // remove class status codes, and `Delete` string
    classesArr.forEach(function (thisClass, index) {

      var class_status = '';

      // remove 'Delete' button from array
      if (thisClass.indexOf("Delete") > -1) {
        thisClass.splice(thisClass.indexOf("Delete"), 1)
      }

      // remove class status
      for (i = 0; i < thisClass.length; i++) {
        if (CLASS_STATUS_CODES.hasOwnProperty(thisClass[i])) {
          class_status = thisClass.splice(i, 1)
        }
      }

      // `class` model
      classes.push({
        'class_name': thisClass[0],
        'class_id': thisClass[1],
        'class_time': _parseTime(thisClass[2]),
        'class_room': thisClass[3],
        'class_instructor': thisClass[4],
        'class_units': thisClass[5],
        'class_status': class_status,
      })

    });

    return classes;
  }

  /**
   * Returns an array[] of dictionaries containing the class times
   */
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

  /**
   * returns the parsed data
   */
  var parse = function (rawdata) {
    var splitByLine = rawdata.split("\n")

    // header checks to decide how data will be parsed,
    // when getting data from multiple places

    /** Next term schedule table
     * - Doesn't containt the delete button
     * - Class status is either [ Enrolled, Dropped, Wait Listed ]
     */
    if (Tools.isSubset(splitByLine, _AFTER_CLASS_STATUS_CODES)) {
      // clean up data
      var indicies_to_remove = []
      for (i = 0; i < splitByLine.length; i+=8)
        indicies_to_remove.push(i + 2);

      for (i = indicies_to_remove.length - 1; i >= 0; i--)
        splitByLine.splice(indicies_to_remove[i],1);

      // replace enrollment statuses with pre-enrollment statuses
      for (i=0; i<splitByLine.length; i++) {
        if (~_AFTER_CLASS_STATUS_CODES.indexOf(splitByLine[i]))
          splitByLine[i] = _AFTER_CLASS_CODES_MAPPING[splitByLine[i]]
      }
    }

    return _parseCourseCart(splitByLine)
  }

  return {
    parse: parse,
    CLASS_STATUS_CODES: CLASS_STATUS_CODES,
    CLASS_CAMPUS: CLASS_CAMPUS,
    CAMPUS_COLORS : CAMPUS_COLORS,
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

  /**
   * Checks if a given string is blank, undefined or empty
   */
  var isBlank = function (str) {
    return (!str || /^\s*$/.test(str));
  }


  /**
   * Returns `true` if `str` is a subset of `inString`
   */
  var strContains = function (str, inString) {
    return ~inString.indexOf(str);
  }



  /**
   * - Trims an array removing any empty / blank elements from it
   */
  var trimArray = function (arr) {
    var trimmedData = []
    for (i = 0; i < arr.length; i++) {
      if (!isBlank(arr[i])) {
        trimmedData.push(arr[i].trim())
      }
    }
    return trimmedData
  }


  /**
   * - Trims a string, removing any whitespaces from it
   */
  var trimString = function (str) {
    return str.replace(/\s+/g, '');
  }



  /**
   * Returns the 24hr time with style `formatStyle`
   */
  var formatTime = function (timeString, formatStyle) {
    // if it contains AM/PM, keep that formatting
    if(strContains("m", timeString.toLowerCase())){
      return moment(timeString, "HH:mmA").format(formatStyle);
    } else{
      return moment(timeString, "HH:mm").format(formatStyle);
    }
  }



  /**
   * Given a week day name, ex. "Tu", it returns the full calendar date
   * for that day from `Tools.WEEK_DAYS`
   */
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



  /**
   * Returns true if device `userAgent` is of mobile
   */
  var isMobile = function () {
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) )
      return true;
    return false;
  }

  /**
   * Returns true if an element from setA is in setB
   */
  var isSubset = function (setA, setB) {
    for (i = 0; i < setA.length; i++) {
      for (j=0; j < setB.length; j++) {
        if (setA[i] == setB[j]) {
          return true
        }
      }
    }

    return false
  }


  /**
   * Return functions that will be publicly accessible
   */
  return {
    trimArray: trimArray,
    strContains: strContains,
    formatTime: formatTime,
    mapWeekDayToCalDate: mapWeekDayToCalDate,
    isMobile: isMobile,
    isBlank: isBlank,
    trimString: trimString,
    isSubset: isSubset,
    WEEK_DAYS: WEEK_DAYS,
  };

})();
