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

function addNewProduct(name, amount, price) {

    var product = { ItemName: name, Amount: parseInt(amount), Price: parseFloat(price) };
    sq.addNewProduct(con, product).then(function (data) {
        console.log(amount + ' products ' + name + ' price ' + price + ' added into DB');
        con.end();
    }).catch(function (e) {
        console.log("ERROR:", e);
        con.end();
    });
}

if (process.argv.length == 5) {
    addNewProduct(process.argv[2], process.argv[3], process.argv[4]);
} else {
    console.log("Even better usage: node addNewProduct.js <ItemName> <Amount> <Price>")
}

