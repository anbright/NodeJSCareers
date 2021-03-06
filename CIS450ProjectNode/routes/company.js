var express = require('express');
var router = express.Router();
var oracledb = require('oracledb');


router.get('/', function(req, res, next) {
    if (!req.session.user) {
        res.redirect('/login')
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
                "SELECT DISTINCT INDUSTRY FROM COMPANY ORDER BY INDUSTRY ASC",
                function(err, result) {
                    // If an error happens during the SQL execution, print the error message and return (exit the program)
                    if (err) {
                        console.error(err.message);
                        return;
                    }
                    res.render('company', {myJson: [], industries: result.rows});
                });
        });



});




router.post('/', function(req, res, next) {
    industry = req.body["industry"];
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
                "SELECT * FROM COMPANY WHERE INDUSTRY ='" + industry + "'",
                function(err, result) {
                    // If an error happens during the SQL execution, print the error message and return (exit the program)
                    if (err) {
                        console.error(err.message);
                        return;
                    }
                    myJson = []
                    for (i = 0; i < result.rows.length; i++) {
                        temp = {"name" : result.rows[i][1], "lat" : result.rows[i][5], "lon" : result.rows[i][6]}
                        myJson.push(temp);
                    }
                    // Print the results into the console
                    res.send(result.rows);
                });
        });

});

module.exports = router;
