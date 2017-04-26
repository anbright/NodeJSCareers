var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
    if (!req.session.user) {
        res.redirect('/login')
    }

    res.render('map');

});




router.post('/', function(req, res, next) {
    var oracledb = require('oracledb');

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
                "SELECT * FROM Students",
                function(err, result) {
                    // If an error happens during the SQL execution, print the error message and return (exit the program)
                    if (err) {
                        console.error(err.message);
                        return;
                    }
                    // Print the results into the console
                    console.log(result.rows);
                });
        });


    res.send('respond with a aws');
});

module.exports = router;