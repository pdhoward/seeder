require('dotenv').config()
const mongoose = require("mongoose");
const db = require("./models");
const csv=require('csvtojson')

mongoose.connect(process.env.machine || "mongodb://localhost/marketss", {
  useNewUrlParser: true, 
  useUnifiedTopology: true,
  useCreateIndex: true,
});

const convert = async () => {
    const csvFilePath='./data/markets.csv'
    const jsonArray = await csv().fromFile(csvFilePath)
    console.log(jsonArray[0])
    console.log(jsonArray[1])
    console.log(jsonArray.length)
    const result = jsonArray.filter(o => o.marketid != "")
    console.log(result[0])
    console.log(result[1])
    console.log(result.length)
    db.Markets.deleteMany({})
      .then((res) => {    
        console.log(`${res.deletedCount} records deleted!`)
      })
      .then(() => db.Markets.collection.insertMany(result))
      .then(data => {
        console.log(`${data.result.n} records inserted!`); 
        process.exit(0)   
      })
      .catch(err => {
        console.error(err);
        process.exit(1);
      });
}

convert()
/*
var marketSeed = [ 
  {    
    name: "PROXIMITY",
    address: "New York",
    menu: {items: "extraordinary stuff"},
    acceptsReservations: true,       
    description: "Simple test for connecting with a writing to MongoDB"     
  }
];

// seed the database with a fresh set of documents
db.Markets.deleteMany({})
  .then((res) => {    
    console.log(`${res.deletedCount} records deleted!`)
  })
  .then(() => db.Markets.collection.insertMany(marketSeed))
  .then(data => {
    console.log(`${data.result.n} records inserted!`); 
    process.exit(0)   
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });

  */
