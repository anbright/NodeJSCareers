var express = require('express');
var router = express.Router();
var oracledb = require('oracledb');


router.get('/careers', function(req, res, next) {
  res.render('careers', { title: 'alumni' });
});

router.post('/careers', function(req, res, next) {

  console.log(req.body.Company);
  var company = req.body.Company;
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
        "SELECT * FROM Alumni WHERE company='" + company + "'",
        function(err, result)
        {
          // If an error happens during the SQL execution, print the error message and return (exit the program)
          if (err) {
            console.error(err.message);
            return;
          }
          // Print the results into the console
          res.send(result.rows);
        });
    });

});

module.exports = router;
