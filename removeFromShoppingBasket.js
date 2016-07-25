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

function removeFromShoppingBasket(userId, productId, amount) {
    var tableName = 'basket' + userId;
    var itemsInStore;
    var itemsInBasket;
    var rows;
    sq.checkBasket(con, tableName).then(function (data) {
        rows = data;
    }).then(function () {
        if (rows == "") {
            console.log("User has no shopping basket");
            con.end();
        }
        else {
            console.log("User has shopping basket");
            sq.checkItemsInBasket(con, tableName, productId).then(function (data) {
                itemsInBasket = data;
                console.log("User has items in basket:" + itemsInBasket);
            }).then(function () {
                if (itemsInBasket > 0) {
                    sq.checkItemsInStore(con, productId).then(function (data) {
                        itemsInStore = data;
                        console.log("Items in store"+itemsInStore);
                    }).then(function () {
                        sq.updateAmountOfItems(con, tableName, productId, parseInt(itemsInBasket) - parseInt(amount)).then(function () {
                            console.log("basket updated, items in basket:"+ (parseInt(itemsInBasket) - parseInt(amount)));
                            }).then(function () {
                            sq.updateAmountOfProducts(con, productId, parseInt(itemsInStore) + parseInt(amount)).then(function () {
                                console.log("products updated, items in store:"+(parseInt(itemsInStore) + parseInt(amount)));
                                con.end();
                            })
                        })
                    })

                }
                else {
                    con.end();
                }
                
            });
        }
    }).catch(function(e) {
  console.log("ERROR:",e);
    })
}

if (process.argv.length == 5){
removeFromShoppingBasket(process.argv[2], process.argv[3], process.argv[4]);
} else {
    console.log("Usage: node removeFromShoppingBasket.js <UserId> <ProductId> <Amount>")
}