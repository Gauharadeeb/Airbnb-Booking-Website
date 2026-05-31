const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    address: { type: String, default: '', trim: true },
    city: { type: String, default: '', trim: true },
    propertyType: { type: String, default: '', trim: true },
    photos: { type: [String], default: [] },
    description: { type: String, default: '' },
    perks: { type: [String], default: [] },
    extraInfo: { type: String, default: '' },
    checkIn: { type: Number, default: 0 },
    checkOut: { type: Number, default: 0 },
    maxGuests: { type: Number, default: 1, min: 1 },
    price: { type: Number, default: 0, min: 0 },
}, {
    timestamps: true,
    toJSON: {
        transform(doc, ret) {
            delete ret.__v;
            return ret;
        },
    },
});

placeSchema.index({ owner: 1, createdAt: -1 });

const PlaceModel = mongoose.model('Place', placeSchema);

module.exports = PlaceModel;
