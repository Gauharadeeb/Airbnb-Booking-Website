const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Place = require('./models/Place');

const demoHostEmail = 'demo-host@stayfinder.local';
const demoPassword = 'DemoHost123!';

const demoListings = [
    {
        title: 'Beachfront Villa with Private Pool',
        address: 'Ashwem Beach Road, North Goa',
        city: 'Goa',
        propertyType: 'Beach Villa',
        description: 'A breezy coastal villa steps from the sand, with open living spaces, a private pool, sunset deck, and calm bedrooms made for slow beach mornings.',
        price: 8900,
        maxGuests: 6,
        perks: ['wifi', 'parking', 'tv', 'entrance'],
        photos: [
            'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1400&q=80',
            'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80',
            'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=80',
        ],
    },
    {
        title: 'Mountain Cabin Above the Pines',
        address: 'Landour Ridge, Mussoorie',
        city: 'Mussoorie',
        propertyType: 'Mountain Cabin',
        description: 'A warm timber cabin with valley views, reading corners, fast wifi, and a quiet deck for misty mornings and starry nights.',
        price: 6200,
        maxGuests: 4,
        perks: ['wifi', 'parking', 'pets', 'radio'],
        photos: [
            'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1400&q=80',
            'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?auto=format&fit=crop&w=1400&q=80',
            'https://images.unsplash.com/photo-1482192505345-5655af888cc4?auto=format&fit=crop&w=1400&q=80',
        ],
    },
    {
        title: 'Modern City Apartment Near Art District',
        address: 'Lodhi Colony, New Delhi',
        city: 'New Delhi',
        propertyType: 'City Apartment',
        description: 'A bright apartment close to cafes, galleries, monuments, and metro access. Ideal for city breaks, work trips, and long weekends.',
        price: 4800,
        maxGuests: 3,
        perks: ['wifi', 'tv', 'entrance'],
        photos: [
            'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1400&q=80',
            'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1400&q=80',
            'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1400&q=80',
        ],
    },
    {
        title: 'Luxury Penthouse with Skyline Terrace',
        address: 'Golf Course Road, Gurugram',
        city: 'Gurugram',
        propertyType: 'Luxury Penthouse',
        description: 'A high-floor penthouse with a private terrace, panoramic skyline views, refined interiors, and generous lounge spaces for premium city stays.',
        price: 12500,
        maxGuests: 5,
        perks: ['wifi', 'parking', 'tv', 'entrance'],
        photos: [
            'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1400&q=80',
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80',
            'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1400&q=80',
        ],
    },
    {
        title: 'Lake View Cottage with Garden Deck',
        address: 'Bhimtal Lake Road, Nainital',
        city: 'Nainital',
        propertyType: 'Lake View Cottage',
        description: 'A serene cottage overlooking the lake with garden seating, cozy bedrooms, and easy access to walking trails and local cafes.',
        price: 5400,
        maxGuests: 4,
        perks: ['wifi', 'parking', 'pets', 'entrance'],
        photos: [
            'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1400&q=80',
            'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1400&q=80',
            'https://images.unsplash.com/photo-1598228723793-52759bba239c?auto=format&fit=crop&w=1400&q=80',
        ],
    },
    {
        title: 'Desert Retreat with Courtyard Pool',
        address: 'Sam Sand Dunes Road, Jaisalmer',
        city: 'Jaisalmer',
        propertyType: 'Desert Retreat',
        description: 'A peaceful desert stay with warm stone textures, a shaded courtyard, plunge pool, and evenings built around local food and open skies.',
        price: 7100,
        maxGuests: 5,
        perks: ['wifi', 'parking', 'radio', 'entrance'],
        photos: [
            'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1400&q=80',
            'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1400&q=80',
            'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80',
        ],
    },
    {
        title: 'Forest House with Glass Lounge',
        address: 'Old Manali Forest Road, Himachal Pradesh',
        city: 'Manali',
        propertyType: 'Forest House',
        description: 'A modern forest home with floor-to-ceiling windows, pine views, heated rooms, and a glass lounge for slow mountain living.',
        price: 7600,
        maxGuests: 6,
        perks: ['wifi', 'parking', 'pets', 'tv'],
        photos: [
            'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&w=1400&q=80',
            'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1400&q=80',
            'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1400&q=80',
        ],
    },
    {
        title: 'Minimal Modern Studio for Work Trips',
        address: 'Indiranagar, Bengaluru',
        city: 'Bengaluru',
        propertyType: 'Modern Studio',
        description: 'A compact design-forward studio with fast wifi, a real work desk, kitchenette, natural light, and walkable cafes nearby.',
        price: 3600,
        maxGuests: 2,
        perks: ['wifi', 'tv', 'entrance'],
        photos: [
            'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80',
            'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80',
            'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1400&q=80',
        ],
    },
    {
        title: 'Flat in Noida with Skyline Balcony',
        address: 'Sector 62, Noida',
        city: 'Noida',
        propertyType: 'City Flat',
        description: 'A bright Noida flat with balcony seating, fast wifi, cozy bedrooms, and quick access to cafes, metro, and business districts.',
        price: 2625,
        maxGuests: 3,
        perks: ['wifi', 'parking', 'tv', 'entrance'],
        photos: [
            'https://images.unsplash.com/photo-1560448075-bb485b067938?auto=format&fit=crop&w=1400&q=80',
            'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1400&q=80',
            'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80',
        ],
    },
    {
        title: 'Apartment in Greater Noida Garden Estate',
        address: 'Greater Noida West, Noida',
        city: 'Noida',
        propertyType: 'Apartment',
        description: 'A calm apartment in a green residential estate with modern interiors, family-friendly spaces, and comfortable work corners.',
        price: 2833,
        maxGuests: 4,
        perks: ['wifi', 'parking', 'tv'],
        photos: [
            'https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?auto=format&fit=crop&w=1400&q=80',
            'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1400&q=80',
            'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1400&q=80',
        ],
    },
    {
        title: 'Rishikesh River View Apartment',
        address: 'Tapovan, Rishikesh',
        city: 'Rishikesh',
        propertyType: 'River View Apartment',
        description: 'A peaceful apartment close to yoga studios and river walks, with airy rooms, mountain light, and a quiet balcony.',
        price: 5056,
        maxGuests: 4,
        perks: ['wifi', 'parking', 'entrance'],
        photos: [
            'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1400&q=80',
            'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1400&q=80',
            'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1400&q=80',
        ],
    },
    {
        title: 'Place to Stay near Lakshman Jhula',
        address: 'Lakshman Jhula Road, Rishikesh',
        city: 'Rishikesh',
        propertyType: 'Guest Suite',
        description: 'A warm guest suite near cafes, yoga classes, and river viewpoints, ideal for relaxed weekend stays.',
        price: 8454,
        maxGuests: 3,
        perks: ['wifi', 'pets', 'entrance'],
        photos: [
            'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1400&q=80',
            'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80',
            'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1400&q=80',
        ],
    },
    {
        title: 'Heritage Stay near Assi Ghat',
        address: 'Assi Ghat, Varanasi',
        city: 'Varanasi',
        propertyType: 'Heritage Stay',
        description: 'A characterful stay near the ghats with warm interiors, local textures, and easy walks to sunrise boat rides.',
        price: 5200,
        maxGuests: 4,
        perks: ['wifi', 'tv', 'entrance'],
        photos: [
            'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1400&q=80',
            'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80',
            'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1400&q=80',
        ],
    },
    {
        title: 'Room in Varanasi Old City',
        address: 'Dashashwamedh Ghat, Varanasi',
        city: 'Varanasi',
        propertyType: 'Private Room',
        description: 'A simple, comfortable room in the old city lanes with quick access to food walks, ghats, and cultural experiences.',
        price: 2800,
        maxGuests: 2,
        perks: ['wifi', 'entrance'],
        photos: [
            'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1400&q=80',
            'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80',
            'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1400&q=80',
        ],
    },
    {
        title: 'Home in Dehradun with Garden Patio',
        address: 'Rajpur Road, Dehradun',
        city: 'Dehradun',
        propertyType: 'Garden Home',
        description: 'A comfortable Dehradun home with soft lounge spaces, a garden patio, parking, and easy access to the hills.',
        price: 10968,
        maxGuests: 5,
        perks: ['wifi', 'parking', 'pets', 'tv'],
        photos: [
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80',
            'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1400&q=80',
            'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1400&q=80',
        ],
    },
    {
        title: 'North Goa Villa in Nerul',
        address: 'Nerul, North Goa',
        city: 'Goa',
        propertyType: 'Pool Villa',
        description: 'A sunny North Goa villa with poolside seating, large windows, private entry, and generous rooms for group getaways.',
        price: 21473,
        maxGuests: 6,
        perks: ['wifi', 'parking', 'tv', 'entrance'],
        photos: [
            'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=80',
            'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1400&q=80',
            'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1400&q=80',
        ],
    },
];

function getMongoOptions(mongoUrl) {
    const options = { serverSelectionTimeoutMS: 10000 };

    try {
        const parsedUrl = new URL(mongoUrl);
        if (!parsedUrl.pathname.replace('/', '')) {
            options.dbName = process.env.MONGO_DATABASE || 'airbnb_booking';
        }
    } catch {
        options.dbName = process.env.MONGO_DATABASE || 'airbnb_booking';
    }

    return options;
}

async function seedDemoListings() {
    const mongoUrl = process.env.MONGO_URL || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/airbnb_booking';
    await mongoose.connect(mongoUrl, getMongoOptions(mongoUrl));

    const password = bcrypt.hashSync(demoPassword, bcrypt.genSaltSync(10));
    const demoHost = await User.findOneAndUpdate(
        { email: demoHostEmail },
        { name: 'StayFinder Demo Host', email: demoHostEmail, password },
        { new: true, upsert: true, setDefaultsOnInsert: true },
    );

    await Place.deleteMany({ owner: demoHost._id });

    const places = demoListings.map((listing) => ({
        ...listing,
        owner: demoHost._id,
        checkIn: 14,
        checkOut: 11,
        extraInfo: `${listing.propertyType} in ${listing.city}. Amenities include ${listing.perks.join(', ')}.`,
    }));

    await Place.insertMany(places);
    console.log(`Seeded ${places.length} demo listings for ${demoHostEmail}`);
    console.log(`Demo host login: ${demoHostEmail} / ${demoPassword}`);
}

seedDemoListings()
    .catch((error) => {
        console.error('Demo seed failed:', error.message);
        process.exitCode = 1;
    })
    .finally(async () => {
        await mongoose.disconnect();
    });
