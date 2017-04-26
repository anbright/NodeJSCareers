var express = require('express');
var router = express.Router();
var oracledb = require('oracledb');


router.get('/explore', function(req, res, next) {
  res.render('explore', { title: 'explore' });
});

router.post('/explore', function(req, res, next) {
  var company = req.body.company;
  var industry = req.body.industry;
  var csvString = "";
  var query = "";
  if (req.body.num == 0) {
  	query = "SELECT industry FROM students";
  }
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
        "SELECT * FROM students WHERE company = 'Google'", 
          function(err, result)
          {
            // If an error happens during the SQL execution, print the error message and return (exit the program)
            var count = 0;
            if (err) {
              console.error(err.message);
              return;
            }
            csvString += "sid,school,year,gender\n";
            for (var i = 0; i < result.rows.length; i++) {
              var row = result.rows[i];
              for (var j = 0; j < row.length - 1; j++) {
                  csvString += row[j];
                  csvString += ",";
              }
              csvString += row[row.length - 1];
              csvString += "\n";
              count++;
            }
            console.log(count);
            console.log(result.rows.length);
            if (count == result.rows.length) {
            	res.send(csvString);
            }
          });
      
      });
	
	
});
          

module.exports = router;
