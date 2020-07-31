const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let marketSchema = new Schema({  
  marketid: { type: String },
  zipcode: {type: String},
  category: {type: String},
  name: {type: String},
  location: { type: "Point", coordinates: Array},
  latitude: {type: String},
  longitude: {type: String},
  website: {type: String},  
  address: { type: String },
  map: { type: String},  
  starRating: Number,
  hours: Object,
  description: String,
  traffic: Object    
}, { collection: 'markets' });

marketSchema.index({name: "text", description: "text"})

let Markets = mongoose.model("Markets", marketSchema);

module.exports = Markets;