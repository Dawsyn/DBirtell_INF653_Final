const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stateSchema = new Schema({
    stateCode: {
        type: String,
        required: true,
        trim: true, // Added to remove any padding around the state code
        unique: true // Assuming that each state code is unique
    },
     funfacts: 
     {
        type: Map,
        of: String
        
    }
});

module.exports = mongoose.model('State', stateSchema);
