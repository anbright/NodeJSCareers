var express = require('express');
var router = express.Router();

/* GET profile page. */
router.get('/', function(req, res, next) {
  if ((req.session && req.session.user)) {
	  res.render('details');
  }
  else {
      res.redirect('/login');
  }


});

router.post('/', function(req, res, next) {
  if ((req.session == undefined || req.session.user == undefined)) {
  	res.redirect('/login');
  }


  email = "";
  if (req.session.user.local) {
  	email = req.session.user.local.email;
  } 
  else if (req.session.user.google) {
  	email = req.session.user.google.email;
  }
  else if (req.session.user.facebook) {
  	email = req.session.user.facebook.email;
  }


  console.log(req.body);
  console.log(email);


  var oracledb = require('oracledb');
  oracledb.getConnection(
  {
    // The connection details to my database
    user          : "cis450project",
    password      : "tahmidisabitch",
    connectString : "cis450project.creb8qtnnbvb.us-west-2.rds.amazonaws.com:1521/DBPROJ"
  },
  function(err, connection)
  {
    // If an error happens during establishing the connection, print the error message and return (exit the program)
    if (err) {
      console.error(err.message);
      return;
    }
    // Executing my SQL SELECT statement against the departments table
    connection.execute(
      "SELECT count(*) FROM Students",
      function(err, result)
      {
        // If an error happens during the SQL execution, print the error message and return (exit the program)
        if (err) {
          console.error(err.message);
          return;
        }
        // Print the results into the console
        console.log(result.rows);
        res.send('respond with a body');
      });
  });


});

module.exports = router;
