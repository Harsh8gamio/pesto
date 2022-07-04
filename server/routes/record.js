const express = require('express');

// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /listings.
const recordRoutes = express.Router();

// This will help us connect to the database
const dbo = require('../db/conn');

// [
//   { "_id": 1, "name": "apples", "qty": 5, "rating": 3 },
//   { "_id": 2, "name": "bananas", "qty": 7, "rating": 1, "microsieverts": 0.1 },
//   { "_id": 3, "name": "oranges", "qty": 6, "rating": 2 },
//   { "_id": 4, "name": "avocados", "qty": 3, "rating": 5 },
// ]

recordRoutes.route('/fruits/index').get(function (req, res) {
  const dbConnect = dbo.getDb();
  res.send(dbConnect
    .collection('fruits').indexes())
  });

// This section will help you create a new record.
recordRoutes.route('/fruits').post(function (req, res) {
  const dbConnect = dbo.getDb();

  dbConnect
    .collection('fruits')
    .insertMany([
      {  "name": "bananas", "qty": 7, "rating": 1, "microsieverts": 0.1 },
      {  "name": "oranges", "qty": 6, "rating": 2 },
      {  "name": "avocados", "qty": 3, "rating": 5 },
    ], function (err, result) {
      if (err) {
        res.send('Error inserting matches!');
      } else {
        console.log(`Added a new data ${result }`);
        res.send(result);
      }
    });
});


recordRoutes.route('/fruits').get(function (req, res) {
  const dbConnect = dbo.getDb();

  dbConnect
    .collection('fruits')
    .find({
      $and: [
         { rating: { $eq: 6 }},
         { qty: { $gte: 3 }}
      ]
    })
    .toArray(function (err, result) {
      if (err) {
        res.status(400).send("Error fetching listings!");
     } else {
        res.json(result);
      }
    });
});

recordRoutes.route('/fruits/aggre').get(function (req, res) {
  const dbConnect = dbo.getDb();

  dbConnect
    .collection('fruits')
     .aggregate( [
      {
         $match:
         {}
      },
      {
        $sort: { qty: -1 }
      },
      {
        $project:{
          _id:0,
          qty:1,
          name:1,
          rating:1,
          id:'$_id'
        }
      }
  
    ] )
   
    .toArray(function (err, result) {
      if (err) {
        res.status(400).send("Error fetching listings!");
     } else {
        res.json(result);
      }
    });
});

recordRoutes.route('/fruits/one').get(function (req, res) {
  const dbConnect = dbo.getDb();

  dbConnect
    .collection('fruits')
    .findOne({name:'bananas'},function (err, result) {
      if (err) {
        res.status(400).send("Error fetching listings!");
     } else {
        res.json(result);
      }
    });
});

recordRoutes.route("/fruits/updateRating").post(function (req, res) {
  const dbConnect = dbo.getDb();
  const listingQuery = { name: req.body.name };
  const updates = {
    $inc: {
      rating: 1
    }
  };

  dbConnect
    .collection("fruits")
    .updateOne(listingQuery, updates, function (err, _result) {
      if (err) {
        res.status(400).send(`Error updating rating!`);
      } else {
        console.log("1 document updated");
      }
    });
});
 
recordRoutes.route("/listings/delete/:name").delete((req, res) => {
  const dbConnect = dbo.getDb();
  console.log(req.params.name)
  const listingQuery = { name: req.params.name };

  dbConnect
    .collection("fruits")
    .delete(listingQuery, function (err, _result) {
      if (err) {
        res.status(400).send(`Error deleting !`);
      } else {
        console.log("1 document deleted");
      }
    });
});

module.exports = recordRoutes;
