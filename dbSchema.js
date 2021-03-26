var mongoose = require('mongoose');

const mySchema = new mongoose.Schema({
    name: String
});

var Cities = mongoose.model('Cities', mySchema); 
module.exports = Cities;