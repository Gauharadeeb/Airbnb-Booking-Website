const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Place = require('./models/Place');
const Booking = require('./models/Booking');

const app = express();
const port = Number(process.env.PORT || 4000);
const jwtSecret = process.env.JWT_SECRET_TOKEN;
const rawClientUrl = process.env.CLIENT_URL || '';
const allowedOrigins = rawClientUrl
    .split(',')
    .map((url) => url.trim())
    .filter(Boolean);
const uploadDir = path.join(__dirname, 'temp', 'uploads');
const uploadProvider = process.env.UPLOAD_PROVIDER || 'local';
const defaultPublicApiUrl = process.env.NODE_ENV === 'production'
    ? 'https://airbnb-booking-website-2.onrender.com'
    : `http://localhost:${port}`;
const publicApiUrl = (process.env.API_PUBLIC_URL || defaultPublicApiUrl).replace(/\/$/, '');

if (!jwtSecret) {
    console.error('JWT_SECRET_TOKEN is missing in backend/.env');
    process.exit(1);
}

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(express.json());
app.use(cookieParser());
const corsOptions = {
    origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use('/api/upload-image', express.static(uploadDir));
app.use('/uploads', express.static(uploadDir));

const storage = multer.diskStorage({
    destination(req, file, cb) {
        fs.mkdir(uploadDir, { recursive: true }, (err) => cb(err, uploadDir));
    },
    filename(req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage }).array('photos');

function getLocalUploadUrl(fileName) {
    return `${publicApiUrl}/api/upload-image/${fileName}`;
}

function isTlsCertificateError(error) {
    return error?.code === 'UNABLE_TO_VERIFY_LEAF_SIGNATURE';
}

function getUploadErrorMessage(error) {
    if (isTlsCertificateError(error)) {
        return 'Cloudinary upload failed because Node could not verify the TLS certificate. Use UPLOAD_PROVIDER=local for development, or fix your system/Node certificate chain for Cloudinary.';
    }
    return error.message || 'Image upload failed.';
}

function asyncHandler(handler) {
    return (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
}

function requireDatabase(req, res, next) {
    if (mongoose.connection.readyState !== 1) {
        return res.status(503).json({
            success: false,
            message: 'Database is not connected. Check backend/.env MongoDB settings.',
        });
    }
    next();
}

function requireAuth(req, res, next) {
    const { token } = req.cookies;

    if (!token) {
        return res.status(401).json({ success: false, message: 'Please log in first.' });
    }

    jwt.verify(token, jwtSecret, {}, (err, userData) => {
        if (err) {
            return res.status(401).json({ success: false, message: 'Session expired. Please log in again.' });
        }
        req.user = userData;
        next();
    });
}

function getPublicUser(user) {
    if (!user) return null;
    return {
        _id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage || '',
    };
}

function normalizeName(value = '') {
    return String(value).trim().replace(/\s+/g, ' ');
}

function normalizeEmail(value = '') {
    return String(value).trim().toLowerCase();
}

function isValidEmail(value = '') {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

function validateAuthName(name) {
    if (!name) return 'Name is required.';
    if (name.length < 3) return 'Name must be at least 3 characters.';
    if (name.length > 40) return 'Name must not be more than 40 characters.';
    if (!/^[A-Za-z\s]+$/.test(name)) return 'Name can contain only letters and spaces.';
    return '';
}

function validateAuthPassword(password, name, email) {
    const value = String(password || '');
    const lowerValue = value.toLowerCase();

    if (!value.trim()) return 'Password is required.';
    if (value.length < 8) return 'Password must be at least 8 characters.';
    if (value.length > 32) return 'Password must not be more than 32 characters.';
    if (!/[A-Z]/.test(value)) return 'Password must contain at least one uppercase letter.';
    if (!/[a-z]/.test(value)) return 'Password must contain at least one lowercase letter.';
    if (!/\d/.test(value)) return 'Password must contain at least one number.';
    if (!/[^A-Za-z0-9]/.test(value)) return 'Password must contain at least one special character.';
    if (lowerValue === name.toLowerCase() || lowerValue === email.toLowerCase()) {
        return 'Password should not be the same as your name or email.';
    }
    return '';
}

function escapeRegex(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function parseListingHour(value) {
    if (value === undefined || value === null || value === '') return 0;

    if (typeof value === 'number') {
        return Number.isFinite(value) && value >= 0 && value <= 23 ? value : null;
    }

    const input = String(value).trim().toLowerCase().replace(/\s+/g, '');
    const numericHour = Number(input);

    if (Number.isFinite(numericHour) && numericHour >= 0 && numericHour <= 23) {
        return numericHour;
    }

    const timeMatch = input.match(/^(\d{1,2})(?::(\d{2}))?(am|pm)$/);
    if (!timeMatch) return null;

    let hour = Number(timeMatch[1]);
    const minutes = Number(timeMatch[2] || 0);
    const period = timeMatch[3];

    if (hour < 1 || hour > 12 || minutes < 0 || minutes > 59) return null;
    if (period === 'am') {
        hour = hour === 12 ? 0 : hour;
    } else {
        hour = hour === 12 ? 12 : hour + 12;
    }

    return hour;
}

function getMongoOptions(mongoUrl) {
    const options = {
        serverSelectionTimeoutMS: 10000,
    };

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

function isValidContactNumber(phone) {
    return /^\d{10}$/.test(String(phone || '').trim());
}

function getBookingConfirmationMessage(booking) {
    const dates = `${booking.checkIn.toISOString().slice(0, 10)} to ${booking.checkOut.toISOString().slice(0, 10)}`;
    return `Booking confirmed! Name: ${booking.name}, Contact: ${booking.phone}, Property: ${booking.place.title}, Address: ${booking.place.address}, Dates: ${dates}.`;
}

function sendBookingConfirmationMessage() {
    // SMS integration can be added here using Twilio/Fast2SMS later.
}

async function connectDB() {
    const mongoUrl = process.env.MONGO_URL || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/airbnb_booking';
    await mongoose.connect(mongoUrl, getMongoOptions(mongoUrl));
    console.log('Connected to MongoDB');
}

async function searchPlaces({ search = '', maxPrice, perk, sort = 'recommended', guests } = {}) {
    const filter = {};
    const andConditions = [];

    if (search.trim()) {
        const regex = new RegExp(escapeRegex(search.trim()), 'i');
        andConditions.push({ $or: [{ title: regex }, { address: regex }, { description: regex }] });
    }

    if (maxPrice) {
        filter.price = { $lte: Number(maxPrice) };
    }

    if (guests) {
        filter.maxGuests = { $gte: Number(guests) };
    }

    if (perk && perk !== 'all') {
        filter.perks = perk;
    }

    if (andConditions.length) {
        filter.$and = andConditions;
    }

    const sortOption = sort === 'price-low'
        ? { price: 1 }
        : sort === 'price-high'
            ? { price: -1 }
            : { createdAt: -1, _id: -1 };

    return Place.find(filter).sort(sortOption).limit(60);
}

app.get('/api/test', (req, res) => {
    res.json('test ok');
});

app.get('/api/health', (req, res) => {
    res.json({
        api: 'ok',
        database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        driver: 'mongodb',
    });
});

app.post('/api/register', requireDatabase, asyncHandler(async (req, res) => {
    const { name, email, password, profileImage = '' } = req.body;
    const normalizedName = normalizeName(name);
    const normalizedEmail = normalizeEmail(email);

    const nameError = validateAuthName(normalizedName);
    if (nameError) {
        return res.status(400).json({ success: false, message: nameError });
    }

    if (!normalizedEmail) {
        return res.status(400).json({ success: false, message: 'Email is required.' });
    }

    if (!isValidEmail(normalizedEmail)) {
        return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
    }

    const passwordError = validateAuthPassword(password, normalizedName, normalizedEmail);
    if (passwordError) {
        return res.status(400).json({ success: false, message: passwordError });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
        return res.status(409).json({ success: false, message: 'Email already exists. Please login or use another email.' });
    }

    const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    const newUser = await User.create({
        name: normalizedName,
        email: normalizedEmail,
        profileImage: String(profileImage || '').trim(),
        password: hashedPassword,
    });

    res.status(201).json({ success: true, data: getPublicUser(newUser) });
}));

app.post('/api/login', requireDatabase, asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const normalizedEmail = normalizeEmail(email);

    if (!normalizedEmail) {
        return res.status(400).json({ success: false, message: 'Email is required.' });
    }

    if (!isValidEmail(normalizedEmail)) {
        return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
    }

    if (!String(password || '').trim()) {
        return res.status(400).json({ success: false, message: 'Password is required.' });
    }

    const userFromDb = await User.findOne({ email: normalizedEmail }).select('+password');

    if (!userFromDb) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const passOk = bcrypt.compareSync(password, userFromDb.password);
    if (!passOk) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = jwt.sign({
        email: userFromDb.email,
        id: userFromDb._id,
    }, jwtSecret);

    res.cookie('token', token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
    }).json({ success: true, data: getPublicUser(userFromDb) });
}));

app.get('/api/profile', requireDatabase, requireAuth, asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);

    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found.' });
    }

    res.json({ success: true, data: getPublicUser(user) });
}));

app.put('/api/profile', requireDatabase, requireAuth, asyncHandler(async (req, res) => {
    const { name, profileImage = '' } = req.body;

    if (!name || !name.trim()) {
        return res.status(400).json({ success: false, message: 'Name is required.' });
    }

    const user = await User.findByIdAndUpdate(
        req.user.id,
        {
            name: name.trim(),
            profileImage: String(profileImage || '').trim(),
        },
        { new: true, runValidators: true },
    );

    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found.' });
    }

    res.json({ success: true, data: getPublicUser(user) });
}));

app.post('/api/logout', (req, res) => {
    res.clearCookie('token').json({ success: true });
});

app.post('/api/upload-by-link', asyncHandler(async (req, res) => {
    const { link } = req.body;

    if (!link) {
        return res.status(400).json({ success: false, message: 'Image link is required.' });
    }

    if (uploadProvider === 'local') {
        return res.json({
            imageUrl: link,
            message: 'Image link added locally',
            provider: 'local',
            success: true,
        });
    }

    try {
        const result = await cloudinary.uploader.upload(link, { folder: 'upload-image-by-link' });
        res.json({
            imageUrl: result.secure_url,
            message: 'Successfully uploaded to Cloudinary',
            provider: 'cloudinary',
            success: true,
        });
    } catch (error) {
        res.status(502).json({
            success: false,
            message: getUploadErrorMessage(error),
        });
    }
}));

app.post('/api/upload-image', (req, res, next) => {
    upload(req, res, async (err) => {
        try {
            if (err instanceof multer.MulterError) {
                return res.status(400).json({ message: err.message, success: false });
            }

            if (err) {
                return res.status(500).json({ message: err.message, success: false });
            }

            if (!req.files?.length) {
                return res.status(400).json({ message: 'No photos uploaded.', success: false });
            }

            const uploadedFiles = [];
            const cloudinaryResponses = [];

            for (const file of req.files) {
                const ext = path.extname(file.originalname);
                const newPath = `${file.path}${ext}`;
                fs.renameSync(file.path, newPath);
                const localFileName = path.basename(newPath);
                uploadedFiles.push(localFileName);

                if (uploadProvider === 'local') {
                    cloudinaryResponses.push(getLocalUploadUrl(localFileName));
                } else {
                    try {
                        const cloudinaryResponse = await cloudinary.uploader.upload(newPath, { folder: 'upload-from-device' });
                        cloudinaryResponses.push(cloudinaryResponse.secure_url);
                        fs.unlinkSync(newPath);
                    } catch (error) {
                        cloudinaryResponses.push(getLocalUploadUrl(localFileName));
                        if (!isTlsCertificateError(error)) {
                            throw error;
                        }
                    }
                }
            }

            res.json({
                message: 'ok',
                uploadedFiles,
                cloudinaryResponses,
                success: true,
            });
        } catch (error) {
            next(error);
        }
    });
});

app.post('/api/places', requireDatabase, requireAuth, asyncHandler(async (req, res) => {
    const {
        title, address, addPhotos, perks, extraInfo,
        checkInTime, checkOutTime, maxGuest, description, price,
    } = req.body;
    const checkInHour = parseListingHour(checkInTime);
    const checkOutHour = parseListingHour(checkOutTime);

    if (checkInHour === null || checkOutHour === null) {
        return res.status(400).json({
            success: false,
            message: 'Please enter valid check-in and check-out times, for example 7:00AM, 10:00PM, or 14.',
        });
    }

    const placeDoc = await Place.create({
        owner: req.user.id,
        title,
        address,
        photos: addPhotos || [],
        description,
        perks: perks || [],
        extraInfo,
        checkIn: checkInHour,
        checkOut: checkOutHour,
        maxGuests: Number(maxGuest || 1),
        price: Number(price || 0),
    });

    res.json(placeDoc);
}));

app.get('/api/places', requireDatabase, requireAuth, asyncHandler(async (req, res) => {
    const places = await Place.find({ owner: req.user.id }).sort({ createdAt: -1 });
    res.json(places);
}));

app.get('/api/places/:id', requireDatabase, asyncHandler(async (req, res) => {
    const place = await Place.findById(req.params.id);

    if (!place) {
        return res.status(404).json({ success: false, message: 'Place not found' });
    }

    res.json(place);
}));

app.put('/api/places', requireDatabase, requireAuth, asyncHandler(async (req, res) => {
    const {
        id, title, address, addPhotos, perks, extraInfo,
        checkInTime, checkOutTime, maxGuest, description, price,
    } = req.body;
    const checkInHour = parseListingHour(checkInTime);
    const checkOutHour = parseListingHour(checkOutTime);

    if (checkInHour === null || checkOutHour === null) {
        return res.status(400).json({
            success: false,
            message: 'Please enter valid check-in and check-out times, for example 7:00AM, 10:00PM, or 14.',
        });
    }

    const placeDoc = await Place.findById(id);

    if (!placeDoc) {
        return res.status(404).json({ success: false, message: 'Place not found' });
    }

    if (req.user.id !== placeDoc.owner.toString()) {
        return res.status(403).json({ success: false, message: 'You can only update your own place' });
    }

    await Place.findByIdAndUpdate(id, {
        title,
        address,
        photos: addPhotos || [],
        description,
        perks: perks || [],
        extraInfo,
        checkIn: checkInHour,
        checkOut: checkOutHour,
        maxGuests: Number(maxGuest || 1),
        price: Number(price || 0),
    }, { runValidators: true });

    res.json('ok');
}));

app.get('/api/home-places', requireDatabase, asyncHandler(async (req, res) => {
    const { search = '', maxPrice, perk, sort = 'recommended', guests } = req.query;
    const allPlaces = await searchPlaces({ search, maxPrice, perk, sort, guests });

    res.json({
        success: true,
        count: allPlaces.length,
        places: allPlaces,
    });
}));

app.post('/api/bookings', requireDatabase, requireAuth, asyncHandler(async (req, res) => {
    const data = req.body;
    const nights = Math.ceil((new Date(data.checkOut) - new Date(data.checkIn)) / (1000 * 60 * 60 * 24));
    const phone = String(data.phone || '').trim();
    const place = await Place.findById(data.place);

    if (!place) {
        return res.status(404).json({ success: false, message: 'Place not found' });
    }

    if (!nights || nights < 1) {
        return res.status(400).json({ success: false, message: 'Choose valid check-in and check-out dates' });
    }

    if (Number(data.numberOfGuests) > Number(place.maxGuests || 1)) {
        return res.status(400).json({ success: false, message: `This place allows up to ${place.maxGuests} guests` });
    }

    if (!isValidContactNumber(phone)) {
        return res.status(400).json({ success: false, message: 'Please enter a valid 10-digit contact number.' });
    }

    const totalPrice = Number(place.price || 0) * nights;
    const bookingDoc = await Booking.create({
        place: data.place,
        name: data.name,
        user: req.user.id,
        checkIn: data.checkIn,
        checkOut: data.checkOut,
        phone,
        price: totalPrice,
        numberOfGuests: Number(data.numberOfGuests || 1),
    });

    const populatedBooking = await bookingDoc.populate('place');
    const confirmationMessage = getBookingConfirmationMessage(populatedBooking);
    sendBookingConfirmationMessage(populatedBooking);

    res.json({ success: true, data: populatedBooking, confirmationMessage });
}));

app.get('/api/bookings', requireDatabase, requireAuth, asyncHandler(async (req, res) => {
    const bookings = await Booking.find({ user: req.user.id }).populate('place').sort({ createdAt: -1 });
    res.json({ success: true, data: bookings });
}));

app.get('/api/bookings/:id', requireDatabase, requireAuth, asyncHandler(async (req, res) => {
    const booking = await Booking.findOne({ _id: req.params.id, user: req.user.id }).populate('place');

    if (!booking) {
        return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    res.json({ success: true, data: booking });
}));

app.use((err, req, res, next) => {
    console.error(err);
    if (res.headersSent) return next(err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
    });
});

async function startServer() {
    try {
        await connectDB();
        const server = app.listen(port, () => {
            console.log(`app is listening on ${port}`);
        });

        server.on('error', (error) => {
            if (error.code === 'EADDRINUSE') {
                console.error(`Port ${port} is already in use. Stop the existing backend process or set another PORT in backend/.env.`);
                process.exit(1);
            }
            throw error;
        });
    } catch (error) {
        console.error('Backend startup failed:', error.message);
        process.exit(1);
    }
}

startServer();
