const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const prisma = require('./config/prisma');

dotenv.config({ path: require('path').resolve(__dirname, '.env') });

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/barbers', require('./routes/barberRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));

app.get('/', (req, res) => {
    res.send('Barber Booking API is running with PostgreSQL...');
});

// Database Connection Check
async function connectDB() {
    try {
        await prisma.$connect();
        console.log('PostgreSQL connected successfully via Prisma');
    } catch (err) {
        console.error('PostgreSQL connection error:', err);
        // During development, we might not want to exit if the DB isn't up yet
        // but for production it's usually better to fail fast.
    }
}

connectDB();

const PORT = process.env.PORT || 5001;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
});
