require('dotenv').config()
const mongoose = require("mongoose");
const db = require("./models");


// https://www.npmjs.com/package/csvtojson

mongoose.connect(process.env.rest001 || "mongodb://localhost/restaurants", {
  useNewUrlParser: true, 
  useUnifiedTopology: true,
  useCreateIndex: true,
});

var diningSeed = [ 
  {    
    name: "PROXIMITY",
    address: "New York",
    menu: {items: "extraordinary stuff"},
    acceptsReservations: true,       
    description: "Simple test for connecting with a writing to MongoDB"     
  }
];

// seed the database with a fresh set of documents
db.Dining.deleteMany({})
  .then((res) => {    
    console.log(`${res.deletedCount} records deleted!`)
  })
  .then(() => db.Dining.collection.insertMany(diningSeed))
  .then(data => {
    console.log(`${data.result.n} records inserted!`);    
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
