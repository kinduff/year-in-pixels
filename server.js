var express = require('express');
var app = express();

app.use(express.static('public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

function daysInMonth(month) {
  var year = (new Date()).getFullYear();
  return new Date(year, month, 0).getDate();
}

var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
var grid = {};
for (var i = 0; i < months.length; i++) {
  grid[months[i]] = daysInMonth(i+1);
}

var moodOptions = {
  5: 'amazing',
  4: 'great',
  3: 'average',
  2: 'difficult',
  1: 'tough',
  0: 'none'
};

app.get("/", function (req, res) {
  res.render('index', { grid: grid, moodOptions: moodOptions } );
});

var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
