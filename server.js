var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('client-sessions');

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/templates'));
app.use(session({
  cookieName: 'session',
  secret: 'budtoblossomencryptionstring',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
}));

var anyDB = require('any-db');
var conn = anyDB.createConnection('sqlite3://users.db');

var engines = require('consolidate');
app.engine('html', engines.hogan);
app.set('views', __dirname + '/templates');
app.set('view engine', 'html');

conn.query('CREATE TABLE IF NOT EXISTS users (uname STRING PRIMARY KEY, pword TEXT)',
function (error, data) {
  if (error) throw error;
});
// this should be foreign key -- figure out syntax
conn.query('CREATE TABLE IF NOT EXISTS emotions (uname STRING,'
  + 'q1 TEXT, q2 TEXT, q3 TEXT, q4 TEXT, feelings TEXT, positive INTEGER, date STRING)',
  function (error, data) {
    if (error) throw error;
  });

function addUser(req, res) {
  var sql = "INSERT INTO users VALUES($1, $2)";
  var uname = req.query.uname;
  var pword = req.query.pword;
  conn.query(sql, [uname, pword],
    function (error, data) {
      if (error) {
        res.send("invalid username");
      } else {
        req.session.user = uname;
        res.send("valid");
      }
    });
}

// app.get("/calendar/30days", function(request, response) { //fix address
//   var sql = "SELECT (feelings, positive, date) FROM users WHERE uname = $1 AND SUBSTRING(date, 5, 7) = $2";
//   var uname = request.query.uname;
//   var date = request.query.month;
//   var month = date.substring(5, 7);
//   conn.query(sql, [uname, month], function(error, data) {
//     emotionCounts = {};
//     dayValues = {};
//     for (i = 0; i < data.length; i++) {
//       var emotions = data[i].feelings.split(" ");
//       var value = data[i].positive;
//       var date = data[i].date;
//       emotionValues[date] = value;
//       for (j = 0; j < emotions.length; j++) {
//         if (dictionary.get(emotions[j]) == None) {
//           emotionCounts[emotions[j]] = 1;
//         } else {
//           emotionCounts[emotions[j]] +=1;
//         }
//       }
//     }
//     response.send([emotionCounts, emotionvalues]);
//   });
// });

function validLogin(req, res) {
  var sql = "SELECT * FROM users where uname = $1";
  var uname = req.query.uname;
  var pword = req.query.pword;
  conn.query(sql, [uname], function(err, data) {
    if(err) {
      res.send("error");
      return;
    }

    if(data.rowCount == 0) {
      res.send("invalid username");
    } else {
      if(data.rows[0].pword == pword) {
        req.session.user = uname;
        res.send("valid");
      } else {
        res.send("invalid password");
      }
    }
  });
}

function negMood(emotions) {
  return (emotions.includes("sad") || emotions.includes("angry") ||
  emotions.includes("annoyed") || emotions.includes("fearful") ||
  emotions.includes("hurt") || emotions.includes("nervous") ||
  emotions.includes("lonely") || emotions.includes("worried"));
}

app.get("/", function(request, response) {
  response.render("home.html", {});
});

app.get("/landing", function(request, response) {
  if (typeof request.session.user !== 'undefined') {
    response.render("landing.html", {name:request.session.user, message: "welcome back!"});
  } else {
    response.redirect("/");
  }
});

app.get("/signup", function(request, response) {
  response.render("signup.html", {});
});

app.get("/tracker", function(request, response) {
  if (typeof request.session.user !== 'undefined') {
    response.render("tracker.html", {});
  } else {
    response.redirect("/");
  }
});

app.get("/log", function(request, response) {
  var moods = request.session.moods;
  if (typeof moods !== 'undefined') {
    var moodmap = moods.map(function(el) {
      return {emo: el};
    });
    if(negMood(moods)) {
      response.render("diary.html", {moods: moodmap});
    } else {
      response.render("pdiary.html", {moods: moodmap});
    }
  } else {
    response.redirect("/");
  }
});

app.get("/jungle", function(request, response) {
  if (typeof request.session.user !== 'undefined') {
    response.render("jungle.html", {});
  } else {
    response.redirect("/");
  }
});

app.get("/calendar", function(request, response) {
  if (typeof request.session.user !== 'undefined') {
    response.render("calendar.html", {});
  } else {
    response.redirect("/");
  }
});

app.get("/logout", function(req, res) {
  req.session.reset();
  res.redirect('/');
});

app.get("/validate/login", function(request, response) {
  validLogin(request, response);
});

app.get("/validate/signup", function(request, response) {
  addUser(request, response);
});

app.get("/validate/addmoods", function(request, response) {
  request.session.moods = request.query.moods;
  var emotions = request.session.moods;
  var sql = 'INSERT INTO emotions (uname, feelings, positive, date) VALUES ($1, $2, $3, $4)';
  var dateObject = new Date();
  var date = "" + dateObject.getFullYear() + dateObject.getMonth() + dateObject.getDate() + dateObject.getHours();
  var feelings = "";
  for (i = 0; i < emotions.length; i++) {
    feelings = feelings +  emotions[i] + " ";
  }
  conn.query(sql, [request.session.user, feelings, request.value, date]);
  response.send("hello");
});

app.listen(8080);
