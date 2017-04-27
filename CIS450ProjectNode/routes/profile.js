var express = require('express');
var router = express.Router();
var oracledb = require('oracledb')

var Twitter = require('twitter');

var client = new Twitter({
  consumer_key: 'p13t3YNd2my8InWieJb8YzPjh',
  consumer_secret: '0gsbfReV0stQ2mTeTiphltr4LCqPvQ2CeixVnsqG8EMzrgQdFy',
  access_token_key: '783011073490288640-wVEaFtvRWbdvAegyZYYMSFahpLQcGpm',
  access_token_secret: 'LjRirwZ0GEQcpmmmwrHS9SvRr7zJMtiGcQ9iJgH7ih56r'
});

router.post('/twitter', function(req, res, next) {
  var query = req.body.query
  var params = {q: query};
  client.get('search/tweets', params, function(error, tweets, response) {
    if (!error) {
      console.log(tweets);
      res.send(tweets)
    } else {
      return;
    }
  });
})

/* GET profile page. */
router.get('/', function(req, res, next) {
  console.log(req.session.user)
    if ((req.session == undefined || req.session.user == undefined)) {
        res.redirect('/login');
    }

    if (req.session.user.local) {
      var user_email = req.session.user.local.email
    } else if (req.session.user.facebook) {
      var user_email = req.session.user.facebook.email
    } else if (req.session.user.google) {
      var user_email = req.session.user.google.email
    }

    oracledb.getConnection({
            // The connection details to my database
            user: "cis450project",
            password: "tahmidisabitch",
            connectString: "cis450project.creb8qtnnbvb.us-west-2.rds.amazonaws.com:1521/DBPROJ"
        },
        function(err, connection) {
            // If an error happens during establishing the connection, print the error message and return (exit the program)
            if (err) {
                console.error(err.message);
                return;
            }
            // Executing my SQL SELECT statement against the departments table
            connection.execute(
                "SELECT * FROM STUDENTS WHERE email='" + user_email + "'",
                function(err, result) {
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
                        res.redirect('/details')
                    }
                });
        });

});

router.get('/edit', function(req, res, next) {
    if (!req.session.user) {
        res.redirect('/login')
    }
    console.log(req.session.user.local.email)

    res.render('edit_profile', {
        user: req.session.user.local.email
    });
});

//gets info from session and loads from sql db
function getUserInfo(user_email) {

}

module.exports = router;
