(function(){
  var $moodGrid = $("#moodGrid");
  var $moodItems = $moodGrid.find('a');
  var $dayMood = $("input[name=dayMood]");
  var activeMoodDay;
  var moodCalendarUrlHash = window.location.hash;
  var userPrefersHash = false;
  console.log(moodCalendarUrlHash);
  if (moodCalendarUrlHash) {
    userPrefersHash = true;
  }
  
  function getUrlHash() {
    return window.location.hash.split("/")[1];
  }

  function getTodayDayNumber() {
    var now = new Date();
    var start = new Date(now.getFullYear(), 0, 0);
    var diff = now - start;
    var oneDay = 1000 * 60 * 60 * 24;
    var day = Math.floor(diff / oneDay);
    return day;
  }

  function selectTodayMood() {
    var day = getTodayDayNumber();
    activeMoodDay = $moodItems.get(day - 1);
    $(activeMoodDay).addClass("active");
    setActiveDayMoodRadio();
  }

  function setActiveDayMoodRadio() {
    var value = $(activeMoodDay).attr("data-mood");
    $("input[name=dayMood][value=" + value + "]").prop('checked', true);
    $dayMood.trigger('change');
  }
  
  function setMoods(arrayOfMoods) {
    var day = $moodGrid.find('a');
    day.each(function(i) {
      $(this).attr("data-mood", arrayOfMoods[i]) 
    });
  }

  function getMoodCalendarString() {
    return $moodGrid.find('a').map(function() { return $(this).attr("data-mood") }).get().join('');
  }
  
  function updateMoodCalendar() {
    var moods = getMoodCalendarString();
    if (userPrefersHash) {
      window.location.hash = "/" + moods;
    } else {
      localStorage.removeItem('moodCalendar');
      localStorage.setItem('moodCalendar', moods);
    }
  }

  function loadMoodCalendar(moodCalendar) {
    var moodArr;
    if (moodCalendar) {
      moodArr = moodCalendar;
    } else if (userPrefersHash) {
      moodArr = getUrlHash();
    } else {
      moodArr = localStorage.getItem('moodCalendar')
    }
    if (moodArr) {
      setMoods(moodArr.split(''));
    }
  }
  
  function createPixelsForHeader() {
    var pixelsWidth = $("#pixels").width();
    var pixelsHeight = $("#pixels").height();

    for (var i = 0; i < 25; i++) {
      var pixelClass = "mood-" + Math.floor(Math.random()*(5-1+1)+1);;

      jQuery('<div/>', {
        class: pixelClass,
        css: {
          top: Math.floor(Math.random() * (pixelsHeight - 20)),
          left: Math.floor(Math.random() * (pixelsWidth - 20 )),
        }

      }).appendTo('#pixels');
    }
  }
  
  function setQuoteOfTheDay() {
    $.ajax({
      url : "https://quotes.rest/qod",
      dataType: "json",
      type: "GET",
      success: function(data) {
        var content = data["contents"]["quotes"][0];
        var quote = content["quote"];
        var author = content["author"];
        $("#quoteOfTheDay").html("<p>\""+quote+"\"</p><p class='author'>—"+author+"</p>");
      }
    });
  }
  
  function getMonthMoodAvgArr() {
    var moods = $moodGrid.find('.item.month').map(function() {
      return $(this).find("a")
    });
    var results = [];
    moods.each(function() {
      var result = $(this).map(function() {
        var value = $(this).attr("data-mood");
        if (value !== "0") {
          return parseInt(value, 10);
        }
      }).get();
      var sum = 0;
      for (var i = 0; i < result.length; i++) {
        if (result[i]) {
          sum += result[i]
        } else {
          sum += 0;
        }
      }
      if (sum != 0) {
        var avg = sum/result.length;
      } else {
        var avg = 0;
      }
      results.push(avg);
    });
    return results;
  }
  
  function createAvgChart() {
    var data = {
      labels: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
      series: [getMonthMoodAvgArr()]
    };
    var options = {
      axisY: {
        onlyInteger: true,
        labelInterpolationFnc: function(value, index) {
          return moodOptions[index];
        },
        stretch: true,
        offset: 50
      },
      axisX: {
        offset: 20
      },
      high: 6,
      low: 0,
      showArea: true,
      showLine: true,
      showPoint: false,
      fullWidth: true,
      chartPadding: {
        top: 0,
        right: 10
      }
    };
    new Chartist.Line('.ct-chart', data, options);
  }

  $moodItems.on("click", function(e) {
    e.preventDefault();
    $moodItems.removeClass("active");
    $(this).addClass("active");
    activeMoodDay = this;
    setActiveDayMoodRadio();
  });

  $dayMood.on("change", function(e) {
    e.preventDefault();
    var moodValue = $('input[name=dayMood]:checked').val();
    $(activeMoodDay).attr("data-mood", moodValue);
    updateMoodCalendar();
    createAvgChart();
    if (moodOptions[moodValue] != 'none') {
      var message = "Your day was <u>" + moodOptions[moodValue] + "</u>."
      $("#message").html(message);
    } else {
      var message = "You have not set a mood today."
      $("#message").html(message);
    }
  });
  
  $("#footer a").on("click", function(e) {
    e.preventDefault();
    var action = $(this).attr('data-menu');
    execMenuItem(action);
  });
  
  $(".dialog .close").on("click", function(e) {
    e.preventDefault();
    $("#importMoodText").val('');
    $(this).parent('.dialog').fadeOut('fast');
  });
  
  $("#importMoodBtn").on("click", function(e) {
    e.preventDefault();
    var moodCalendar = $("#importMoodText").val();
    if (moodCalendar.length == 365) {
      var dialog = confirm("Careful, this will clear all the current data. Are you sure?");
      if (dialog) {
        loadMoodCalendar(moodCalendar);
        updateMoodCalendar();
        createAvgChart();
        $dayMood.trigger('change');
        $("#importMoodText").val('');
        $("#importDialog").fadeOut('fast', function() {
          alert('The import was successful!');
        });
      }
    } else {
      alert("We're sorry.\nThe data is not valid. Please try again.");
    }
  });
  
  var menu = {
    showImportDialog: function() {
      $("#importDialog").fadeIn('fast');
    },
    showExportDialog: function() {
      $("#exportDialog").fadeIn('fast');
      $("#exportMoodText").val(getMoodCalendarString());
    },
    fillDemoData: function() {
      var moodArr = Array.apply(null, Array(365)).map(function() {
        return Math.floor(Math.random()*5+1);
      });
      loadMoodCalendar(moodArr.join(''));
      updateMoodCalendar();
      createAvgChart();
      setActiveDayMoodRadio();
    },
    clearAllData: function() {
      var moodArr = Array.apply(null, Array(365)).map(Number.prototype.valueOf,0);
      loadMoodCalendar(moodArr.join(''));
      updateMoodCalendar();
      createAvgChart();
      setActiveDayMoodRadio();
    },
    howAboutDialog: function() {
      $("#aboutDialog").fadeIn('fast');
    },
  }
  
  function execMenuItem(action) {
    $(".dialog").fadeOut('fast');
    switch(action) {
    case "import":
      menu.showImportDialog();
      break;
    case "export":
      menu.showExportDialog();
      break;
    case "demo":
      var dialog = confirm("Careful, this will clear all the current data. Are you sure?");
      if (dialog) {
        menu.fillDemoData();
      }
      break;
    case "clear":
      var dialog = confirm("Careful, this will clear all the current data. Are you sure?");
      if (dialog) {
        menu.clearAllData();
      }
      break;
    case "about":
      menu.howAboutDialog();
      break;
    }
  }

  loadMoodCalendar();
  selectTodayMood();
  createPixelsForHeader();
  setQuoteOfTheDay();
  createAvgChart();
})();