var express = require('express');
var router = express.Router();
var oracledb = require('oracledb');


router.get('/alumni', function(req, res, next) {
    res.render('alumni', {
        title: 'alumni'
    });
});

router.post('/alumni', function(req, res, next) {

    console.log(req.body.company);
    var company = req.body.company;
    var industry = req.body.industry;
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
                "SELECT * FROM alumni AL WHERE AL.AID IN " +
                "( SELECT AID FROM companyemployed ce INNER JOIN company ON company.CID = ce.CID WHERE company.name ='" + company + "')",
                function(err, result) {
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