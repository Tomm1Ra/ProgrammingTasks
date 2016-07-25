
function updateAmountOfItems(con, table, pId, amount) {
    return new Promise(function (fulfill, reject) {
        con.query('UPDATE '+table+' SET Amount=' + amount + ' WHERE ProductId=' + pId, function (err, res) {
            if (err) { reject(err); }
            fulfill();
        });
    });
}

function checkItemsInStore(con, pId) {
    return new Promise(function (fulfill, reject) {
        con.query('SELECT * FROM products WHERE id=' + pId, function (err, res) {
            if (err) { reject(err); }
            fulfill(res[0].Amount);
        })
    });

}

function updateAmountOfProducts(con, pId, amount) {
    return new Promise(function (fulfill, reject) {
        con.query('UPDATE products SET Amount=' + amount + ' WHERE id=' + pId, function (err, res) {
            if (err) { reject(err); }
            fulfill();
        });
    });
}

function checkBasket(con, table) {
    return new Promise(function (fulfill, reject) {
        con.query('SHOW TABLES LIKE \'' + table + '\'', function (err, rows) {
            if (err) { reject(err); }
            fulfill(rows);
        })
    });

}

function checkItemsInBasket(con, table, pId) {
    return new Promise(function (fulfill, reject) {
        con.query('SELECT Amount FROM '+table+' WHERE ProductId=' + pId, function (err, res) {
            if (err) { reject(err); }
            if (res.length==0) fulfill(-1); else  fulfill(res[0].Amount);
        })
    });

}

function addItemShoppingBasket(con, table, data) {
    return new Promise(function (fulfill, reject) {
        con.query('INSERT INTO ' + table + '  SET ?', data, function (err, res) {
            if (err) { reject(err); }
            fulfill();
        });
    });
}

function addNewProduct(con, data) {
    return new Promise(function (fulfill, reject) {
        con.query('INSERT INTO products SET ?', data, function (err, res) {
            if (err) { reject(err); }
            fulfill();
        });
    });
}

function listProducts(con, name, order, minPrice, maxPrice, limit) {
    return new Promise(function (fulfill, reject) {
        con.query('SELECT * FROM products WHERE ItemName LIKE \''+ name +'%\' AND Price BETWEEN '+ minPrice + ' AND ' + maxPrice + '\
         ORDER BY ' + order + ' LIMIT '+limit, function (err, rows) {
                if (err) { reject(err); }
                fulfill(rows);
            });
    });
}

function showTables(con) {
    return new Promise(function (fulfill, reject) {
        con.query('SHOW TABLES' , function (err, res) {
            if (err) { reject(err); }
            fulfill(res);
        })
    });
}

function dropTable(con, table) {
    return new Promise(function (fulfill, reject) {
        con.query('DROP TABLE '+table , function (err, res) {
            if (err) { reject(err); }
            fulfill(res);
        })
    });
}

function getItemsInBasket(con, table) {
    return new Promise(function (fulfill, reject) {
        con.query('SELECT * FROM '+ table, function (err, rows) {
                if (err) { reject(err); }
                fulfill(rows);
            });
    });
}

function getProductPrice(con, pId) {
    return new Promise(function (fulfill, reject) {
        con.query('SELECT Price FROM products WHERE id='+pId, function (err, rows) {
                if (err) { reject(err); }
                fulfill(rows[0].Price);
            });
    });
}

function getProductName(con, pId) {
    return new Promise(function (fulfill, reject) {
        con.query('SELECT ItemName FROM products WHERE id='+pId, function (err, rows) {
                if (err) { reject(err); }
                fulfill( rows[0].ItemName);
            });
    });
}

function updateProductInfo(con, pId, field, value) {
    return new Promise(function (fulfill, reject) {
        con.query('UPDATE products SET '+field+'=' + value + ' WHERE id=' + pId, function (err, res) {
            if (err) { reject(err); }
            fulfill();
        });
    });
}

module.exports.checkItemsInBasket = checkItemsInBasket;
module.exports.checkBasket = checkBasket;
module.exports.updateAmountOfProducts = updateAmountOfProducts;
module.exports.checkItemsInStore = checkItemsInStore;
module.exports.updateAmountOfItems = updateAmountOfItems;
module.exports.addItemShoppingBasket = addItemShoppingBasket;
module.exports.addNewProduct = addNewProduct;
module.exports.listProducts = listProducts;
module.exports.showTables = showTables;
module.exports.dropTable = dropTable;  
module.exports.getItemsInBasket = getItemsInBasket;
module.exports.getProductPrice = getProductPrice;
module.exports.getProductName = getProductName;
module.exports.updateProductInfo = updateProductInfo;