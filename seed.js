require('dotenv').config()
const mongoose = require("mongoose");
const db = require("./models");
const csv=require('csvtojson')

mongoose.connect(process.env.machine || "mongodb://localhost/marketss", {
  useNewUrlParser: true, 
  useUnifiedTopology: true,
  useCreateIndex: true,
});

let lastName = "default name"

const convert = async () => {
    const retailFilePath='./data/retailstores.csv'
    const names= await csv().fromFile(retailFilePath)
    const selectNames = names.map((n, i) => {
      if (i < 500) {
        return n.dba
      }
    })
    //console.log(selectNames[0], selectNames[1], selectNames[300])
    const marketsFilePath='./data/markets.csv'
    const jsonArray = await csv().fromFile(marketsFilePath)    
    console.log(jsonArray.length)
    const filter = jsonArray.filter(o => o.marketid != "")    
    console.log(`---- data filtered ----`)
    console.log(filter.length)
    const result = filter.map(m => {
      m.location = {}
      m.location.coordinates = []
      let lon = parseFloat(m.longitude)
      let lat = parseFloat(m.latitude)
      m.location.type = "Point"     
      m.location.coordinates.push(lon)
      m.location.coordinates.push(lat)

      // eliminate duplicate names noted in a string of json docs
      if (m.name == lastName) {
        m.name = selectNames[Math.floor(Math.random() * selectNames.length)]
      } else {
        lastName = m.name
      }
      if (typeof lon != "number" || typeof lat != "number") console.log(m)
      return m
    })
    console.log(`---- GeoJSON created ----`)
    console.log(filter.length)
    db.Markets.deleteMany({})
      .then((res) => {    
        console.log(`${res.deletedCount} records deleted!`)
      })
      .then(() => db.Markets.collection.insertMany(result))
      .then( data => {
        console.log(`${data.result.n} records inserted!`); 
        // index built in mongoose schema
        db.Markets.collection.createIndex({location: "2dsphere"})
        //process.exit(0)           
      })
      .catch(err => {
        console.error(err);
        process.exit(1);
      });
}

convert()

