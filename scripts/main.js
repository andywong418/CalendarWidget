
var Calendar = function() {
    var wrap, label, months=["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    function init(newWrap) {
      wrap = $("#cal");
      console.log("wrap", wrap);
      label = wrap.find("#label");
      wrap.find('#prev').on('click', function() {
        switchMonth(false);
      });
      wrap.find('#next').on('click', function(){
        switchMonth(true);
      });

      label.on('click', function() {
          switchMonth(null, new Date().getMonth(), new Date().getFullYear())
      });
    }

    function switchMonth(next, month, year) {
      var curr = label.text().trim().split(" ");
      var tempYear = parseInt(curr[1], 10);
      console.log("curr 0", curr, month, year)
      if(!month && month !== 0) {
        month = ((next) ? ((curr[0] === 'December') ? 0 : months.indexOf(curr[0]) + 1) : ((curr[0] === 'January') ? 11 : months.indexOf(curr[0]) - 1));
      }
      if(!year) {
        year = ((next && month === 0) ? tempYear + 1 : (!next && month === 11) ? tempYear - 1 : tempYear);
      }
      console.log("month?", month);

      var calendar = createCal(year, month);
      $("#cal-frame", wrap).find('.curr')
        .removeClass('curr')
        .addClass('temp')
        .end()
        .prepend(calendar.calendar())
        .find('.temp')
        .fadeOut("slow", function(){$(this).remove();});
      label.text(calendar.label);

    }

    function createCal(year, month) {
      console.log("YEAR", "month", year, month, createCal.cache);
      var day = 1;
      var i = 0; //week of the month
      var j = 0;//day of th emonth
      var haveDays = true;
      var startDay = new Date(year, month, day).getDay(); //Day of the week that the month begins.
      var daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      var calendar = [];
      if(createCal.cache[year]) {
        if(createCal.cache[year][month]){
          return createCal.cache[year][month];
        }
      } else {
        createCal.cache[year] = {};
      }
      while(haveDays) {
        calendar[i] = [];
        for(var j = 0; j < 7; j++) {
          if(i === 0) {
            //Are we in the first week of the month
            if(j===startDay + 1) {
              //Currently on the day of the week that the month starts
              calendar[i][j] = day++;
              startDay++;
            } else {
              calendar[i][j] = "";
            }

          } else if(day <= daysInMonth[month]) {
            calendar[i][j] = day++;
          } else {
            calendar[i][j] = "";
            haveDays = false;
          }
        }
        i++;
      }
      console.log("BEFORE", calendar);
      for(var count = 0; count < calendar.length; count++) {
        var htmlString = "<tr>"
        var currentDay = new Date().getDate();
        var currentMonth = new Date().getMonth();
        var currentYear = new Date().getFullYear();
        for(var inner = 0; inner < calendar[count].length; inner++) {
          if(currentDay===calendar[count][inner] && currentMonth===month && year===currentYear) {
            htmlString = htmlString + "<td class='today'>" + calendar[count][inner] + "</td>";
          } else {
            htmlString = htmlString + "<td>" + calendar[count][inner] + "</td>";
          }

        }
        calendar[count] = htmlString + '</tr>';
      }
      calendar = $('<table class="curr"> <tbody>' + calendar.join("") + '</tbody> </table>');
      // console.log(calendar.join());
      console.log("calendar", calendar);
      createCal.cache[year][month] = {calendar: function() {return calendar.clone();}, label: months[month] + " " + year}
      return createCal.cache[year][month];
    }
    createCal.cache = {};
    return {
      init: init,
      switchMonth: switchMonth,
      createCal: createCal
    }
  }
