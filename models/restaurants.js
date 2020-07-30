const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let diningSchema = new Schema({  
  name: { type: String, required: true },
  address: { type: String, required: true },
  menu: { type: String, required: true },
  acceptsReservations: Boolean,
  hasMenu: Boolean,
  servesCuisine: String,
  starRating: Number, 
  currenciesAccepted: Boolean,
  openingHours: Object,
  priceRange: String,    
  description: String    
}, { collection: 'dining' });

diningSchema.index({name: "text", description: "text"})

let Dining = mongoose.model("Dining", diningSchema);

module.exports = Dining;