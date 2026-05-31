const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    place: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Place' },
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    price: { type: Number, default: 0, min: 0 },
    numberOfGuests: { type: Number, default: 1, min: 1 },
}, {
    timestamps: true,
    toJSON: {
        transform(doc, ret) {
            delete ret.__v;
            return ret;
        },
    },
});

bookingSchema.index({ user: 1, createdAt: -1 });

const BookingModel = mongoose.model('Booking', bookingSchema);

module.exports = BookingModel;
