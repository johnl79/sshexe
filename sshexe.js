#! /usr/bin/env node

var Connection = require('ssh2');
var async = require('async');

module.exports = sshexe

function sshexe(conf, cb) {
  var self = {},
      conn = self.connection = new Connection();

  conf = conf || {};
  conf.host = conf.host || 'localhost';
  conf.port = conf.port || 22;
  conf.username = conf.username || 'root';
  conf.privateKey = require('fs').readFileSync(conf.privateKey || process.env.HOME + "/.ssh/id_rsa");
  conf.env = conf.env || {};
  conf.bash = conf.bash || [];

  self.conf = conf

  self.callCmd = function(item, next) {
    next = next || function(err){}
    conn.exec(item, function(err, stream) {
      console.log('Calling ' + item)
      if (err) throw err;

      stream.on('data', function(data, extended) {
        console.log(data.toString('utf8'));
      });

      stream.on('end', function() {
        console.log('Stream :: EOF');
      });

      stream.on('close', function() {
        console.log('Stream :: close');
      });

      stream.on('exit', function(code, signal) {
        console.log('Stream :: exit :: code: ' + code + ', signal: ' + signal);
        next()
      });

    });
  }

  self.call = function(calls, cb) {
    if (Array.isArray(calls)) {
      async.eachSeries(calls, self.callCmd, function(err) {
        conn.end();
        if (err) cb(err);
      });
    }
    else {
      self.callCmd(calls);
    }
  }

  conn.on('connect', function() {
    console.log('Connection :: connect');
  });

  conn.on('error', function(err) {
    console.log('Connection :: error :: ' + err);
    cb(err)
  });

  conn.on('end', function() {
    console.log('Connection :: end');
  });

  conn.on('close', function(had_error) {
    console.log('Connection :: close');
    cb();
  });

  conn.on('ready', function() {
    console.log('Connection :: ready');
    self.call(conf.bash, cb);
  });

  conn.connect(conf);
}

function genExportStr(cmd) {
  var conn = this;
  var env_str = "export"
  Object.keys(conn.env).forEach(function(key) {
    var this_env = [key, conn.env[key]].join("=");
    env_str = [env_str, this_env].join(" ");
  });
  if (env_str === "export") {
    return ""
  }
  else {
    return env_str
  }
}

