require('dotenv').config()
const mongoose = require("mongoose");
const db = require("./models");
const csv=require('csvtojson')

mongoose.connect(process.env.machine || "mongodb://localhost/marketss", {
  useNewUrlParser: true, 
  useUnifiedTopology: true,
  useCreateIndex: true,
});

const csvFilePath='./data/markets.csv'
let mktseed = csv()
.fromFile(csvFilePath)
.then((jsonObj)=>{
    console.log(jsonObj[0]);
    console.log(jsonObj[1])})
.then((obj) => {
  let result = obj.filter(o => o.marketid != "") 
})
.then((result) => {
  console.log(result[0])
  console.log(result[1])
  console.log(result.length)
})

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
