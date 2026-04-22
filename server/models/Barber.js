const mongoose = require('mongoose');

const barberSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    bio: { type: String },
    specialties: [{ type: String }], // e.g. ["Haircut", "Beard trim"]
    workingHours: [{
        day: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] },
        start: { type: String }, // e.g. "09:00"
        end: { type: String },   // e.g. "17:00"
        isOff: { type: Boolean, default: false }
    }],
    breakTimes: [{
        start: { type: String },
        end: { type: String }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Barber', barberSchema);
