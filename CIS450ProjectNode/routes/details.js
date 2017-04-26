var express = require('express');
var router = express.Router();
var User = require('../models/user')
var oracledb = require('oracledb')


/* GET profile page. */
router.get('/', function(req, res, next) {
    if ((req.session && req.session.user)) {
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
                  "SELECT NAME FROM COMPANY ORDER BY NAME ASC",
                  function(err, result) {
                      // If an error happens during the SQL execution, print the error message and return (exit the program)
                      if (err) {
                          console.error(err.message);
                          return;
                      }
                      console.log(result.rows)
                      res.render('details', {companies: result.rows});
                  });
          });

    } else {
        res.redirect('/login');
    }


});

router.post('/', function(req, res, next) {
    if ((req.session == undefined || req.session.user == undefined)) {
        res.redirect('/login');
    }


    email = "";
    if (req.session.user.local) {
        type = "local"
        email = req.session.user.local.email;
    } else if (req.session.user.google) {
        type = "google"

        email = req.session.user.google.email;
    } else if (req.session.user.facebook) {
        type = "facebook"

        email = req.session.user.facebook.email;
    }



    year = req.body["year"];
    gender = req.body["gender"];
    industry = req.body["industry"];
    if (Array.isArray(req.body["school"])) {
        school = req.body["school"].join();
    } else {
        school = req.body["school"];
    }
    company = req.body["company"];
    insertStudent = "INSERT INTO STUDENTS (SCHOOL, YEAR, GENDER, EMAIL, COMPANY, INDUSTRY) VALUES ('" + school + "', '" + year + "', '" + gender + "', '" + email + "', '" + company + "', '" + industry + "')";
    insertIndus = "INSERT INTO STUDENTINDUSTRYINTEREST (IID, SID) VALUES ((SELECT IID FROM INDUSTRY WHERE NAME='" + industry + "'), (SELECT SID FROM STUDENTS WHERE EMAIL= '" + email + "'))";
    insertComp = "INSERT INTO STUDENTCOMPANYINTEREST (CID, SID) VALUES ((SELECT CID FROM COMPANY WHERE NAME='" + company + "'), (SELECT SID FROM STUDENTS WHERE EMAIL= '" + email + "'))";
    var oracledb = require('oracledb');
    oracledb.autoCommit = true;
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
                insertStudent,
                function(err, result) {
                    // If an error happens during the SQL execution, print the error message and return (exit the program)
                    if (err) {
                        console.error(err.message);
                        return;
                    } else {
                        console.log(result);
                        console.log(insertStudent);
                        console.log("STUDENTS DONE");
                        connection.execute(
                            insertIndus,
                            function(err, result) {
                                // If an error happens during the SQL execution, print the error message and return (exit the program)
                                if (err) {
                                    console.error(err.message);
                                    return;
                                } else {
                                    console.log("INDUSTRY DONE")
                                    connection.execute(
                                        insertComp,
                                        function(err, result) {
                                            // If an error happens during the SQL execution, print the error message and return (exit the program)
                                            if (err) {
                                                console.error(err.message);
                                                return;
                                            } else {
                                                console.log("COMPANY DONE")
                                                if (type == "local") {
                                                    User.findOneAndUpdate({
                                                        "local.email": email
                                                    }, {
                                                        "completed": true
                                                    }, function(err, user) {
                                                        if (err) {
                                                            return done(err)
                                                        }
                                                        console.log(user)
                                                            // Print the results into the console
                                                        console.log(result.rows);
                                                        console.log(type);

                                                        res.redirect('/profile');
                                                    })

                                                } else if (type == "facebook") {
                                                    User.findOneAndUpdate({
                                                        "facebook.email": email
                                                    }, {
                                                        "completed": true
                                                    }, function(err, user) {
                                                        if (err) {
                                                            return done(err)
                                                        }
                                                        console.log(user)
                                                            // Print the results into the console
                                                        console.log(result.rows);
                                                        console.log(type);

                                                        res.redirect('/profile');

                                                    })

                                                } else if (type == "google") {
                                                    User.findOneAndUpdate({
                                                        "google.email": email
                                                    }, {
                                                        "completed": true
                                                    }, function(err, user) {
                                                        if (err) {
                                                            return done(err)
                                                        }
                                                        console.log(user)
                                                            // Print the results into the console
                                                        console.log(result.rows);
                                                        console.log(type);

                                                        res.redirect('/profile');
                                                    })
                                                }

                                            }
                                        });

                                }
                            });

                    }
                });
        });


});

module.exports = router;
