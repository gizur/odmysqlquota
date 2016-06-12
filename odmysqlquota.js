//
// Manage Quotas
//
// This module relies on that the stored procedure `spCheckQuota` exists
//
//  var options = {
//    host: 'localhost',
//    user: process.env.ADMIN_USER,
//    password: process.env.ADMIN_PASSWORD,
//    //  database : process.env.ADMIN_USER,
//  };


var util = require('util');
var mysql = require('mysql');

var log = console.log.bind(console);
var error = console.log.bind(console, 'ERROR');
var debug = console.log.bind(console, 'DEBUG');

Q = function (options, proc) {
  if (!options) throw new Error('options are mandatory');

  this.proc = proc || 'spCheckQuota';
  this.options = options;
};

Q.prototype.runQuery_ = function (sql) {
  var self = this;

  return new Promise(function (fullfil, reject) {
    debug(sql);
    var conn = mysql.createConnection(self.options);
    conn.connect();

    var res = [];
    var query = conn.query(sql);
    query
      .on('error', function (err) {
        error(err);
        reject(err);
      })
      .on('result', function (row) {
        res.push(row);
      })
      .on('end', function () {
        fullfil(res);
        conn.end();
      });
  });
};

Q.prototype.checkQuota = function (ast) {
  var sql = util.format("call %s('%s','%s')",
              this.proc, ast.queryType, this.options.user);
log(sql);
  return this.runQuery_(sql);
};

module.exports = Q;
