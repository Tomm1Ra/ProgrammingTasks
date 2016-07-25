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

function createNewBasket(table) {
    return new Promise(function (fulfill, reject) {
        var command = "CREATE TABLE " + table + "  (\
  id int(11) NOT NULL AUTO_INCREMENT,\
  UserId varchar(50),\
  ProductId varchar(50),\
  ItemName varchar(50),\
  Amount DECIMAL(5),\
  Price DECIMAL(5,2),\
  Total DECIMAL(5,2),\
  PRIMARY KEY (id)\
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=5 "
        con.query(command);
    });
}

function addShoppingBasket(userId, productId, amount) {
    var tableName = 'basket' + userId;
    var itemsInStore;
    var itemsInBasket;
    var itemPrice;
    var itemName;

    sq.checkBasket(con, tableName).then(function (data) {
        rows = data;
    }).then(function () {
        if (rows == "") {
            console.log("User has no shopping basket");
            createNewBasket(tableName).then(function () { });
        }
    });
    sq.checkItemsInStore(con, productId).then(function (data) {
        itemsInStore = data;
    }).then(function () {
        if (parseInt(itemsInStore) >= parseInt(amount)) {
            console.log("products in store!!");
            sq.updateAmountOfProducts(con, productId, itemsInStore - parseInt(amount)).then(function () {
                sq.checkItemsInBasket(con, tableName, productId).then(function (data) {
                    itemsInBasket = data;
                }).then(function () {
                    if (itemsInBasket == -1) {
                        sq.getProductPrice(con, productId).then(function (iPrice) {
                            itemPrice = iPrice;
                        }).then(function () {
                            sq.getProductName(con, productId).then(function (iName) {
                                itemName = iName;
                            }).then(function () {
                                var product = { UserId: userId, ProductId: productId, ItemName: itemName, Amount: parseInt(amount), Price: parseInt(itemPrice) };
                                sq.addItemShoppingBasket(con, tableName, product).then(function () {
                                    console.log("\n" + amount + " " + itemName + " added into shopping basket");
                                    con.end();
                                })
                            })
                        })
                    }
                    else {
                        sq.getProductName(con, productId).then(function (iName) {
                            itemName = iName;
                        }).then(function () {
                            sq.updateAmountOfItems(con, tableName, productId, itemsInBasket + parseInt(amount)).then(function () {
                                console.log("\n" + amount + " " + itemName + " now into shopping basket");
                                con.end();
                            })
                        })
                    }
                });
            });
        }

        else {
            console.log("No product in store");
            con.end();
        }
    }).catch(function (e) {
        console.log("ERROR:", e);
    })
}
if (process.argv.length == 5) {
    addShoppingBasket(process.argv[2], process.argv[3], process.argv[4]);
} else {
    console.log("Usage: node addShoppingBasket.js <UserId> <ProductId> <Amount>");
}

