//TASK-5
var mysql = require("mysql");
var Promise = require("bluebird");
var sq = require("./sqlQueries");

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "webstore"
});


function listProducts(name, order, minPrice, maxPrice, limit) {
    if (!name) name = "";
    if (!order) order = "id";
    if (!minPrice) minPrice = "0";
    if (!maxPrice) maxPrice = "999999";
    if (!limit) limit = "999999";
    
    sq.listProducts(con, name, order, parseInt(minPrice), parseInt(maxPrice), parseInt(limit)).then(function (data) {
        for (n=0; n<data.length; n++) {
        console.log(data[n].id + " "+ data[n].ItemName + " "+ data[n].Price + "€  "+ data[n].Amount);
        }
        con.end();

    }).catch(function(e) {
         con.end();
         console.log("ERROR:",e);
    });
}
console.log("Usage: node listProducts.js <ItemName> <order> <MinPrice> <MaxPrice> <limit>");
listProducts(process.argv[2], process.argv[3], process.argv[4], process.argv[5], process.argv[6]);