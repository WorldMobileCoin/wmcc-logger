'use strict';

const fs = require('fs');
const path = require('path');

function promisify(func) {
  return function(...args) {
    return new Promise((resolve, reject) => {
      args.push(wrap(resolve, reject));
      func.call(this, ...args);
    });
  };
}

function wrap(resolve, reject) {
  return function(err, result) {
    if (err) {
      reject(err);
      return;
    }
    resolve(result);
  };
}

exports.stat = promisify(fs.stat);
exports.open = promisify(fs.open);
exports.close = promisify(fs.close);
exports.read = promisify(fs.read);
exports.write = promisify(fs.write);
exports.ftruncate = promisify(fs.ftruncate);
exports.createWriteStream = fs.createWriteStream;

exports.ensure = (filename) => {
  return new Promise((resolve, reject) => {
    fs.exists(filename, (exists) => {
      if(exists)
        return resolve()

      try {
        fs.mkdirSync(path.join(filename, '..'), { recursive: true })
        resolve()
      } catch (error) {
        reject (error)
      }
    })
  })
}