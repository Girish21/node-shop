// const Sequelize = require('sequelize');

// const sequelize = new Sequelize('node-complete', 'root', 'nodecomplete', {
//   dialect: 'mysql',
//   host: 'localhost'
// });

// module.exports = sequelize;

const MongoClient = require('mongodb').MongoClient;

let _db;

const MongoConnect = (cb) => {
  const client = new MongoClient('mongodb+srv://girish21:DdtYy5wYu3n87WB@cluster0-efuzf.gcp.mongodb.net/test?retryWrites=true', { useNewUrlParser: true })
  client.connect()
    .then(result => {
      _db = result.db()
      cb(result);

    })
    .catch(err => console.log(err));
}

getDB = () => {
  if (_db)
    return _db;
  throw Error("No DB!") 
}

exports.MongoConnect = MongoConnect;
exports.getDB = getDB;
