//Import the mongoose module
var mongoose = require('mongoose');

//Set up default mongoose connection
var mongoDB = 'mongodb://test:password1@ds231951.mlab.com:31951/qb-activity';
mongoose.connect(mongoDB);
// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;
//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
var Schema = mongoose.Schema;
var mailbook = new Schema({
    _id: Schema.Types.ObjectId,
    title: String,
    author: String
});
module.exports = mongoose.model('Book', mailbook);