require('dotenv').config()
const mongoose = require("mongoose");
const db = require("./models");
const csv=require('csvtojson')

mongoose.connect(process.env.machine || "mongodb://localhost/marketss", {
  useNewUrlParser: true, 
  useUnifiedTopology: true,
  useCreateIndex: true,
});

const storeNames = [
  'Cherians International Groceries',
  'International Supermarket',
  'International Food Concepts', 
  "BAKKAL INT'L FOODS",
  'International Food Store',
  'Al-Salam International Groceries',
  'Leon International Foods',
  'Buford International Market',
  'Nam Dae Mun Farmers Market',
  'Kroger', 
  'Gourmet Foods International',
  'Darousalam International Market',
  'Vatan International Grocery',
  'KHI International Trade',
  'Super Global International Food Market',
  'African & International Market, LLC',
  'Buford Highway Farmers Market',
  'Lake City International Farmers Market',
  'Core-Mark International Inc',
  'Reliv International (Independant Distribubutors)', 
   'Raja Foods International',
  'Kroger Warehouse',
  'ALDI',
  'International Gourmet Foods',
  'Publix Super Market at Peachtree Battle SC',
  "Trader Joe's",,
  'Cayce Foods Inc',
  'Darling International Inc',
  'Marietta Halal Meat',
  'Shahrzad',
  'US Meat International',
  'Walmart Supercenter',
  'TURKISH GROCERY STORE',
  'Commerce International, Inc.',
  'United Food & Commercial Workers',
  'Market Grocery Co',
  'Mondelez International, Inc.',
  'Publix Pharmacy at Princeton Lakes',
  'Haagen-Dazs Ice Cream Shop',
  'African Terminal Market',
  'Super Giant Mart',
  'Atlanta Oriental Food',
  'Publix Super Market at Highland Station',
  'Acro International Food Distribution',
  'Souq International Market',  
  'Publix Super Market at The Prado',
  'Cherians International Fresh Market',
  'AlHamrah Halal Meat & Groceries',
  'Sanwa Produce',
  'Unilever Best Foods',
  'Dawn Food Products Inc',
  'New International Food Inc',
  'Wayfield Foods Inc',
  'Austell International Farmers Market',
  'FedEx Office Print & Ship Center',
  'Zamzam International Foods',
  'Food Store',
  'Whole Foods Market',
  'Publix Pharmacy In Atlantic Station',
  'Publix Super Market at Alpharetta Commons',
  'Publix Pharmacy at Providence Pavilion', 
  'Malincho Euro Market & Cafe',
   'Publix Pharmacy at Perimeter',
  'Publix Pharmacy at Paces Ferry Center',
  'Your DeKalb Farmers Market',
  'Publix Super Market at Haynes Bridge Village',
  'Shahi Grill',
  "Publix Super Market at King's Market",
  'Mas and J International Food',
  'FedEx Ship Center',
  'Publix Pharmacy at Parkway Village',
  'Service Foods Inc',
  'The Fresh Market',
  'Quiubi Internationai Market'
]

const convert = async () => {

  // create an array of retail store names to use for randowm assignment to test dataste
    const retailFilePath='./data/retailstores.csv'
    const names= await csv().fromFile(retailFilePath)   
    const reduceArray = names.slice(0, 300)
    const selectNames = reduceArray.map(r => r.dba)
    const newNames = [...selectNames, ...storeNames]
    console.log(`The array of random store names has ${newNames.length} entries`)

  // ingest spreadsheet of retail stores and locations
    const marketsFilePath='./data/markets.csv'
    const jsonArray = await csv().fromFile(marketsFilePath)  
    const filter = jsonArray.filter(o => o.marketid != "")   // delete blanks   
    console.log(`The array of stores and locations has ${filter.length} entries`)
    const result = filter.map(m => {
      m.location = {}
      m.location.coordinates = []
      let lon = parseFloat(m.longitude)
      let lat = parseFloat(m.latitude)
      m.location.type = "Point"     
      m.location.coordinates.push(lon)
      m.location.coordinates.push(lat)

      // test for duplicate names or nulls noted in a string of json docs      
      if (newNames.includes(m.name)) {        
        let assignedName = newNames[Math.floor(Math.random() * newNames.length)]       
        m.name = assignedName
      }
      if (m.name == null) {
        let assignedName = newNames[Math.floor(Math.random() * newNames.length)]       
        m.name = assignedName
      }
      // test for invalid gps points
      if (typeof lon != "number" || typeof lat != "number") console.log(m)
      return m
    })
    console.log(`Store array transformed has ${filter.length} entries`)
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

