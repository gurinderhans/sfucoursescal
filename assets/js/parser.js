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

    // console.log(classes);

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
      if (time[0].indexOf("Days") > -1)
        time.splice(0, 1)

      classTimes.push({
        'weekDays': time[0],
        'startTime': time[1],
        'endTime': time[3],
      })
    });

    return classTimes
  }

  var parse = function (rawdata) {
    var splitByLine = rawdata.split("\n")

    // TODO: header checks to decide how data will be parsed

    return _parseCourseCart(splitByLine)
  }

  return {
    parse: parse,
  };

})();

// TOOLS
var Tools = (function () {

  var _isBlank = function (str) {
    return (!str || /^\s*$/.test(str));
  }

  var strContains = function (st,inst) {
    return !(inst.indexOf(st) ==-1);
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

  return {
    trimArray: trimArray,
    strContains: strContains,
  };

})();
