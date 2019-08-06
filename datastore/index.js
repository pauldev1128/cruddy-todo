const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {

  counter.getNextUniqueId((err, id) => {
    var myPath = path.join(exports.dataDir, `${id}.txt`);
    fs.writeFile(myPath, text, (err) => {
      if (err) {
        callback(err);
      } else {
        callback(null, { id, text })
      }
    }
      // (err, {id, text}) => (callback(err, { id, text }))
  )
  })
};

exports.readAll = (callback) => {
  fs.readdir(exports.dataDir, (err, data) => {
    if (err) {
      callback(err);
    } else {
      callback(null, _.map(data, (text, id) => {
        text = text.slice(0, text.length - 4);
        id = text;
        return { id, text }
      }))
    }
  });

};

exports.readOne = (id, callback) => {
  var myPath = path.join(exports.dataDir, `${id}.txt`);
  fs.readFile(myPath, "utf8", (err, text) => {
    if (err) {
      callback(err)
    } else {
      callback(null, { id, text: text })
    }
  })


  // var text = items[id];
  // if (!text) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback(null, { id, text });
  // }
};

exports.update = (id, text, callback) => {

  var myPath = path.join(exports.dataDir, `${id}.txt`);
  fs.readFile(myPath, 'utf8', (err) => {
    if (err) {
      callback (err)
    } else {
      fs.writeFile(myPath, text, 'utf8' , (err) => {
        if (err) {
          callback (err)
        } else {
          callback (null, { id, text: text })
        }
      })
    }
  })
};

exports.delete = (id, callback) => {
  var myPath = path.join(exports.dataDir, `${id}.txt`);
  fs.unlink(myPath, (err) => {
    if(err) {
      callback(err)
    } else {
      callback(null, id)
    }
  })
  // var item = items[id];
  // delete items[id];
  // if (!item) {
  //   // report an error if item not found
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback();
  // }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
