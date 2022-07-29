const { MongoClient } = require('mongodb');
const connectionString = 'mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.5.0';
const fruitSchema = require('../models/fruits.model')
const client = new MongoClient(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let dbConnection;

module.exports = {
  connectToServer: function (callback) {
    client.connect(function (err, db) {
      if (err || !db) {
        return callback(err);
      }
      // creation of db
      dbConnection = db.db('final_pesto');
      dbConnection.collection('fruits').createIndex({qty:1},{unique:true})
      dbConnection.command({
        collMod: "fruits",
        validator: fruitSchema
      })
      console.log('Successfully connected to MongoDB.');

      return callback();
    });
  },

  getDb: function () {
    return dbConnection;
  },
};
