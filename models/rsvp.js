const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rsvpSchema = new Schema({
    event: {type: Schema.Types.ObjectId, ref: 'Event', required: [true, 'Event is required']},
    user: {type: Schema.Types.ObjectId, ref: 'User', required: [true, 'User is required']},
    status: {type: String, enum: ['YES', 'NO', 'MAYBE'], default: 'NO', required: [true, 'Status is required']},
},
{timestamps: true}
);

//collection name is RSVPs in the database
module.exports = mongoose.model('RSVP', rsvpSchema);