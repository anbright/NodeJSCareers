var express = require('express');
var router = express.Router();
var oracledb = require('oracledb')

/* GET profile page. */
router.get('/', function(req, res, next) {
  if (!req.session.user) {
  	res.redirect('/login');
  }
  const user_email = req.session.user.local.email

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
        "SELECT * FROM STUDENTS WHERE email='" + user_email + "'",
        function(err, result)
        {
          // If an error happens during the SQL execution, print the error message and return (exit the program)
          if (err) {
            console.error(err.message);
            return;
          }
          // Print the results into the console
          if (result.rows.length > 0) {
            const user = result.rows[0]
            console.log(result.rows[0])
            res.render('profile', {
              user: {
                sid: user[0],
                school: user[1],
                year: user[2],
                gender: user[3],
                email: user[4],
                company: user[5],
                industry: user[6]
              }
            });
          } else {
            res.send('Error: No user in Students table with that email')
          }
        });
    });

});

router.get('/edit', function(req, res, next) {
  if (!req.session.user) {
    res.redirect('/login')
  }
  console.log(req.session.user.local.email)

  res.render('edit_profile', { user: req.session.user.local.email });
});

//gets info from session and loads from sql db
function getUserInfo(user_email) {

}

module.exports = router;
