//TASK-1
var mysql = require("mysql");
var Promise = require("bluebird");
var sq = require("./sqlQueries");

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "webstore"
});

function editProductInfo(pId, field, value) {

    if (!parseInt(value)) value = "\"" + value + "\""
    //console.log(value);
    sq.updateProductInfo(con, pId, field, value).then(function (data) {

        console.log('product ' + pId + ' ' + field + ' set to ' + value + ' in DB');
        con.end();
    }).catch(function (e) {
        console.log("ERROR:", e);
        con.end();
    });
}
if (process.argv.length == 5) {
    editProductInfo(process.argv[2], process.argv[3], process.argv[4]);
}
else {
    console.log("Usage: node editProductInfo.js <ProductId> <field> <value>");
}
