/*
  ** Author: Collin James, CS 290
  ** Date: 5/18/16
  ** Description: Activity: How-to Guide, node server code
*/

/* set up express */
var express = require('express');
var app = express();

/* set up handlebars*/
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 3003);

/* set up body parser*/
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/* set up mysql */
// var mysql = require('./mysql.js'), // mysql object is set up in js file
//     pool = mysql.makepool();
var mysql = require('mysql');
var pool = mysql.createPool({
  host  : 'localhost',
  user  : 'student',
  password: 'default',
  database: 'student'
});
// console.log(pool);

/* serve js, css, images (sample html: /js/app.js will look in
  /public/js/... to find file */
app.use(express.static('public'));

/* handle reset page */
app.get('/reset-table',function(req,res,next){
  var context = {};
  pool.query("DROP TABLE IF EXISTS workouts", function(err){ //replace your connection pool with the your variable containing the connection pool
    if(err){
      next(err);
      return;
    }
    var createString = "CREATE TABLE workouts("+
    "id INT PRIMARY KEY AUTO_INCREMENT,"+
    "name VARCHAR(255) NOT NULL,"+
    "reps INT,"+
    "weight INT,"+
    "date DATE,"+
    "lbs BOOLEAN)";
    pool.query(createString, function(err){
      // if(err){
      //   next(err);
      //   return;
      // }
      context.results = "Table reset";
      console.log(context.results);
      // pool.query("INSERT INTO workouts (name) VALUES ('Collin James')", function (err, result) {
      //   if(err){
      //     next(err);
      //     return;
      //   }
      //   console.log(result);
      // });
      // res.render('home',context);
      res.send(context.results);
    });
  });
});

/* handle main pages */
app.get('/', function (req, res){
  res.type('html');
  var qry = req.query,
      thetopic = qry.topic,
      thetitle = (thetopic) ? capitalize(thetopic.replace(/_/g, ' ')) : null;
  if(thetitle)
    res.render(thetopic+'.handlebars', {title: thetitle, topic: thetopic});
  else
    res.render('introduction.handlebars', {title: "Introduction", topic: 'introduction'});
})

/* handle errors */
app.use(function(req,res){
  res.type('text/plain');
  res.status(404);
  res.send('404 - Not Found ya\'ll');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.send('500 - Server Error');
});

/* start the server */
app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to quit.');
});

/* return an object from a query string; pass a node request object */
function getQueryString (req) {
  // console.log(req.query);
  var list = {};

  for (var p in req.query)
    list.p = req.query[p];
  
  return list; // must use same array name (here dataList) in handlebars file
}

function capitalize(string) {
  return string.replace(/\b\w/g, function (ch) {
    return ch.toUpperCase();
  });
}