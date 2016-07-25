var mysql = require("mysql");
var Promise = require("bluebird");
var sq = require("./sqlQueries");

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "webstore"
});

var sequence = Promise.resolve();

function showAllBaskets() {
    var tableName = 'basket2';
    var rows;
    var totalSum = 0;

    sq.showTables(con).then(function (data) {
        rows = data;
    }).then(function () {
        for (var i = 0; i < rows.length; i++) {
            console.log(rows[i].Tables_in_webstore);
        }
        con.end();
    })
}

function showBasket(userId) {
    var tableName = 'basket' + userId;
    var rows;
    var totalSum=0;
    sq.checkBasket(con, tableName).then(function (data) {
        rows = data;
    }).then(function () {
        if (rows == "") {
            console.log("User has no shopping basket");
            con.end();
        }
        else {
            console.log("\nUser "+userId+" shopping basket");
            sq.getItemsInBasket(con, tableName).then(function (data) {
                for (n = 0; n < data.length; n++) {
                    console.log('Product:'+data[n].ProductId + " item:" + data[n].ItemName + " price:" + data[n].Price + "€  x" + data[n].Amount+" Total:"+(data[n].Price*data[n].Amount)+"€");
                    totalSum += data[n].Price*data[n].Amount;
                }
                console.log("Total Sum:"+totalSum+"\n")
                con.end();

            });

        }
    }).catch(function (e) {
        con.end();
        console.log("ERROR:", e);

    });
}

if (!process.argv[2]) {
    showAllBaskets();
}
else {
    showBasket(process.argv[2]);
}
