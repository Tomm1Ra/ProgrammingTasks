//TASK-2
var mysql = require("mysql");
var Promise = require("bluebird");
var sq = require("./sqlQueries");

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "webstore"
});

function removeBasket(userId) {
    var tableName = 'basket' + userId;
    var rows;
    var totalSum = 0;
    sq.checkBasket(con, tableName).then(function (data) {
        rows = data;
    }).then(function () {
        if (rows == "") {
            console.log("User " + userId + " has no shopping basket");
            con.end();
        }
        else {
            console.log("\nUser " + userId + " shopping basket");
            sq.getItemsInBasket(con, tableName).then(function (data) {
                for (n = 0; n < data.length; n++) {
                    console.log('Product:' + data[n].ProductId + " item:" + data[n].ItemName + " price:" + data[n].Price + "€  x" + data[n].Amount + " Total:" + (data[n].Price * data[n].Amount) + "€");
                    totalSum += data[n].Price * data[n].Amount;
                }
                console.log("Total Sum:" + totalSum + "\n")

            }).then(function () {
                sq.dropTable(con, tableName).then(function () {
                    console.log("\nUser " + userId + " shopping basket has removed\n");
                    con.end();
                })
            });

        }
    }).catch(function (e) {
        con.end();
        console.log("ERROR:", e);

    });
}
console.log("Usage: node removeBasket.js <UserId>");
removeBasket(process.argv[2]);

